import { Suspense } from "react";
import { setRequestLocale } from "next-intl/server";
import OrderContent from "./OrderContent";

export default async function OrderPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <Suspense>
      <OrderContent />
    </Suspense>
  );
}
