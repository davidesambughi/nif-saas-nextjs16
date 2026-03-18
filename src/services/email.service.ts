import { resend } from "@/lib/resend";
import { env } from "@/lib/env";
import OrderConfirmationEmail from "../../emails/OrderConfirmation";
import NIFIssuedEmail from "../../emails/NIFIssued";

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
}: {
  to: string;
  customerName: string;
  orderId: string;
  serviceTier: "standard" | "express";
  amountPaid: number;
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
    }),
  });
}

export async function sendNIFIssued({
  to,
  customerName,
  nifNumber,
  orderId,
}: {
  to: string;
  customerName: string;
  nifNumber: string;
  orderId: string;
}): Promise<void> {
  await resend.emails.send({
    from: `${env.RESEND_FROM_NAME} <${env.RESEND_FROM_EMAIL}>`,
    to,
    subject: "🎉 Your Portuguese NIF is Ready!",
    react: NIFIssuedEmail({ customerName, nifNumber, orderId }),
  });
}
