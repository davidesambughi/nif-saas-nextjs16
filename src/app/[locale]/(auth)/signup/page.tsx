import { Suspense } from "react";
import { setRequestLocale } from "next-intl/server";
import SignupForm from "./SignupForm";

export default async function SignupPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <Suspense>
      <SignupForm />
    </Suspense>
  );
}
