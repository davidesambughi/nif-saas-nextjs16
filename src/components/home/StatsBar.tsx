import { getTranslations } from "next-intl/server";
import CountUp from "@/components/shared/CountUp";

interface StatConfig {
  to: number;
  suffix?: string;
  decimals?: number;
  separator?: boolean;
  duration?: number;
  labelKey: "statsNifs" | "statsCountries" | "statsDays" | "statsRating";
}

const STATS: StatConfig[] = [
  { to: 2000, suffix: "+", separator: true, duration: 2.0, labelKey: "statsNifs" },
  { to: 45, suffix: "+", duration: 1.4, labelKey: "statsCountries" },
  { to: 5.2, decimals: 1, duration: 1.2, labelKey: "statsDays" },
  { to: 4.9, suffix: "★", decimals: 1, duration: 1.2, labelKey: "statsRating" },
];

export default async function StatsBar() {
  const t = await getTranslations("hero");

  return (
    <div
      className="border-y"
      style={{
        background: "var(--color-surface-elevated)",
        borderColor: "var(--color-border)",
      }}
    >
      <div className="container-site">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-[var(--color-border)]">
          {STATS.map(({ to, suffix, decimals, separator, duration, labelKey }) => (
            <div key={labelKey} className="py-5 px-6 text-center">
              <p
                className="text-2xl font-black font-display leading-none mb-1 text-green"
              >
                <CountUp
                  to={to}
                  suffix={suffix}
                  decimals={decimals}
                  separator={separator}
                  duration={duration}
                />
              </p>
              <p
                className="text-xs uppercase tracking-wider"
                style={{ color: "var(--color-ink-muted)" }}
              >
                {t(labelKey)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
