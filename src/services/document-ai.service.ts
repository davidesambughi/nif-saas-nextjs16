/**
 * AI Document Review Service
 *
 * Uses Google Gemini 1.5 Flash (free tier) to automatically verify each
 * uploaded document before human review.
 *
 * Design principles:
 * - This is a pure service: no Next.js imports, no Supabase client.
 *   It receives a pre-generated file URL and returns a typed result.
 *   WHY? Services in this codebase have no framework dependencies —
 *   they're easier to test and can be called from anywhere.
 * - Failures are soft: any error returns status "error" instead of throwing,
 *   so a Gemini outage never crashes the main flow.
 */

import { generateText, Output } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { z } from "zod";
import { env } from "@/lib/env";
import type { OrderDocument } from "@/db/schema";

// ─── Result types ─────────────────────────────────────────────────────────────

/**
 * The structured shape we ask Gemini to return, validated by Zod.
 *
 * WHY Zod schema here?
 * `Output.object({ schema })` does two things: (1) tells Gemini to return
 * JSON in this exact shape (via JSON mode / function calling), and (2)
 * validates and parses the response automatically. If Gemini hallucinates
 * extra fields or wrong types, Zod catches it and throws — which we handle
 * in the catch block below.
 *
 * ALTERNATIVE: parse `result.text` manually with JSON.parse().
 * That works but is fragile — Gemini sometimes wraps JSON in markdown code
 * fences (```json ... ```) which breaks JSON.parse(). Output.object avoids
 * this entirely.
 */
const geminiReviewSchema = z.object({
  isCorrectType: z
    .boolean()
    .describe("Is this actually the claimed document type?"),

  nameFound: z
    .string()
    .nullable()
    .describe("Full name as written on the document. Null if unreadable."),

  nameMatch: z
    .boolean()
    .nullable()
    .describe(
      "Does nameFound match the customer name? Null if nameFound is null."
    ),

  expiryOrIssueDate: z
    .string()
    .nullable()
    .describe(
      "Passport expiry date OR proof-of-address issue date in YYYY-MM-DD format. Null if not found."
    ),

  isValid: z
    .boolean()
    .describe(
      "For passport: not expired. For proof of address: issued within last 6 months."
    ),

  issues: z
    .array(z.string())
    .describe("Specific problems found. Empty array if none."),

  confidence: z
    .enum(["high", "medium", "low"])
    .describe("Model's confidence in this assessment."),
});

/**
 * What this service returns — what gets saved to the database.
 *
 * WHY serialize notes to JSON string instead of a typed object?
 * The DB column is `text` (not jsonb). We serialise here so the repository
 * just does a plain INSERT with no extra transformation.
 */
export type DocumentReviewResult = {
  status: "approved" | "flagged" | "error";
  notes: string; // JSON.stringify of geminiReviewSchema, or { error: string }
};

// ─── Main analysis function ───────────────────────────────────────────────────

/**
 * Analyzes one document with Gemini and returns a review result.
 *
 * @param doc         The document record from the DB (needs documentType, mimeType)
 * @param fileUrl     A pre-generated short-lived signed URL to download the file
 * @param orderFullName  The customer's full name from the order (for name matching)
 */
