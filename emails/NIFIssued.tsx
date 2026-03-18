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

interface NIFIssuedEmailProps {
  customerName: string;
  nifNumber: string;
  orderId: string;
}

export default function NIFIssuedEmail({
  customerName,
  nifNumber,
  orderId,
}: NIFIssuedEmailProps) {
  return (
    <Html lang="en">
      <Head />
      <Preview>🎉 Your Portuguese NIF number is ready!</Preview>
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
                Congratulations, {customerName}! 🎉
              </Text>
              <Text className="text-gray-600">
                Your Portuguese NIF (Número de Identificação Fiscal) has been
                successfully issued. Here is your number:
              </Text>

              {/* NIF Highlight */}
              <Section className="my-6 rounded-xl bg-green-50 px-6 py-5 text-center">
                <Text className="m-0 text-sm font-medium text-green-700">
                  Your NIF Number
                </Text>
                <Text className="m-0 mt-1 text-4xl font-bold tracking-widest text-green-800">
                  {nifNumber}
                </Text>
              </Section>

              <Hr className="my-6" />

              <Text className="text-gray-600">
                <strong>Order Reference:</strong> #{orderId.slice(0, 8).toUpperCase()}
              </Text>
              <Text className="text-gray-600">
                Please save this number in a secure place. You will need it for
                any financial, tax, or legal activity in Portugal.
              </Text>

              <Button
                className="mt-4 rounded-lg bg-green-700 px-6 py-3 text-center text-sm font-semibold text-white"
                href={`${process.env.NEXT_PUBLIC_APP_URL}/en/dashboard`}
              >
                View Full Details →
              </Button>

              <Hr className="my-6" />

              <Text className="text-sm text-gray-400">
                Thank you for choosing GetNIFPortugal. We hope to serve you again!
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
