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

interface OrderConfirmationEmailProps {
  customerName: string;
  orderId: string;
  serviceTier: "standard" | "express";
  amountPaid: number; // in cents
}

const tierLabels = {
  standard: "Standard (5–7 business days)",
  express: "Express (48–72 hours)",
};

export default function OrderConfirmationEmail({
  customerName,
  orderId,
  serviceTier,
  amountPaid,
}: OrderConfirmationEmailProps) {
  const amount = (amountPaid / 100).toFixed(2);

  return (
    <Html lang="en">
      <Head />
      <Preview>Your NIF application #{orderId.slice(0, 8)} is confirmed!</Preview>
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
                Great news! Your NIF application has been received and your
                payment processed. Our team will start processing your request
                shortly.
              </Text>

              <Hr className="my-6" />

              <Heading className="text-base font-semibold text-gray-900">
                Order Summary
              </Heading>
              <Text className="text-gray-600">
                <strong>Order ID:</strong> #{orderId.slice(0, 8).toUpperCase()}
              </Text>
              <Text className="text-gray-600">
                <strong>Service:</strong> {tierLabels[serviceTier]}
              </Text>
              <Text className="text-gray-600">
                <strong>Amount Paid:</strong> €{amount}
              </Text>

              <Hr className="my-6" />

              <Text className="text-gray-600">
                We will email you as soon as your NIF is ready. You can also
                track the status of your application in your dashboard.
              </Text>

              <Button
                className="mt-4 rounded-lg bg-green-700 px-6 py-3 text-center text-sm font-semibold text-white"
                href={`${process.env.NEXT_PUBLIC_APP_URL}/en/dashboard`}
              >
                View Dashboard →
              </Button>

              <Hr className="my-6" />

              <Text className="text-sm text-gray-400">
                If you have any questions, reply to this email or contact us at{" "}
                support@getnifportugal.com
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
