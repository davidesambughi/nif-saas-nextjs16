import {
  Body,
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

interface OrderCancelledEmailProps {
  customerName: string;
  orderId: string;
  locale?: string;
}

export default function OrderCancelledEmail({
  customerName,
  orderId,
  locale = "en",
}: OrderCancelledEmailProps) {
  return (
    <Html lang={locale}>
      <Head />
      <Preview>
        Your NIF application #{orderId.slice(0, 8).toUpperCase()} has been cancelled and refunded
      </Preview>
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
                Your NIF application{" "}
                <strong>#{orderId.slice(0, 8).toUpperCase()}</strong> has been
                cancelled and a full refund has been issued to your original
                payment method.
              </Text>

              <Section className="my-6 rounded-xl bg-gray-50 px-6 py-5 text-center">
                <Text className="m-0 text-sm font-medium text-gray-500">
                  Application Status
                </Text>
                <Text className="m-0 mt-1 text-xl font-bold text-gray-800">
                  Cancelled &amp; Refunded
                </Text>
                <Text className="m-0 mt-2 text-sm text-gray-500">
                  Refunds typically appear within 5–10 business days depending
                  on your bank.
                </Text>
              </Section>

              <Text className="text-gray-600">
                If you cancelled by mistake or would like to apply again, you
                can start a new application at any time.
              </Text>

              <Hr className="my-6" />

              <Text className="text-sm text-gray-400">
                If you have any questions, reply to this email or contact us at
                support@getnifportugal.com
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
