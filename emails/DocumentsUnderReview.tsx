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

interface DocumentsUnderReviewEmailProps {
  customerName: string;
  orderId: string;
  locale?: string;
  serviceTier: "essential" | "standard" | "premium";
}

const DELIVERY_ESTIMATE: Record<"essential" | "standard" | "premium", string> = {
  essential: "approximately 7 business days",
  standard: "approximately 7 business days",
  premium: "approximately 48 hours",
};

export default function DocumentsUnderReviewEmail({
  customerName,
  orderId,
  locale = "en",
  serviceTier,
}: DocumentsUnderReviewEmailProps) {
  return (
    <Html lang={locale}>
      <Head />
      <Preview>
        We have received your documents — NIF application #
        {orderId.slice(0, 8).toUpperCase()} is under review
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
                Great news! Your payment is confirmed and we have received all
                the documents for your NIF application{" "}
                <strong>#{orderId.slice(0, 8).toUpperCase()}</strong>.
              </Text>

              {/* Status highlight */}
              <Section className="my-6 rounded-xl bg-green-50 px-6 py-5 text-center">
                <Text className="m-0 text-sm font-medium text-green-700">
                  Current Status
                </Text>
                <Text className="m-0 mt-1 text-xl font-bold text-green-800">
                  Documents Under Review
                </Text>
                <Text className="m-0 mt-2 text-sm text-green-700">
                  Expected delivery: {DELIVERY_ESTIMATE[serviceTier]}
                </Text>
              </Section>

              <Text className="text-gray-600">
                Our team will verify your documents and begin the NIF
                registration process with the Portuguese tax authority
                (Finanças). We will email you as soon as your NIF number is
                ready.
              </Text>

              <Button
                className="mt-4 rounded-lg bg-green-700 px-6 py-3 text-center text-sm font-semibold text-white"
                href={`${process.env.NEXT_PUBLIC_APP_URL}/${locale}/dashboard`}
              >
                Track Your Application →
              </Button>

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
