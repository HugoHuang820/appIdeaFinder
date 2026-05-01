"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { AppHeader } from "@/src/components/app-header";
import { CopyButton } from "@/src/components/copy-button";
import { IdeaCard } from "@/src/components/idea-card";
import { getDictionary } from "@/src/lib/dictionaries";
import { DEFAULT_SUBSCRIPTION_PLAN_ID, getSubscriptionPlan } from "@/src/lib/subscription-plans";
import type { IdeaTask, Locale, PaymentOrder, PurchaseType } from "@/src/lib/types";

type LocalizedResultsProps = {
  locale: Locale;
  taskId: string;
  paymentStatus?: string;
};

export function LocalizedResults({ locale, taskId, paymentStatus }: LocalizedResultsProps) {
  const dict = getDictionary(locale);
  const recommendedSubscriptionPlan = getSubscriptionPlan(DEFAULT_SUBSCRIPTION_PLAN_ID);
  const router = useRouter();
  const [task, setTask] = useState<IdeaTask | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState<PurchaseType | null>(null);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(12);
  const processingRequestRef = useRef<Promise<IdeaTask> | null>(null);
  const processingStartedRef = useRef(false);

  const fetchTask = useCallback(async (full: boolean) => {
    const response = await fetch(`/api/ideas/${taskId}${full ? "" : "/preview"}`, {
      cache: "no-store",
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.error?.message ?? "Failed to load results.");
    }

    setTask(data);
    setError("");
    setLoading(false);
    return data as IdeaTask;
  }, [taskId]);

  const loadTask = useCallback(() => fetchTask(false), [fetchTask]);

  const processTask = useCallback(async () => {
    if (processingRequestRef.current) {
      return processingRequestRef.current;
    }

    processingRequestRef.current = (async () => {
      const response = await fetch(`/api/ideas/${taskId}/process`, {
        method: "POST",
        cache: "no-store",
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error?.message ?? "Failed to generate ideas.");
      }

      return data as IdeaTask;
    })().finally(() => {
      processingRequestRef.current = null;
    });

    return processingRequestRef.current;
  }, [taskId]);

  useEffect(() => {
    let active = true;
    let timer: number | undefined;

    async function poll() {
      try {
        const data = await fetchTask(paymentStatus === "success");
        if (!active) {
          return;
        }

        if (
          data.status === "pending" ||
          data.status === "processing" ||
          (paymentStatus === "success" && !data.isUnlocked)
        ) {
          if ((data.status === "pending" || data.status === "processing") && !processingStartedRef.current) {
            processingStartedRef.current = true;
            void processTask()
              .then((processedTask) => {
                if (!active) {
                  return;
                }

                setTask(processedTask);
                setError("");
                setLoading(false);
              })
              .catch((processError) => {
                if (!active) {
                  return;
                }

                setError(processError instanceof Error ? processError.message : "Failed to generate ideas.");
                setLoading(false);
              })
              .finally(() => {
                processingStartedRef.current = false;
              });
          }

          timer = window.setTimeout(poll, 1500);
          return;
        }

        if (data.isUnlocked) {
          const fullTask = await fetchTask(true);
          if (!active) {
            return;
          }

          setTask(fullTask);
          return;
        }
      } catch (fetchError) {
        if (!active) {
          return;
        }

        setError(fetchError instanceof Error ? fetchError.message : "Failed to load results.");
        setLoading(false);
      }
    }

    void poll();

    return () => {
      active = false;
      if (timer) {
        window.clearTimeout(timer);
      }
    };
  }, [fetchTask, paymentStatus, processTask]);

  const isGenerating =
    loading ||
    !task ||
    ((task.status === "pending" || task.status === "processing") && task.ideas.length === 0);
  const displayProgress = isGenerating ? Math.max(progress, task?.status === "processing" ? 48 : 12) : 100;

  useEffect(() => {
    if (!isGenerating) {
      return;
    }

    const timer = window.setInterval(() => {
      setProgress((current) => {
        const maxProgress = task?.status === "processing" ? 94 : 72;
        const step = current < 36 ? 8 : current < 68 ? 5 : 2;
        return Math.min(current + step, maxProgress);
      });
    }, 700);

    return () => {
      window.clearInterval(timer);
    };
  }, [isGenerating, task?.status]);

  const exportText = useMemo(() => {
    if (!task?.isUnlocked) {
      return "";
    }

    return task.ideas
      .map((idea) =>
        [
          idea.name,
          idea.oneLine,
          `${dict.ideaCard.targetUsers}: ${idea.targetUsers.join(", ")}`,
          `${dict.ideaCard.why}: ${idea.why ?? ""}`,
          `${dict.ideaCard.signalSummary}: ${idea.signalSummary?.summary ?? ""}`,
          `${dict.ideaCard.aso}: ${idea.aso.title ?? ""} / ${idea.aso.subtitle ?? ""}`,
          `${dict.ideaCard.heroHook}: ${idea.aso.heroHook ?? ""}`,
          `${dict.ideaCard.description}: ${idea.aso.description ?? ""}`,
          `${dict.ideaCard.keywords}: ${idea.aso.keywords.join(", ")}`,
          `${dict.ideaCard.valueBullets}: ${(idea.aso.valueBullets ?? []).join(" | ")}`,
          `${dict.ideaCard.paywallCopy}: ${idea.aso.paywallCopy ?? ""}`,
          `${dict.ideaCard.productSummary}: ${idea.buildPackage?.productSummary ?? ""}`,
          `${dict.ideaCard.mvpFeatures}: ${(idea.buildPackage?.mvpFeatures ?? []).join(", ")}`,
          `${dict.ideaCard.v1Roadmap}: ${(idea.buildPackage?.v1Roadmap ?? []).join(", ")}`,
          `${dict.ideaCard.devPromptKit}: ${(idea.buildPackage?.devPromptKit ?? []).join(" | ")}`,
          `${dict.ideaCard.launchPromptKit}: ${(idea.buildPackage?.launchPromptKit ?? []).join(" | ")}`,
        ].join("\n"),
      )
      .join("\n\n");
  }, [dict.ideaCard, task]);

  const oneTimeOption = task?.purchaseOptions.find((option) => option.type === "one_time_pack");
  const unlockAnchor = "#unlock-options";

  async function handleCheckout(purchaseType: PurchaseType) {
    setCheckoutLoading(purchaseType);
    setError("");

    const response = await fetch("/api/payment/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        taskId,
        purchaseType,
      }),
    });

    const data: { order?: PaymentOrder; error?: { message?: string } } = await response.json();

    if (!response.ok || !data.order) {
      setError(data?.error?.message ?? "Failed to create checkout.");
      setCheckoutLoading(null);
      return;
    }

    if (data.order.provider === "mock") {
      router.push(data.order.checkoutUrl);
      return;
    }

    window.location.href = data.order.checkoutUrl;
  }

  if (isGenerating) {
    return (
      <main className="page-shell">
        <AppHeader locale={locale} path={`/results/${taskId}`} />
        <section className="hero loading-hero">
          <div className="loading-visual" aria-hidden="true">
            <div className="loading-spinner" />
            <span className="loading-percent">{displayProgress}%</span>
          </div>
          <h1>{dict.results.generatingTitle}</h1>
          <p className="muted">{dict.results.generatingBody}</p>
          <div aria-hidden="true" className="loading-progress">
            <span style={{ width: `${displayProgress}%` }} />
          </div>
          <div className="chip-list">
            {task?.keyword ? (
              <span className="chip">
                {dict.common.keyword}: {task.keyword}
              </span>
            ) : null}
            <span className="chip">
              {task?.status === "processing" ? dict.results.processingStatus : dict.common.loading}
            </span>
          </div>
        </section>
      </main>
    );
  }

  if (error || !task) {
    return (
      <main className="page-shell">
        <AppHeader locale={locale} path={`/results/${taskId}`} />
        <section className="hero">
          <h1>{dict.results.errorTitle}</h1>
          <p>{error || "Task not found."}</p>
          <div className="cta-row">
            <button className="secondary-button" onClick={() => window.location.reload()} type="button">
              {dict.common.retry}
            </button>
            <Link className="primary-button" href={`/${locale}`}>
              {dict.common.backHome}
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="page-shell">
      <AppHeader locale={locale} path={`/results/${taskId}`} />

      <section className="results-header">
        <div>
          <span className="chip">
            {dict.common.keyword}: {task.keyword}
          </span>
          <h1>{dict.results.title}</h1>
          <div className="result-meta">
            <span className="chip">
              {dict.common.market}: {task.market}
            </span>
            <span className="chip">
              {task.totalIdeaCount} {dict.results.totalIdeas}
            </span>
            <span className="chip">
              {task.freeIdeaCount} {dict.results.freeIdeas}
            </span>
            {task.subscription?.isActive ? (
              <span className="chip">
                {dict.common.monthlyQuota}: {task.subscription.remainingGenerations}/{task.subscription.monthlyGenerationLimit}
              </span>
            ) : null}
            {task.status !== "completed" ? (
              <span className="chip">{task.status === "failed" ? dict.results.failedStatus : dict.results.processingStatus}</span>
            ) : null}
          </div>
        </div>

        <div className="cta-row">
          <Link className="ghost-button" href={`/${locale}`}>
            {dict.common.newSearch}
          </Link>
          {task.isUnlocked ? (
            <CopyButton copiedLabel={dict.common.copied} label={dict.common.copyAll} text={exportText} />
          ) : null}
          {task.isUnlocked ? (
            <a className="secondary-button" href={`/api/ideas/${task.taskId}?format=md`}>
              {dict.common.exportMarkdown}
            </a>
          ) : null}
        </div>
      </section>

      {task.status === "failed" ? (
        <section className="error-banner">
          <strong>{dict.results.failedStatus}.</strong> {task.errorMessage ?? dict.results.refreshHint}
        </section>
      ) : null}

      {task.isUnlocked ? (
        <section className="success-banner">
          <strong>{task.entitlementType === "subscription" ? dict.results.activeSubscription : dict.results.unlockedTitle}.</strong>{" "}
          {task.entitlementType === "subscription" ? dict.results.activeSubscriptionBody : dict.results.unlockedBody}
        </section>
      ) : null}

      {task.subscription?.isActive ? (
        <section className="subscription-banner">
          <strong>{dict.common.monthlyPlan}.</strong>{" "}
          {`${task.subscription.remainingDownloads}/${task.subscription.monthlyDownloadLimit} ${dict.common.monthlyQuota}`}
        </section>
      ) : null}

      <section className="idea-grid">
        {task.ideas.map((idea) => (
          <IdeaCard
            idea={idea}
            key={idea.id}
            locale={locale}
            unlockHref={idea.isLocked && !task.isUnlocked ? unlockAnchor : undefined}
          />
        ))}
      </section>

      {!task.isUnlocked && task.status !== "failed" ? (
        <>
          <section className="soft-banner">
            <strong>{dict.results.previewCompleteTitle}.</strong> {dict.results.previewCompleteBody}
            <div className="cta-row inline-cta-row">
              <a className="ghost-button" href={unlockAnchor}>
                {dict.results.viewUnlockOptions}
              </a>
            </div>
          </section>

          <section className="paywall-banner" id="unlock-options">
            <h2>{dict.results.paywallTitle}</h2>
            <p>{dict.results.paywallBody.replace("{count}", String(task.lockedIdeaCount))}</p>
            <div className="paywall-option-grid">
              <article className="paywall-option-card">
                <span className="chip">{dict.common.oneTime}</span>
                <h3>{dict.results.oneTimeTitle}</h3>
                <p className="paywall-option-price">${oneTimeOption?.amount ?? 9}</p>
                <p className="muted">{dict.results.oneTimeBody}</p>
                <ul className="feature-list compact-feature-list">
                  {dict.results.oneTimeFeatures.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <button
                  className="secondary-button"
                  disabled={checkoutLoading !== null}
                  onClick={() => void handleCheckout("one_time_pack")}
                  type="button"
                >
                  {checkoutLoading === "one_time_pack"
                    ? dict.results.preparing
                    : `${dict.results.unlockPackLabel} - $${oneTimeOption?.amount ?? 9}`}
                </button>
              </article>

              <article className="paywall-option-card paywall-option-card--featured">
                <div className="paywall-option-card__header">
                  <span className="chip">{dict.common.subscription}</span>
                  <span className="pricing-recommended">{dict.results.subscriptionRecommended}</span>
                </div>
                <h3>{dict.results.subscriptionTitle}</h3>
                <p className="paywall-option-price">
                  {dict.results.subscriptionPrice.replace("{price}", String(recommendedSubscriptionPlan.amount))}
                </p>
                <p className="muted">{dict.results.subscriptionBody}</p>
                <ul className="feature-list compact-feature-list">
                  {dict.results.subscriptionFeatures.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <div className="cta-row">
                  <Link className="primary-button" href={`/${locale}/pay?taskId=${taskId}&mode=subscription`}>
                    {dict.results.subscribeLabel}
                  </Link>
                  <button className="ghost-button" onClick={() => void loadTask()} type="button">
                    {dict.common.retry}
                  </button>
                </div>
                <p className="paywall-banner__hint">{dict.results.subscriptionHint}</p>
              </article>
            </div>
          </section>
        </>
      ) : null}
    </main>
  );
}
