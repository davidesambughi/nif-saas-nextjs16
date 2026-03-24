import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Tailwind,
  Hr,
} from "@react-email/components";

interface PaymentFailedEmailProps {
  customerName: string;
  orderId: string;
  locale?: string;
}

export default function PaymentFailedEmail({
  customerName,
  orderId,
  locale = "en",
}: PaymentFailedEmailProps) {
  return (
    <Html lang={locale}>
      <Head />
      <Preview>Action required: your payment for NIF #{orderId.slice(0, 8).toUpperCase()} could not be processed</Preview>
      <Tailwind>
        <Body className="bg-gray-50 font-sans">
          <Container className="mx-auto max-w-xl py-8">
            {/* Header */}
            <Section className="rounded-t-2xl bg-green-700 px-8 py-6 text-center">
              <Heading className="m-0 text-2xl font-bold text-white">
                GetNIFPortugal
              </Heading>
            </Section>

            {/* Body */}
            <Section className="rounded-b-2xl bg-white px-8 py-8 shadow-sm">
              <Text className="text-lg font-semibold text-gray-900">
                Hi {customerName},
              </Text>
              <Text className="text-gray-600">
                We were unable to process your payment for NIF application{" "}
                <strong>#{orderId.slice(0, 8).toUpperCase()}</strong>. This can
                happen due to an expired card, insufficient funds, or a
                temporary issue with your bank.
              </Text>

              <Hr className="my-6" />

              <Text className="text-gray-600">
                Your application is still open. Please return to checkout and
                try again with the same or a different payment method — no new
                application needed.
              </Text>

              <Button
                className="mt-4 rounded-lg bg-green-700 px-6 py-3 text-center text-sm font-semibold text-white"
                href={`${process.env.NEXT_PUBLIC_APP_URL}/${locale}/dashboard`}
              >
                Return to Dashboard →
              </Button>

              <Hr className="my-6" />

              <Text className="text-sm text-gray-400">
                If you keep experiencing issues, please reply to this email or
                contact us at support@getnifportugal.com and we will help you
                complete your order.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
