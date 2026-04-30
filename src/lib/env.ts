import path from "node:path";

import { DEFAULT_LOCALE } from "@/src/lib/locale";

const defaultDatabasePath = process.env.VERCEL
  ? path.join("/tmp", "idea-finder-app.db")
  : path.join(process.cwd(), "data", "app.db");

function resolveDatabasePath() {
  const configuredPath = process.env.DATABASE_PATH;

  if (!configuredPath) {
    return defaultDatabasePath;
  }

  if (process.env.VERCEL && !path.isAbsolute(configuredPath)) {
    return path.join("/tmp", path.basename(configuredPath));
  }

  return configuredPath;
}

export const appEnv = {
  appName: "App Idea Finder",
  defaultLocale: DEFAULT_LOCALE,
  defaultMarket: process.env.DEFAULT_MARKET ?? "Japan",
  databasePath: resolveDatabasePath(),
  hotKeywordSource: process.env.HOT_KEYWORD_SOURCE ?? "static",
  hotKeywordsJson: process.env.HOT_KEYWORDS_JSON ?? "",
  aiProvider:
    process.env.AI_PROVIDER ??
    (process.env.DEEPSEEK_API_KEY ? "deepseek" : process.env.OPENAI_API_KEY ? "openai" : "mock"),
  deepSeekApiKey: process.env.DEEPSEEK_API_KEY ?? "",
  deepSeekBaseUrl: process.env.DEEPSEEK_BASE_URL ?? "https://api.deepseek.com/v1",
  deepSeekModel: process.env.DEEPSEEK_MODEL ?? "deepseek-chat",
  openAiApiKey: process.env.OPENAI_API_KEY ?? "",
  openAiModel: process.env.OPENAI_MODEL ?? "gpt-4.1-mini",
  stripeSecretKey: process.env.STRIPE_SECRET_KEY ?? "",
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET ?? "",
  stripePriceId: process.env.STRIPE_PRICE_ID ?? "",
  stripeSubscriptionPriceId: process.env.STRIPE_SUBSCRIPTION_PRICE_ID ?? "",
  appBaseUrl: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  appStoreSignalEnabled: process.env.APP_STORE_SIGNAL_ENABLED !== "false",
};

export function isDeepSeekEnabled() {
  return Boolean(appEnv.deepSeekApiKey);
}

export function isOpenAiEnabled() {
  return Boolean(appEnv.openAiApiKey);
}

export function isAiEnabled() {
  return isDeepSeekEnabled() || isOpenAiEnabled();
}

export function isStripeEnabled() {
  return Boolean(appEnv.stripeSecretKey && appEnv.appBaseUrl);
}

export function isStripeSubscriptionEnabled() {
  return Boolean(appEnv.stripeSecretKey && appEnv.appBaseUrl);
}
