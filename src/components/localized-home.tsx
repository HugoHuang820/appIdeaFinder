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
  usageStatus: DailyUsageStatus;
};

export function LocalizedHome({ locale, examples, usageStatus }: LocalizedHomeProps) {
  const dict = getDictionary(locale);
  const router = useRouter();
  const [keyword, setKeyword] = useState("");
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
          market: "Japan",
          locale,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok || !data?.taskId) {
        setError(data?.error?.message ?? "Failed to generate ideas.");
        return;
      }

      router.push(`/${locale}/results/${data.taskId}`);
      router.refresh();
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
            <button
              className="ghost-button"
              key={example}
              onClick={() => setKeyword(example)}
              type="button"
            >
              {example}
            </button>
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
