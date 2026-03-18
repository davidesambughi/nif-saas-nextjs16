import { getTranslations } from "next-intl/server";

const STATS = [
  { value: "2,000+", labelKey: "statsNifs" },
  { value: "45+", labelKey: "statsCountries" },
  { value: "5.2", labelKey: "statsDays" },
  { value: "4.9★", labelKey: "statsRating" },
] as const;

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
          {STATS.map(({ value, labelKey }) => (
            <div key={labelKey} className="py-5 px-6 text-center">
              <p
                className="text-2xl font-black leading-none mb-1"
                style={{
                  color: "var(--color-green)",
                  fontFamily: "var(--font-display)",
                }}
              >
                {value}
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