export async function analyzeDocument(
  doc: OrderDocument,
  fileUrl: string,
  orderFullName: string
): Promise<DocumentReviewResult> {
  // Guard: if the key isn't configured, fail gracefully
  if (!env.GOOGLE_GENERATIVE_API_KEY) {
    return errorResult("GOOGLE_GENERATIVE_API_KEY is not configured");
  }

  // ── Step 1: Download the file ──────────────────────────────────────────────
  // WHY download instead of passing the URL directly to Gemini?
  // Supabase signed URLs are private and expire quickly. Gemini would need
  // to fetch the URL itself, but it can't — it has no access to Supabase.
  // We download the bytes on our server and send them as base64.
  let fileBuffer: Buffer;
  try {
    const response = await fetch(fileUrl);
    if (!response.ok) {
      throw new Error(`Download failed with HTTP ${response.status}`);
    }
    const arrayBuffer = await response.arrayBuffer();
    fileBuffer = Buffer.from(arrayBuffer);
  } catch (err) {
    return errorResult(`Could not download document file: ${String(err)}`);
  }

  // ── Step 2: Build the prompt ───────────────────────────────────────────────
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  const isPassport = doc.documentType === "passport";
  const docLabel = isPassport
    ? "a PASSPORT"
    : "a PROOF OF ADDRESS (bank statement, utility bill, official letter, etc.)";

  const validityRule = isPassport
    ? "A passport is expired if its expiry date is on or before today."
    : "A proof of address is too old if it was issued more than 6 months before today.";

  const prompt = `You are a document verification assistant for a Portuguese NIF (tax ID) application service.

The customer claims this document is: ${docLabel}
The customer's full name on the order: "${orderFullName}"
Today's date: ${today}

Carefully examine the document and fill in the structured output.

Rules:
- ${validityRule}
- Name matching is case-insensitive and should allow minor differences (accents, middle names, initials).
- If you cannot read a field clearly, set it to null rather than guessing.
- List every specific problem you find in the "issues" array. Use plain English.
- Set confidence to "low" if the image is blurry, cropped, or partially obscured.`;

  // ── Step 3: Call Gemini ────────────────────────────────────────────────────
  try {
    const isPdf = doc.mimeType === "application/pdf";

    /**
     * WHY Output.object() instead of prompt-engineering for JSON?
     * Output.object() activates Gemini's native JSON mode (controlled
     * generation). The model is constrained to produce valid JSON matching
     * the schema. Without it, we'd get free-form text that sometimes wraps
     * the JSON in ```json fences or adds explanatory sentences — breaking
     * any parser.
     *
     * WHY gemini-2.0-flash and not gemini-1.5-flash?
     * gemini-1.5-flash (bare name) was deprecated by Google — the v1beta endpoint
     * no longer resolves it. gemini-2.0-flash is the current free-tier equivalent:
     * same speed, same cost, better multimodal understanding.
     */
    // createGoogleGenerativeAI lets us pass the key explicitly.
    // The default `google` export auto-reads GOOGLE_GENERATIVE_AI_API_KEY from env,
    // but our variable is named GOOGLE_GENERATIVE_API_KEY — one word off.
    const googleAI = createGoogleGenerativeAI({ apiKey: env.GOOGLE_GENERATIVE_API_KEY });
    const { output } = await generateText({
      model: googleAI("gemini-2.5-flash"),
      output: Output.object({ schema: geminiReviewSchema }),
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            // WHY different part types for PDF vs image?
            // The AI SDK distinguishes between "image" parts (inline pixels,
            // natively supported by all vision models) and "file" parts
            // (arbitrary binary, fewer models support it — Gemini does for PDFs).
            isPdf
              ? {
                  type: "file" as const,
                  mediaType: "application/pdf" as const,
                  data: fileBuffer,
                }
              : {
                  type: "image" as const,
                  image: fileBuffer,
                  // No explicit mimeType needed — the SDK detects it from the buffer header
                },
          ],
        },
      ],
    });

    // ── Step 4: Determine final status ────────────────────────────────────────
    // A document is flagged if ANY of these are true:
    const hasIssues =
      !output.isCorrectType ||
      output.nameMatch === false ||
      !output.isValid ||
      output.issues.length > 0;

    return {
      status: hasIssues ? "flagged" : "approved",
      notes: JSON.stringify(output),
    };
  } catch (err) {
    // Gemini call failed (network, rate limit, schema validation error)
    console.error("[DocumentAI] Analysis failed:", err);
    return errorResult(`AI analysis failed — review manually. Error: ${String(err)}`);
  }
}

// ─── Helper ───────────────────────────────────────────────────────────────────

/**
 * Builds an "error" result for any failure scenario.
 * Stored in the DB so the admin knows AI didn't run rather than thinking it passed.
 */
function errorResult(reason: string): DocumentReviewResult {
  return {
    status: "error",
    notes: JSON.stringify({ error: reason }),
  };
}
