export type SubscriptionPlanId = "monthly" | "quarterly" | "semiannual" | "auto_monthly";

export type SubscriptionPlan = {
  id: SubscriptionPlanId;
  code: string;
  months: number;
  amount: number;
  currency: "USD";
  autoRenew: boolean;
  monthlyGenerationLimit: number;
  monthlyDownloadLimit: number;
};

export const DEFAULT_SUBSCRIPTION_PLAN_ID: SubscriptionPlanId = "auto_monthly";

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: "monthly",
    code: "monthly_builder_1m",
    months: 1,
    amount: 29,
    currency: "USD",
    autoRenew: false,
    monthlyGenerationLimit: 20,
    monthlyDownloadLimit: 20,
  },
  {
    id: "quarterly",
    code: "monthly_builder_3m",
    months: 3,
    amount: 69,
    currency: "USD",
    autoRenew: false,
    monthlyGenerationLimit: 20,
    monthlyDownloadLimit: 20,
  },
  {
    id: "semiannual",
    code: "monthly_builder_6m",
    months: 6,
    amount: 119,
    currency: "USD",
    autoRenew: false,
    monthlyGenerationLimit: 20,
    monthlyDownloadLimit: 20,
  },
  {
    id: "auto_monthly",
    code: "monthly_builder_auto",
    months: 1,
    amount: 19,
    currency: "USD",
    autoRenew: true,
    monthlyGenerationLimit: 20,
    monthlyDownloadLimit: 20,
  },
];

export function isSubscriptionPlanId(planId?: string | null): planId is SubscriptionPlanId {
  return SUBSCRIPTION_PLANS.some((plan) => plan.id === planId);
}

export function getSubscriptionPlan(planId?: string | null) {
  return SUBSCRIPTION_PLANS.find((plan) => plan.id === planId) ?? SUBSCRIPTION_PLANS.find((plan) => plan.id === DEFAULT_SUBSCRIPTION_PLAN_ID)!;
}

export function getSubscriptionPlanByCode(planCode?: string | null) {
  return SUBSCRIPTION_PLANS.find((plan) => plan.code === planCode) ?? null;
}
