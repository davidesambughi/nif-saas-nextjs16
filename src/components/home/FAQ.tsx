// Server Component — no "use client" needed here
import { getTranslations } from "next-intl/server";
import FAQAccordion from "./FAQAccordion";

export const FAQ_KEYS = ["q1", "q2", "q3", "q4", "q5", "q6", "q7", "q8", "q9", "q10", "q11"] as const;

export default async function FAQ() {
  const t = await getTranslations("faq");

  const items = FAQ_KEYS.map((key, i) => ({
    question: t(key as "q1"),
    answer: t(`a${i + 1}` as "a1"),
  }));

  return (
    <section
      className="section-pad"
      style={{ background: "var(--color-surface)" }}
    >
      <div className="container-site max-w-3xl">
        <div className="text-center mb-14">
          <h2
            className="text-heading-xl mb-4"
            style={{ color: "var(--color-ink)" }}
          >
            {t("title")}
          </h2>
        </div>

        {/* Interactive accordion — client boundary starts here */}
        <FAQAccordion items={items} />
      </div>
    </section>
  );
}
