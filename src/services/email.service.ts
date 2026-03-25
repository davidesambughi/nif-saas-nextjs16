import { resend } from "@/lib/resend";
import { env } from "@/lib/env";
import OrderConfirmationEmail from "../../emails/OrderConfirmation";
import NIFIssuedEmail from "../../emails/NIFIssued";
import PaymentFailedEmail from "../../emails/PaymentFailed";
import DocumentsRequiredEmail from "../../emails/DocumentsRequired";
import DocumentsUnderReviewEmail from "../../emails/DocumentsUnderReview";

/**
 * Email service — pure send functions wrapping Resend.
 * Called by Server Actions and webhook handlers after DB mutations.
 */

export async function sendOrderConfirmation({
  to,
  customerName,
  orderId,
  serviceTier,
  amountPaid,
  locale = "en",
}: {
  to: string;
  customerName: string;
  orderId: string;
  serviceTier: "essential" | "standard" | "premium";
  amountPaid: number;
  locale?: string;
}): Promise<void> {
  await resend.emails.send({
    from: `${env.RESEND_FROM_NAME} <${env.RESEND_FROM_EMAIL}>`,
    to,
    subject: "✅ Your NIF Application is Confirmed!",
    react: OrderConfirmationEmail({
      customerName,
      orderId,
      serviceTier,
      amountPaid,
      locale,
    }),
  });
}

export async function sendPaymentFailed({
  to,
  customerName,
  orderId,
  locale = "en",
}: {
  to: string;
  customerName: string;
  orderId: string;
  locale?: string;
}): Promise<void> {
  await resend.emails.send({
    from: `${env.RESEND_FROM_NAME} <${env.RESEND_FROM_EMAIL}>`,
    to,
    subject: "⚠️ Action required: payment could not be processed",
    react: PaymentFailedEmail({ customerName, orderId, locale }),
  });
}

export async function sendDocumentsRequired({
  to,
  customerName,
  orderId,
  locale = "en",
  deadlineAt,
  missingDocs,
}: {
  to: string;
  customerName: string;
  orderId: string;
  locale?: string;
  deadlineAt: Date;
  missingDocs: Array<"passport" | "proof_of_address">;
}): Promise<void> {
  await resend.emails.send({
    from: `${env.RESEND_FROM_NAME} <${env.RESEND_FROM_EMAIL}>`,
    to,
    subject: "⚠️ Action required: upload your documents to continue",
    react: DocumentsRequiredEmail({ customerName, orderId, locale, deadlineAt, missingDocs }),
  });
}

export async function sendDocumentsUnderReview({
  to,
  customerName,
  orderId,
  locale = "en",
  serviceTier,
}: {
  to: string;
  customerName: string;
  orderId: string;
  locale?: string;
  serviceTier: "essential" | "standard" | "premium";
}): Promise<void> {
  await resend.emails.send({
    from: `${env.RESEND_FROM_NAME} <${env.RESEND_FROM_EMAIL}>`,
    to,
    subject: "✅ Documents received — your NIF application is under review",
    react: DocumentsUnderReviewEmail({ customerName, orderId, locale, serviceTier }),
  });
}

export async function sendNIFIssued({
  to,
  customerName,
  nifNumber,
  orderId,
  locale = "en",
}: {
  to: string;
  customerName: string;
  nifNumber: string;
  orderId: string;
  locale?: string;
}): Promise<void> {
  await resend.emails.send({
    from: `${env.RESEND_FROM_NAME} <${env.RESEND_FROM_EMAIL}>`,
    to,
    subject: "🎉 Your Portuguese NIF is Ready!",
    react: NIFIssuedEmail({ customerName, nifNumber, orderId, locale }),
  });
}
