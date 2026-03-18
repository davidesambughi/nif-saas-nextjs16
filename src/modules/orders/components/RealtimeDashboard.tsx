"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import type { Order, OrderStatus } from "@/db/schema";

const STATUS_STEPS: OrderStatus[] = [
  "pending_payment",
  "payment_received",
  "documents_required",
  "documents_under_review",
  "nif_processing",
  "nif_issued",
];

interface RealtimeDashboardProps {
  initialOrders: Order[];
  locale: string;
}

export default function RealtimeDashboard({
  initialOrders,
  locale,
}: RealtimeDashboardProps) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const t = useTranslations("dashboard");

  useEffect(() => {
    const supabase = createClient();

    // Subscribe to status_updates for all orders owned by the current user
    const channel = supabase
      .channel("dashboard-status-updates")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "status_updates",
        },
        (payload) => {
          const update = payload.new as { order_id: string; status: OrderStatus };

          // Update the matching order's status in local state
          setOrders((prev) =>
            prev.map((o) =>
              o.id === update.order_id
                ? { ...o, status: update.status }
                : o
            )
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="space-y-6">
      {orders.map((order, i) => (
        <motion.div
          key={order.id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08, duration: 0.4 }}
          className="card p-6"
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <p
                className="text-xs font-medium uppercase tracking-wider mb-1"
                style={{ color: "var(--color-ink-muted)" }}
              >
                {t("orderId")}{order.id.slice(0, 8).toUpperCase()}
              </p>
              <p className="text-lg font-bold" style={{ color: "var(--color-ink)" }}>
                {order.fullName}
              </p>
              <p className="text-sm mt-0.5" style={{ color: "var(--color-ink-muted)" }}>
                {order.serviceTier.charAt(0).toUpperCase() + order.serviceTier.slice(1)} •{" "}
                {t("submitted")}{" "}
                {new Date(order.createdAt).toLocaleDateString(locale, {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>
            <StatusBadge status={order.status} t={t} />
          </div>

          {/* Progress stepper */}
          {order.status !== "cancelled" && (
            <OrderStatusStepper currentStatus={order.status} t={t} />
          )}

          {order.nifNumber && (
            <div
              className="mt-6 rounded-xl p-4 text-center"
              style={{ background: "rgba(0,102,0,0.06)" }}
            >
              <p className="text-xs font-medium mb-1" style={{ color: "var(--color-brand-green)" }}>
                Your NIF Number
              </p>
              <p
                className="text-3xl font-extrabold tracking-widest"
                style={{ color: "var(--color-brand-green-dark)" }}
              >
                {order.nifNumber}
              </p>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
}

function StatusBadge({ status, t }: { status: OrderStatus; t: ReturnType<typeof useTranslations> }) {
  const colorMap: Record<OrderStatus, string> = {
    pending_payment: "badge-amber",
    payment_received: "badge-blue",
    documents_required: "badge-amber",
    documents_under_review: "badge-blue",
    nif_processing: "badge-blue",
    nif_issued: "badge-green",
    cancelled: "badge-red",
  };

  return (
    <span className={`badge ${colorMap[status]}`}>
      {t(`status.${status}` as "status.pending_payment")}
    </span>
  );
}

function OrderStatusStepper({ currentStatus, t }: { currentStatus: OrderStatus; t: ReturnType<typeof useTranslations> }) {
  const currentIndex = STATUS_STEPS.indexOf(currentStatus);

  return (
    <div className="relative">
      <div
        className="absolute top-4 left-0 right-0 h-px"
        style={{ background: "var(--color-border)" }}
      />
      <div className="relative flex justify-between">
        {STATUS_STEPS.map((status, i) => {
          const isDone = i < currentIndex;
          const isActive = i === currentIndex;

          return (
            <div key={status} className="flex flex-col items-center gap-2 px-1">
              <div
                className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all duration-300"
                style={{
                  background: isDone || isActive
                    ? "var(--color-brand-green)"
                    : "var(--color-surface-elevated)",
                  border: `2px solid ${isDone || isActive ? "var(--color-brand-green)" : "var(--color-border)"}`,
                  color: isDone || isActive ? "#ffffff" : "var(--color-ink-subtle)",
                }}
              >
                {isDone ? "✓" : i + 1}
              </div>
              <span
                className="text-center hidden lg:block"
                style={{
                  fontSize: "0.65rem",
                  lineHeight: "1.2",
                  maxWidth: "4rem",
                  color: isActive
                    ? "var(--color-brand-green)"
                    : "var(--color-ink-muted)",
                  fontWeight: isActive ? "600" : "400",
                }}
              >
                {t(`status.${status}` as "status.pending_payment")}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
