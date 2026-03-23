import { Suspense } from "react";
import { setRequestLocale } from "next-intl/server";
import ForgotPasswordForm from "./ForgotPasswordForm";

export default async function ForgotPasswordPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <Suspense>
      <ForgotPasswordForm />
    </Suspense>
  );
}
