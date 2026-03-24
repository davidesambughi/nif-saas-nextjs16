import { resend } from "@/lib/resend";
import { env } from "@/lib/env";
import OrderConfirmationEmail from "../../emails/OrderConfirmation";
import NIFIssuedEmail from "../../emails/NIFIssued";
import PaymentFailedEmail from "../../emails/PaymentFailed";

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
