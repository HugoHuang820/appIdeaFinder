import Stripe from "stripe";

import { appEnv, isStripeEnabled, isStripeSubscriptionEnabled } from "@/src/lib/env";
import { getSubscriptionPlan } from "@/src/lib/subscription-plans";
import type { Locale, PurchaseType } from "@/src/lib/types";

const stripe = isStripeEnabled()
  ? new Stripe(appEnv.stripeSecretKey, {
      apiVersion: "2026-04-22.dahlia",
    })
  : null;

type CheckoutInput = {
  taskId: string | null;
  orderId: string;
  locale: Locale;
  purchaseType: PurchaseType;
  subscriptionPlanId?: string | null;
  amount: number;
  currency: string;
  origin?: string;
};

export async function createCheckoutSession(input: CheckoutInput) {
  const selectedPlan = input.purchaseType === "subscription" ? getSubscriptionPlan(input.subscriptionPlanId) : null;
  const wantsSubscription = Boolean(selectedPlan?.autoRenew);

  if (!stripe || (!wantsSubscription && !isStripeEnabled()) || (wantsSubscription && !isStripeSubscriptionEnabled())) {
    return {
      provider: "mock",
      checkoutUrl: `/${input.locale}/pay?orderId=${input.orderId}`,
      providerSessionId: null,
    };
  }

  const baseUrl = input.origin ?? appEnv.appBaseUrl;
  const successPath = input.taskId
    ? `/${input.locale}/results/${input.taskId}?payment=success`
    : `/${input.locale}/prices?payment=success`;
  const cancelPath = input.taskId
    ? `/${input.locale}/results/${input.taskId}?payment=cancelled`
    : `/${input.locale}/prices?payment=cancelled`;
  const lineItem =
    input.purchaseType === "subscription" && selectedPlan
      ? {
          price_data: {
            currency: input.currency.toLowerCase(),
            product_data: {
              name: selectedPlan.autoRenew
                ? "App Idea Finder Continuous Monthly Plan"
                : `App Idea Finder ${selectedPlan.months}-Month Plan`,
            },
            unit_amount: input.amount * 100,
            ...(selectedPlan.autoRenew
              ? {
                  recurring: {
                    interval: "month" as const,
                  },
                }
              : {}),
          },
          quantity: 1,
        }
      : {
          price_data: {
            currency: input.currency.toLowerCase(),
            product_data: {
              name: "App Idea Finder One-Time Pack",
            },
            unit_amount: input.amount * 100,
          },
          quantity: 1,
        };
  const session = await stripe.checkout.sessions.create({
    mode: wantsSubscription ? "subscription" : "payment",
    line_items: [lineItem],
    success_url: `${baseUrl}${successPath}`,
    cancel_url: `${baseUrl}${cancelPath}`,
    metadata: {
      orderId: input.orderId,
      taskId: input.taskId ?? "",
      locale: input.locale,
      subscriptionPlanId: selectedPlan?.id ?? "",
    },
  });

  return {
    provider: "stripe",
    checkoutUrl: session.url ?? `${baseUrl}${successPath}`,
    providerSessionId: session.id,
  };
}

export function verifyStripeWebhook(signature: string | null, body: string) {
  if (!stripe || !appEnv.stripeWebhookSecret) {
    return null;
  }

  if (!signature) {
    throw new Error("Missing Stripe signature.");
  }

  return stripe.webhooks.constructEvent(body, signature, appEnv.stripeWebhookSecret);
}
