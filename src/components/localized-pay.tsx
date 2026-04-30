"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";

import { AppHeader } from "@/src/components/app-header";
import { getDictionary } from "@/src/lib/dictionaries";
import {
  DEFAULT_SUBSCRIPTION_PLAN_ID,
  SUBSCRIPTION_PLANS,
  getSubscriptionPlan,
} from "@/src/lib/subscription-plans";
import type { Locale } from "@/src/lib/types";

type OrderResponse = {
  id: string;
  taskId: string | null;
  status: string;
  purchaseType: "one_time_pack" | "subscription";
  subscriptionPlanId?: "monthly" | "quarterly" | "semiannual" | "auto_monthly" | null;
  subscriptionDurationMonths?: number | null;
  subscriptionAutoRenew?: boolean;
  amount: number;
  currency: string;
};

type LocalizedPayProps = {
  locale: Locale;
};

function LocalizedPayContent({ locale }: LocalizedPayProps) {
  const dict = getDictionary(locale);
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("orderId");
  const taskId = searchParams.get("taskId");
  const mode = searchParams.get("mode");
  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [loading, setLoading] = useState(Boolean(orderId));
  const [error, setError] = useState("");
  const [paying, setPaying] = useState(false);
  const [startingCheckout, setStartingCheckout] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState(DEFAULT_SUBSCRIPTION_PLAN_ID);
  const selectedPlan = useMemo(() => getSubscriptionPlan(selectedPlanId), [selectedPlanId]);
  const isSubscriptionSelection = !orderId && mode === "subscription";
  const monthlyBasePlan = useMemo(() => getSubscriptionPlan("monthly"), []);

  useEffect(() => {
    if (!orderId) {
      return;
    }

    let active = true;

    async function loadOrder() {
      const response = await fetch(`/api/payment/order/${orderId}`, { cache: "no-store" });
      const data = await response.json();

      if (!active) {
        return;
      }

      if (!response.ok) {
        setError(data?.error?.message ?? dict.pay.missingOrder);
        setLoading(false);
        return;
      }

      setOrder(data);
      setLoading(false);
    }

    void loadOrder();

    return () => {
      active = false;
    };
  }, [dict.pay.missingOrder, orderId]);

  async function handleStartSubscriptionCheckout() {
    try {
      setStartingCheckout(true);
      setError("");

      const response = await fetch("/api/payment/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          taskId,
          locale,
          purchaseType: "subscription",
          subscriptionPlanId: selectedPlan.id,
        }),
      });

      const data = (await response.json().catch(() => null)) as
        | { order?: { checkoutUrl?: string; provider?: string } }
        | { error?: { message?: string } }
        | null;
      const errorMessage = data && "error" in data ? data.error?.message : "";

      if (!response.ok || !data || !("order" in data) || !data.order?.checkoutUrl) {
        setError(errorMessage || "Failed to start checkout.");
        return;
      }

      if (data.order.provider === "mock") {
        router.push(data.order.checkoutUrl);
        return;
      }

      window.location.href = data.order.checkoutUrl;
    } finally {
      setStartingCheckout(false);
    }
  }

  if (isSubscriptionSelection) {
    return (
      <main className="page-shell">
        <AppHeader locale={locale} path="/pay" />
        <section className="pay-card pay-card--plans">
          <span className="chip">{dict.pay.planSelectorBadge}</span>
          <h1>{dict.pay.planSelectorTitle}</h1>
          <p className="muted">{dict.pay.planSelectorSubtitle}</p>
          {error ? <p>{error}</p> : null}

          <div className="plan-comparison-grid">
            {SUBSCRIPTION_PLANS.map((plan) => {
              const isActive = plan.id === selectedPlanId;
              const monthlyAverage = Math.floor((plan.amount / plan.months) * 10) / 10;
              const baselineAmount = plan.autoRenew ? monthlyBasePlan.amount * plan.months : monthlyBasePlan.amount * plan.months;
              const savingsPercent =
                baselineAmount > plan.amount ? Math.round(((baselineAmount - plan.amount) / baselineAmount) * 100) : 0;

              return (
                <button
                  key={plan.id}
                  className={`pricing-card plan-choice ${isActive ? "plan-choice--active" : ""} ${
                    plan.autoRenew ? "pricing-card--featured" : ""
                  }`}
                  onClick={() => setSelectedPlanId(plan.id)}
                  type="button"
                >
                  <div className="plan-choice__topline">
                    <span className="idea-card__badge">
                      {plan.autoRenew ? dict.pay.autoRenewBadge : dict.pay.prepaidBadge}
                    </span>
                    <div className="plan-choice__badges">
                      {savingsPercent > 0 ? (
                        <span className="plan-choice__savings">
                          {dict.pay.planSavingsLabel.replace("{percent}", String(savingsPercent))}
                        </span>
                      ) : null}
                      {plan.autoRenew ? <span className="plan-choice__best-value">{dict.pay.planBestValueLabel}</span> : null}
                    </div>
                  </div>
                  <h2>
                    {dict.pay.planNames[plan.id]
                      .replace("{months}", String(plan.months))
                      .replace("{price}", String(plan.amount))}
                  </h2>
                  <div className="price-tag">
                    {dict.pay.planPrices[plan.id]
                      .replace("{price}", String(plan.amount))
                      .replace("{monthly}", String(monthlyAverage))}
                  </div>
                  <p className={`muted plan-choice__baseline ${savingsPercent > 0 ? '' : 'invisible-placeholder'}`}>
                    {savingsPercent > 0
                      ? dict.pay.planBaselineHint.replace("{amount}", String(baselineAmount))
                      : "\u00A0"} {/* 不换行空格，保持高度 */}
                  </p>
                  <p className="plan-choice__monthly">{dict.pay.planMonthlyHint.replace("{monthly}", String(monthlyAverage))}</p>
                  <p className="muted">{dict.pay.planDescriptions[plan.id]}</p>
                </button>
              );
            })}
          </div>

          <div className="soft-banner">
            <strong>{dict.pay.selectedPlanLabel}:</strong>{" "}
            {dict.pay.planNames[selectedPlan.id]
              .replace("{months}", String(selectedPlan.months))
              .replace("{price}", String(selectedPlan.amount))}
          </div>

          <div className="cta-row">
            <button
              className="primary-button"
              disabled={startingCheckout}
              onClick={() => void handleStartSubscriptionCheckout()}
              type="button"
            >
              {startingCheckout ? dict.pay.processing : dict.pay.continueCheckout}
            </button>
            <Link className="ghost-button" href={taskId ? `/${locale}/results/${taskId}` : `/${locale}/prices`}>
              {taskId ? dict.pay.backResults : dict.common.prices}
            </Link>
          </div>
        </section>
      </main>
    );
  }

  if (!orderId) {
    return (
      <main className="page-shell">
        <AppHeader locale={locale} path="/pay" />
        <section className="pay-card">
          <h1>{dict.pay.unavailableTitle}</h1>
          <p>{dict.pay.missingOrder}</p>
          <Link className="primary-button" href={`/${locale}`}>
            {dict.common.backHome}
          </Link>
        </section>
      </main>
    );
  }

  async function handlePay() {
    if (!orderId || !order) {
      return;
    }

    setPaying(true);

    await fetch("/api/payment/webhook", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "checkout.session.completed",
        data: {
          object: {
            id: `session_${orderId}`,
            metadata: {
              orderId,
              taskId: order.taskId ?? "",
              locale,
            },
            payment_status: "paid",
          },
        },
      }),
    });

    router.push(order.taskId ? `/${locale}/results/${order.taskId}?payment=success` : `/${locale}/prices?payment=success`);
    router.refresh();
  }

  if (loading) {
    return (
      <main className="page-shell">
        <AppHeader locale={locale} path="/pay" />
        <section className="pay-card">
          <h1>{dict.common.loading}</h1>
        </section>
      </main>
    );
  }

  if (error || !order) {
    return (
      <main className="page-shell">
        <AppHeader locale={locale} path="/pay" />
        <section className="pay-card">
          <h1>{dict.pay.unavailableTitle}</h1>
          <p>{error || dict.pay.missingOrder}</p>
          <Link className="primary-button" href={`/${locale}`}>
            {dict.common.backHome}
          </Link>
        </section>
      </main>
    );
  }

  const orderPlan = order.purchaseType === "subscription" ? getSubscriptionPlan(order.subscriptionPlanId) : null;

  return (
    <main className="page-shell">
      <AppHeader locale={locale} path="/pay" />

      <section className="pay-card">
        <span className="chip">{dict.pay.badge}</span>
        <h1>{dict.pay.title}</h1>
        <p className="muted">{dict.pay.subtitle}</p>

        <div className="price-meta">
          <span className="chip">
            {dict.pay.purchaseType}: {order.purchaseType === "subscription" ? dict.common.subscription : dict.common.oneTime}
          </span>
          {orderPlan ? (
            <span className="chip">
              {dict.pay.selectedPlanLabel}:{" "}
              {dict.pay.planShortNames[orderPlan.id].replace("{months}", String(orderPlan.months))}
            </span>
          ) : null}
        </div>

        <div className="price-tag">
          ${order.amount} {order.currency}
        </div>

        {orderPlan ? (
          <p className="muted">
            {orderPlan.autoRenew
              ? dict.pay.orderAutoRenewHint.replace("{price}", String(order.amount))
              : dict.pay.orderFixedTermHint.replace("{months}", String(orderPlan.months))}
          </p>
        ) : null}

        <div className="cta-row">
          <button className="primary-button" disabled={paying} onClick={handlePay} type="button">
            {paying ? dict.pay.processing : dict.pay.payNow}
          </button>
          <Link className="ghost-button" href={order.taskId ? `/${locale}/results/${order.taskId}` : `/${locale}/prices`}>
            {order.taskId ? dict.pay.backResults : dict.common.prices}
          </Link>
        </div>
      </section>
    </main>
  );
}

export function LocalizedPay(props: LocalizedPayProps) {
  return (
    <Suspense
      fallback={
        <main className="page-shell">
          <section className="pay-card">
            <h1>Loading...</h1>
          </section>
        </main>
      }
    >
      <LocalizedPayContent {...props} />
    </Suspense>
  );
}
