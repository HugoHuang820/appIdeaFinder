"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { AppHeader } from "@/src/components/app-header";
import { getDictionary } from "@/src/lib/dictionaries";
import type { DailyUsageStatus, Locale } from "@/src/lib/types";

type LocalizedHomeProps = {
  locale: Locale;
  examples: string[];
  initialKeyword: string;
  initialMarket: string;
  usageStatus: DailyUsageStatus;
};

const MARKET_OPTIONS = [
  { value: "Global", label: "Global / 全部" },
  { value: "Japan", label: "Japan / 日本" },
  { value: "United States", label: "United States / 美国" },
  { value: "China", label: "China / 中国" },
  { value: "South Korea", label: "South Korea / 韩国" },
  { value: "United Kingdom", label: "United Kingdom / 英国" },
  { value: "Germany", label: "Germany / 德国" },
  { value: "France", label: "France / 法国" },
  { value: "India", label: "India / 印度" },
  { value: "Canada", label: "Canada / 加拿大" },
  { value: "Australia", label: "Australia / 澳大利亚" },
];

export function LocalizedHome({ locale, examples, initialKeyword, initialMarket, usageStatus }: LocalizedHomeProps) {
  const dict = getDictionary(locale);
  const router = useRouter();
  const [keyword, setKeyword] = useState(initialKeyword);
  const [market, setMarket] = useState(initialMarket);
  const [exampleKeywords, setExampleKeywords] = useState(examples);
  const [submitting, setSubmitting] = useState(false);
  const [refreshingExamples, setRefreshingExamples] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setSubmitting(true);
      setError("");

      const response = await fetch("/api/ideas/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          keyword: keyword.trim(),
          market,
          locale,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok || !data?.taskId) {
        setError(data?.error?.message ?? "Failed to generate ideas.");
        return;
      }

      router.push(`/${locale}/results/${data.taskId}`);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleRefreshKeywords() {
    try {
      setRefreshingExamples(true);

      const search = new URLSearchParams({
        locale,
        market,
        count: String(exampleKeywords.length || 5),
      });

      exampleKeywords.forEach((example) => {
        search.append("exclude", example);
      });

      const response = await fetch(`/api/hot-keywords?${search.toString()}`, {
        cache: "no-store",
      });
      const data = (await response.json().catch(() => null)) as { keywords?: string[] } | null;

      if (response.ok && Array.isArray(data?.keywords) && data.keywords.length > 0) {
        setExampleKeywords(data.keywords);
      }
    } finally {
      setRefreshingExamples(false);
    }
  }

  return (
    <main className="page-shell">
      <AppHeader locale={locale} path="" />

      <section className="hero">
        <span className="chip">{dict.home.badge}</span>
        <h1>{dict.home.title}</h1>
        <p>{dict.home.subtitle}</p>

        <form className="input-row" onSubmit={handleSubmit}>
          <input
            aria-label={dict.common.keyword}
            autoCapitalize="off"
            autoCorrect="off"
            enterKeyHint="go"
            inputMode="search"
            onChange={(event) => setKeyword(event.target.value)}
            placeholder={dict.home.placeholder}
            value={keyword}
          />
          <label className="market-select">
            <span>{dict.common.market}</span>
            <select
              aria-label={dict.common.market}
              onChange={(event) => setMarket(event.target.value)}
              value={market}
            >
              {MARKET_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <button className="primary-button" disabled={submitting} type="submit">
            {submitting ? dict.home.generating : dict.home.generate}
          </button>
        </form>

        {error ? <p>{error}</p> : null}
        <p className="muted">{dict.home.autoKeywordHint}</p>

        <div className="example-list">
          <button className="secondary-button" disabled={refreshingExamples} onClick={() => void handleRefreshKeywords()} type="button">
            {refreshingExamples ? dict.home.refreshingKeywords : dict.home.refreshKeywords}
          </button>
          {exampleKeywords.map((example) => (
            <Link
              className="ghost-button"
              href={`/${locale}?keyword=${encodeURIComponent(example)}&market=${encodeURIComponent(market)}`}
              key={example}
            >
              {example}
            </Link>
          ))}
        </div>

        {usageStatus.showUpgradeCta ? (
          <div className="paywall-banner home-upgrade">
            <h2>{dict.home.upgradeTitle}</h2>
            <p>{dict.home.upgradeBody}</p>
            <div className="cta-row">
              <Link className="primary-button" href={`/${locale}/prices`}>
                {dict.home.upgradeCta}
              </Link>
            </div>
          </div>
        ) : null}
      </section>

      <section className="section-grid">
        <article className="section-card">
          <h2 className="section-title">{dict.home.simpleInputTitle}</h2>
          <p className="muted">{dict.home.simpleInputBody}</p>
        </article>
        <article className="section-card">
          <h2 className="section-title">{dict.home.actionableCardsTitle}</h2>
          <p className="muted">{dict.home.actionableCardsBody}</p>
        </article>
        <article className="section-card">
          <h2 className="section-title">{dict.home.fastUnlockTitle}</h2>
          <p className="muted">{dict.home.fastUnlockBody}</p>
        </article>
        <article className="section-card">
          <h2 className="section-title">{dict.home.signalTitle}</h2>
          <p className="muted">{dict.home.signalBody}</p>
        </article>
        <article className="section-card">
          <h2 className="section-title">{dict.home.trendingTitle}</h2>
          <p className="muted">{dict.home.trendingBody}</p>
        </article>
      </section>
    </main>
  );
}
