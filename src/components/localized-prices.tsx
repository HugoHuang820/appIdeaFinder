"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { AppHeader } from "@/src/components/app-header";
import { getDictionary } from "@/src/lib/dictionaries";
import type { Locale } from "@/src/lib/types";

type LocalizedPricesProps = {
  locale: Locale;
};

export function LocalizedPrices({ locale }: LocalizedPricesProps) {
  const dict = getDictionary(locale);
  const router = useRouter();
  const searchParams = useSearchParams();
  const paymentStatus = searchParams.get("payment");
  const taskId = searchParams.get("taskId");
  const [subscribing, setSubscribing] = useState(false);
  const [error, setError] = useState("");

  async function handleSubscribe() {
    setSubscribing(true);
    setError("");
    router.push(taskId ? `/${locale}/pay?taskId=${taskId}&mode=subscription` : `/${locale}/pay?mode=subscription`);
  }

  return (
    <main className="page-shell">
      <AppHeader locale={locale} path="/prices" />

      <section className="hero">
        <span className="chip">{dict.prices.badge}</span>
        <h1>{dict.prices.title}</h1>
        <p>{dict.prices.subtitle}</p>
        {paymentStatus === "success" ? <p className="pricing-success">{dict.prices.subscriptionSuccess}</p> : null}
        {error ? <p>{error}</p> : null}
      </section>

      <section className="pricing-grid">
        <article className="pricing-card">
          <span className="idea-card__badge">{dict.common.oneTime}</span>
          <h2>{dict.prices.oneTimeTitle}</h2>
          <div className="price-tag">{dict.prices.oneTimePrice}</div>
          <p className="muted">{dict.prices.oneTimeDescription}</p>
          <h3 className="section-title">{dict.prices.includedTitle}</h3>
          <ul className="feature-list">
            {dict.prices.oneTimeFeatures.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>

        <article className="pricing-card pricing-card--featured">
          <div className="pricing-card__hero">
            <span className="idea-card__badge">{dict.common.subscription}</span>
            <span className="pricing-recommended">{dict.prices.recommendedBadge}</span>
          </div>
          <h2>{dict.prices.subscriptionTitle}</h2>
          <div className="price-tag">{dict.prices.subscriptionPrice}</div>
          <p className="muted">{dict.prices.subscriptionDescription}</p>
          <p className="pricing-highlight">{dict.prices.nextGenerationBonus}</p>
          <div className="cta-row pricing-card__cta">
            <button className="primary-button" disabled={subscribing} onClick={() => void handleSubscribe()} type="button">
              {subscribing ? dict.prices.subscribingNow : dict.prices.subscribeNow}
            </button>
          </div>
          <h3 className="section-title">{dict.prices.includedTitle}</h3>
          <ul className="feature-list">
            {dict.prices.subscriptionFeatures.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </section>

      <section className="soft-banner">
        <strong>{dict.common.prices}.</strong> {dict.prices.comparisonNote}
        {taskId ? (
          <div className="cta-row inline-cta-row">
            <Link className="ghost-button" href={`/${locale}/results/${taskId}`}>
              {dict.pay.backResults}
            </Link>
          </div>
        ) : null}
      </section>
    </main>
  );
}
