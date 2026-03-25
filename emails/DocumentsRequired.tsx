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

interface DocumentsRequiredEmailProps {
  customerName: string;
  orderId: string;
  locale?: string;
  deadlineAt: Date;
  missingDocs: Array<"passport" | "proof_of_address">;
}

const DOC_LABELS: Record<"passport" | "proof_of_address", string> = {
  passport: "Passport or National ID (clear photo or scan, all pages visible)",
  proof_of_address:
    "Proof of Address (utility bill or bank statement — issued within the last 3 months)",
};

export default function DocumentsRequiredEmail({
  customerName,
  orderId,
  locale = "en",
  deadlineAt,
  missingDocs,
}: DocumentsRequiredEmailProps) {
  const deadline = deadlineAt.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <Html lang={locale}>
      <Head />
      <Preview>
        Action required: upload your documents for NIF application #
        {orderId.slice(0, 8).toUpperCase()}
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
                Your payment for NIF application{" "}
                <strong>#{orderId.slice(0, 8).toUpperCase()}</strong> has been
                confirmed. To proceed, please upload the following document
                {missingDocs.length > 1 ? "s" : ""} by{" "}
                <strong>{deadline}</strong>:
              </Text>

              {/* Missing documents list */}
              <Section className="my-4 rounded-xl bg-amber-50 px-6 py-4">
                {missingDocs.map((doc) => (
                  <Text
                    key={doc}
                    className="m-0 py-1 text-sm font-medium text-amber-900"
                  >
                    • {DOC_LABELS[doc]}
                  </Text>
                ))}
              </Section>

              <Text className="text-sm text-gray-500">
                Accepted formats: PDF, JPG, PNG — maximum 10 MB per file.
              </Text>

              <Button
                className="mt-4 rounded-lg bg-green-700 px-6 py-3 text-center text-sm font-semibold text-white"
                href={`${process.env.NEXT_PUBLIC_APP_URL}/${locale}/dashboard`}
              >
                Upload Documents →
              </Button>

              <Hr className="my-6" />

              <Text className="text-sm text-gray-400">
                If you do not upload your documents by {deadline}, your
                application may be cancelled and a refund will be issued. If
                you have any questions, reply to this email or contact us at
                support@getnifportugal.com
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
