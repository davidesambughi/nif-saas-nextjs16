import { Suspense } from "react";
import OrderContent from "./OrderContent";

export default function OrderPage() {
  return (
    <Suspense>
      <OrderContent />
    </Suspense>
  );
}
