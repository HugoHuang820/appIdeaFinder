import type { SubscriptionPlanId } from "@/src/lib/subscription-plans";

export type TaskStatus = "pending" | "processing" | "completed" | "failed";
export type PaymentStatus = "created" | "pending" | "paid" | "failed" | "expired";
export type Locale =
  | "ja"
  | "en"
  | "zh-CN"
  | "zh-TW"
  | "ko"
  | "es"
  | "pt-BR"
  | "fr"
  | "de"
  | "it"
  | "nl"
  | "sv"
  | "pl"
  | "tr"
  | "id"
  | "vi"
  | "th"
  | "hi"
  | "ar"
  | "ru";
export type PurchaseType = "one_time_pack" | "subscription";
export type EntitlementType = "none" | "one_time_pack" | "subscription";

export type SignalSummary = {
  summary: string;
  source: "app_store_lightweight" | "ai_inferred";
  confidence: "low" | "medium";
};

export type OpportunityScores = {
  demand: number;
  competition: number;
  monetization: number;
  buildEase: number;
  indieFit: number;
  overall: number;
  rationale: string;
};

export type BuildPackage = {
  productSummary: string;
  mvpFeatures: string[];
  v1Roadmap: string[];
  devPromptKit: string[];
  launchPromptKit: string[];
};

export type Idea = {
  id: string;
  name: string;
  oneLine: string;
  targetUsers: string[];
  why: string | null;
  signalSummary: SignalSummary | null;
  opportunityScores: OpportunityScores | null;
  aso: {
    title: string | null;
    subtitle: string | null;
    description: string | null;
    keywords: string[];
    heroHook?: string | null;
    valueBullets?: string[];
    paywallCopy?: string | null;
  };
  buildPackage: BuildPackage | null;
  isLocked: boolean;
};

export type PurchaseOption = {
  type: PurchaseType;
  amount: number;
  currency: string;
  label: string;
};

export type SubscriptionStatus = {
  isActive: boolean;
  plan: string | null;
  subscriptionPlanId?: SubscriptionPlanId | null;
  monthlyGenerationLimit: number;
  monthlyDownloadLimit: number;
  remainingGenerations: number;
  remainingDownloads: number;
  renewsAt: string | null;
};

export type DailyUsageStatus = {
  limit: number;
  used: number;
  remaining: number;
  resetAt: string;
  showUpgradeCta: boolean;
};

export type IdeaTask = {
  taskId: string;
  keyword: string;
  market: string;
  locale: Locale;
  status: TaskStatus;
  isUnlocked: boolean;
  entitlementType: EntitlementType;
  freeIdeaCount: number;
  totalIdeaCount: number;
  lockedIdeaCount: number;
  purchaseOptions: PurchaseOption[];
  subscription: SubscriptionStatus | null;
  ideas: Idea[];
  errorMessage?: string;
  createdAt: string;
  updatedAt: string;
};

export type PaymentOrder = {
  id: string;
  taskId: string | null;
  customerId?: string | null;
  locale: Locale;
  status: PaymentStatus;
  purchaseType: PurchaseType;
  subscriptionPlanId?: SubscriptionPlanId | null;
  subscriptionDurationMonths?: number | null;
  subscriptionAutoRenew?: boolean;
  amount: number;
  currency: string;
  checkoutUrl: string;
  provider: string;
  providerSessionId: string | null;
  createdAt: string;
  paidAt: string | null;
};

export type PromptBundle = {
  systemPrompt: string;
  userPrompt: string;
};

export type IdeaGenerationResult = {
  keyword: string;
  market: string;
  locale: Locale;
  ideas: Idea[];
  prompt: PromptBundle;
};
