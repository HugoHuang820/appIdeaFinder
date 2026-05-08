import { randomUUID } from "node:crypto";

import { generateIdeas } from "@/src/lib/ai-provider";
import { getDb } from "@/src/lib/db";
import { appEnv } from "@/src/lib/env";
import { createCheckoutSession } from "@/src/lib/payment-provider";
import {
  DEFAULT_SUBSCRIPTION_PLAN_ID,
  getSubscriptionPlan,
  getSubscriptionPlanByCode,
  isSubscriptionPlanId,
} from "@/src/lib/subscription-plans";
import type {
  DailyUsageStatus,
  Idea,
  IdeaTask,
  Locale,
  PaymentOrder,
  PurchaseOption,
  PurchaseType,
  SubscriptionStatus,
} from "@/src/lib/types";

const ONE_TIME_PRICE = {
  amount: 9,
  currency: "USD",
};

const DAILY_FREE_GENERATION_LIMIT = 3;

const processingTasks = new Set<string>();

type SubscriptionRow = {
  id: string;
  customer_id: string;
  plan: string;
  status: string;
  monthly_generation_limit: number;
  monthly_download_limit: number;
  remaining_generations: number;
  remaining_downloads: number;
  renews_at: string;
  created_at: string;
  updated_at: string;
};

function nowIso() {
  return new Date().toISOString();
}

function plusDaysIso(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString();
}

function getTokyoUsageDate(date = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function getNextTokyoResetIso() {
  const now = new Date();
  const nowInTokyo = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Tokyo" }));
  nowInTokyo.setHours(24, 0, 0, 0);

  const diff = nowInTokyo.getTime() - new Date(now.toLocaleString("en-US", { timeZone: "Asia/Tokyo" })).getTime();
  return new Date(now.getTime() + diff).toISOString();
}

function nextIdeaCountForUser(customerId: string | null | undefined, fallback = 6) {
  const subscription = refreshSubscriptionIfNeeded(customerId);

  if (!subscription || subscription.status !== "active") {
    return fallback;
  }

  return 8;
}

function hasActiveSubscription(customerId: string | null | undefined) {
  const subscription = refreshSubscriptionIfNeeded(customerId);
  return Boolean(subscription && subscription.status === "active");
}

function id(prefix: string) {
  return `${prefix}_${randomUUID().replace(/-/g, "").slice(0, 12)}`;
}

function db() {
  return getDb();
}

function getPurchaseOptions(): PurchaseOption[] {
  const defaultSubscriptionPlan = getSubscriptionPlan(DEFAULT_SUBSCRIPTION_PLAN_ID);
  return [
    {
      type: "one_time_pack",
      amount: ONE_TIME_PRICE.amount,
      currency: ONE_TIME_PRICE.currency,
      label: "Unlock this idea pack",
    },
    {
      type: "subscription",
      amount: defaultSubscriptionPlan.amount,
      currency: defaultSubscriptionPlan.currency,
      label: "Monthly builder plan",
    },
  ];
}

function rowIdeaCount(taskId: string) {
  const row = db()
    .prepare(`SELECT requested_idea_count FROM idea_tasks WHERE task_id = ?`)
    .get(taskId) as { requested_idea_count: number } | undefined;

  return row?.requested_idea_count ?? 6;
}

function getDailyGenerationRow(customerId: string) {
  const usageDate = getTokyoUsageDate();
  return db()
    .prepare(
      `
        SELECT id, customer_id, usage_date_tokyo, generation_count, created_at, updated_at
        FROM daily_generation_usage
        WHERE customer_id = ? AND usage_date_tokyo = ?
      `,
    )
    .get(customerId, usageDate) as
    | {
        id: string;
        customer_id: string;
        usage_date_tokyo: string;
        generation_count: number;
        created_at: string;
        updated_at: string;
      }
    | undefined;
}

export function getDailyFreeGenerationStatus(customerId: string | null | undefined) {
  if (!customerId) {
    return {
      limit: DAILY_FREE_GENERATION_LIMIT,
      used: 0,
      remaining: DAILY_FREE_GENERATION_LIMIT,
      resetAt: getNextTokyoResetIso(),
      showUpgradeCta: false,
    };
  }

  if (hasActiveSubscription(customerId)) {
    return {
      limit: DAILY_FREE_GENERATION_LIMIT,
      used: 0,
      remaining: DAILY_FREE_GENERATION_LIMIT,
      resetAt: getNextTokyoResetIso(),
      showUpgradeCta: false,
    };
  }

  const row = getDailyGenerationRow(customerId);
  const used = row?.generation_count ?? 0;

  return {
    limit: DAILY_FREE_GENERATION_LIMIT,
    used,
    remaining: Math.max(DAILY_FREE_GENERATION_LIMIT - used, 0),
    resetAt: getNextTokyoResetIso(),
    showUpgradeCta: used >= DAILY_FREE_GENERATION_LIMIT,
  };
}

export function consumeFreeGeneration(customerId: string | null | undefined) {
  if (!customerId || hasActiveSubscription(customerId)) {
    return;
  }

  const existing = getDailyGenerationRow(customerId);
  const updatedAt = nowIso();
  const usageDate = getTokyoUsageDate();

  if (!existing) {
    db()
      .prepare(
        `
          INSERT INTO daily_generation_usage (
            id, customer_id, usage_date_tokyo, generation_count, created_at, updated_at
          )
          VALUES (?, ?, ?, ?, ?, ?)
        `,
      )
      .run(id("usage"), customerId, usageDate, 1, updatedAt, updatedAt);
  } else {
    db()
      .prepare(
        `
          UPDATE daily_generation_usage
          SET generation_count = generation_count + 1, updated_at = ?
          WHERE customer_id = ? AND usage_date_tokyo = ?
        `,
      )
      .run(updatedAt, customerId, usageDate);
  }
}

export function getHomeUsageStatus(customerId: string | null | undefined): DailyUsageStatus {
  const status = getDailyFreeGenerationStatus(customerId);
  return {
    limit: status.limit,
    used: status.used,
    remaining: status.remaining,
    resetAt: status.resetAt,
    showUpgradeCta: status.showUpgradeCta,
  };
}

function getScopedIdeaId(taskId: string, ideaId: string, index: number) {
  return `${taskId}_${ideaId || `idea_${index + 1}`}`;
}

function parseJson<T>(value: string, fallback: T): T {
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function refreshSubscriptionIfNeeded(customerId: string | null | undefined) {
  if (!customerId) {
    return null;
  }

  const row = db()
    .prepare(
      `
        SELECT id, customer_id, plan, status, monthly_generation_limit, monthly_download_limit,
               remaining_generations, remaining_downloads, renews_at, created_at, updated_at
        FROM subscriptions
        WHERE customer_id = ?
      `,
    )
    .get(customerId) as SubscriptionRow | undefined;

  if (!row) {
    return null;
  }

  if (row.status !== "active") {
    return row;
  }

  if (new Date(row.renews_at).getTime() > Date.now()) {
    return row;
  }

  const planConfig = getSubscriptionPlanByCode(row.plan);
  const updatedAt = nowIso();

  if (!planConfig) {
    db()
      .prepare(
        `
          UPDATE subscriptions
          SET status = ?, updated_at = ?
          WHERE customer_id = ?
        `,
      )
      .run("expired", updatedAt, customerId);

    return {
      ...row,
      status: "expired",
      updated_at: updatedAt,
    };
  }

  if (!planConfig.autoRenew) {
    db()
      .prepare(
        `
          UPDATE subscriptions
          SET status = ?, updated_at = ?
          WHERE customer_id = ?
        `,
      )
      .run("expired", updatedAt, customerId);

    return {
      ...row,
      status: "expired",
      updated_at: updatedAt,
    };
  }

  const renewedAt = updatedAt;
  const renewsAt = plusDaysIso(30);
  db()
    .prepare(
      `
        UPDATE subscriptions
        SET remaining_generations = ?, remaining_downloads = ?, renews_at = ?, updated_at = ?
        WHERE customer_id = ?
      `,
    )
    .run(
      row.monthly_generation_limit,
      row.monthly_download_limit,
      renewsAt,
      renewedAt,
      customerId,
    );

  return {
    ...row,
    remaining_generations: row.monthly_generation_limit,
    remaining_downloads: row.monthly_download_limit,
    renews_at: renewsAt,
    updated_at: renewedAt,
  };
}

function toSubscriptionStatus(row: SubscriptionRow | null): SubscriptionStatus | null {
  if (!row || row.status !== "active") {
    return null;
  }

  return {
    isActive: true,
    plan: row.plan,
    subscriptionPlanId: getSubscriptionPlanByCode(row.plan)?.id ?? null,
    monthlyGenerationLimit: row.monthly_generation_limit,
    monthlyDownloadLimit: row.monthly_download_limit,
    remainingGenerations: row.remaining_generations,
    remainingDownloads: row.remaining_downloads,
    renewsAt: row.renews_at,
  };
}

function consumeGeneration(customerId: string | null | undefined) {
  const subscription = refreshSubscriptionIfNeeded(customerId);
  if (!subscription || subscription.status !== "active" || subscription.remaining_generations <= 0) {
    return null;
  }

  db()
    .prepare(
      `
        UPDATE subscriptions
        SET remaining_generations = remaining_generations - 1, updated_at = ?
        WHERE customer_id = ? AND remaining_generations > 0
      `,
    )
    .run(nowIso(), customerId);

  return refreshSubscriptionIfNeeded(customerId);
}

function consumeDownload(customerId: string | null | undefined) {
  const subscription = refreshSubscriptionIfNeeded(customerId);
  if (!subscription || subscription.status !== "active" || subscription.remaining_downloads <= 0) {
    return null;
  }

  db()
    .prepare(
      `
        UPDATE subscriptions
        SET remaining_downloads = remaining_downloads - 1, updated_at = ?
        WHERE customer_id = ? AND remaining_downloads > 0
      `,
    )
    .run(nowIso(), customerId);

  return refreshSubscriptionIfNeeded(customerId);
}

function activateSubscription(customerId: string, planId: string | null | undefined) {
  const selectedPlan = getSubscriptionPlan(planId);
  const existing = refreshSubscriptionIfNeeded(customerId);
  const createdAt = nowIso();
  const renewsAt = plusDaysIso(selectedPlan.months * 30);
  const generationLimit = selectedPlan.monthlyGenerationLimit * selectedPlan.months;
  const downloadLimit = selectedPlan.monthlyDownloadLimit * selectedPlan.months;

  if (!existing) {
    db()
      .prepare(
        `
          INSERT INTO subscriptions (
            id, customer_id, plan, status, monthly_generation_limit, monthly_download_limit,
            remaining_generations, remaining_downloads, renews_at, created_at, updated_at
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
      )
      .run(
        id("sub"),
        customerId,
        selectedPlan.code,
        "active",
        generationLimit,
        downloadLimit,
        generationLimit,
        downloadLimit,
        renewsAt,
        createdAt,
        createdAt,
      );
  } else {
    db()
      .prepare(
        `
          UPDATE subscriptions
          SET plan = ?, status = ?, monthly_generation_limit = ?, monthly_download_limit = ?,
              remaining_generations = ?, remaining_downloads = ?, renews_at = ?, updated_at = ?
          WHERE customer_id = ?
        `,
      )
      .run(
        selectedPlan.code,
        "active",
        generationLimit,
        downloadLimit,
        generationLimit,
        downloadLimit,
        renewsAt,
        createdAt,
        customerId,
      );
  }

  return refreshSubscriptionIfNeeded(customerId);
}

function cloneIdeaForVisibility(idea: Idea, visible: boolean, showBuildPackage: boolean): Idea {
  if (visible) {
    return {
      ...idea,
      targetUsers: [...idea.targetUsers],
      signalSummary: idea.signalSummary ? { ...idea.signalSummary } : null,
      why: idea.why,
      aso: {
        ...idea.aso,
        keywords: [...idea.aso.keywords],
      },
      buildPackage: showBuildPackage && idea.buildPackage
        ? {
            ...idea.buildPackage,
            mvpFeatures: [...idea.buildPackage.mvpFeatures],
            v1Roadmap: [...idea.buildPackage.v1Roadmap],
            devPromptKit: [...idea.buildPackage.devPromptKit],
            launchPromptKit: [...idea.buildPackage.launchPromptKit],
          }
        : null,
      isLocked: false,
    };
  }

  return {
    id: idea.id,
    name: idea.name,
    oneLine: idea.oneLine,
    targetUsers: [],
    why: null,
    signalSummary: idea.signalSummary ? { ...idea.signalSummary } : null,
    opportunityScores: idea.opportunityScores ? { ...idea.opportunityScores } : null,
    aso: {
      title: null,
      subtitle: null,
      heroHook: null,
      description: null,
      keywords: [],
      valueBullets: [],
      paywallCopy: null,
    },
    buildPackage: null,
    isLocked: true,
  };
}

function projectTask(task: IdeaTask, mode: "preview" | "full"): IdeaTask {
  const visibleIdeas = task.ideas.map((idea, index) => {
    const visible = task.isUnlocked || index < task.freeIdeaCount;
    const showBuildPackage = task.isUnlocked && mode === "full";
    return cloneIdeaForVisibility(idea, visible, showBuildPackage);
  });

  return {
    ...task,
    ideas: visibleIdeas,
    totalIdeaCount: task.ideas.length,
    lockedIdeaCount: task.isUnlocked ? 0 : Math.max(task.ideas.length - task.freeIdeaCount, 0),
    updatedAt: task.updatedAt,
  };
}

function parseIdeas(taskId: string): Idea[] {
  const rows = db()
    .prepare(
      `
        SELECT id, name, one_line, target_users_json, why_text, signal_summary_json, aso_title, aso_subtitle,
               aso_hero_hook, aso_description, aso_keywords_json, aso_value_bullets_json, aso_paywall_copy,
               opportunity_scores_json, build_package_json, position
        FROM ideas
        WHERE task_id = ?
        ORDER BY position ASC
      `,
    )
    .all(taskId) as Array<{
    id: string;
    name: string;
    one_line: string;
    target_users_json: string;
    why_text: string;
    signal_summary_json: string;
    aso_title: string;
    aso_subtitle: string;
    aso_hero_hook: string;
    aso_description: string;
    aso_keywords_json: string;
    aso_value_bullets_json: string;
    aso_paywall_copy: string;
    opportunity_scores_json: string;
    build_package_json: string;
    position: number;
  }>;

  return rows.map((row, index) => ({
    id: row.id,
    name: row.name,
    oneLine: row.one_line,
    targetUsers: parseJson(row.target_users_json, [] as string[]),
    why: row.why_text,
    signalSummary: parseJson(row.signal_summary_json, null),
    opportunityScores: parseJson(row.opportunity_scores_json, null),
    aso: {
      title: row.aso_title,
      subtitle: row.aso_subtitle,
      heroHook: row.aso_hero_hook,
      description: row.aso_description,
      keywords: parseJson(row.aso_keywords_json, [] as string[]),
      valueBullets: parseJson(row.aso_value_bullets_json, [] as string[]),
      paywallCopy: row.aso_paywall_copy,
    },
    buildPackage: parseJson(row.build_package_json, null),
    isLocked: index >= 2,
  }));
}

function parseTask(taskId: string): IdeaTask | null {
  const row = db()
    .prepare(
      `
        SELECT task_id, keyword, market, locale, customer_id, status, is_unlocked, entitlement_type, free_idea_count,
               total_idea_count, requested_idea_count, error_message, created_at, updated_at
        FROM idea_tasks
        WHERE task_id = ?
      `,
    )
    .get(taskId) as
    | {
        task_id: string;
        keyword: string;
        market: string;
        locale: Locale;
        customer_id: string | null;
        status: IdeaTask["status"];
        is_unlocked: number;
        entitlement_type: IdeaTask["entitlementType"];
        free_idea_count: number;
        total_idea_count: number;
        requested_idea_count: number;
        error_message: string | null;
        created_at: string;
        updated_at: string;
      }
    | undefined;

  if (!row) {
    return null;
  }

  const ideas = parseIdeas(taskId);
  const subscription = toSubscriptionStatus(refreshSubscriptionIfNeeded(row.customer_id));

  return {
    taskId: row.task_id,
    keyword: row.keyword,
    market: row.market,
    locale: row.locale,
    status: row.status,
    isUnlocked: Boolean(row.is_unlocked),
    entitlementType: row.entitlement_type,
    freeIdeaCount: row.free_idea_count,
    totalIdeaCount: row.total_idea_count,
    lockedIdeaCount: Boolean(row.is_unlocked) ? 0 : Math.max(ideas.length - row.free_idea_count, 0),
    purchaseOptions: getPurchaseOptions(),
    subscription,
    ideas,
    errorMessage: row.error_message ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function processIdeaTask(taskId: string) {
  if (processingTasks.has(taskId)) {
    return;
  }

  processingTasks.add(taskId);

  try {
    const task = parseTask(taskId);
    if (!task) {
      return;
    }

    db()
      .prepare(`UPDATE idea_tasks SET status = ?, updated_at = ?, error_message = NULL WHERE task_id = ?`)
      .run("processing", nowIso(), taskId);

    const result = await generateIdeas({
      keyword: task.keyword,
      market: task.market,
      locale: task.locale,
      ideaCount: rowIdeaCount(taskId),
    });

    const insertIdea = db().prepare(
      `
        INSERT INTO ideas (
          id, task_id, position, name, one_line, target_users_json, why_text, signal_summary_json,
          aso_title, aso_subtitle, aso_hero_hook, aso_description, aso_keywords_json, aso_value_bullets_json,
          aso_paywall_copy, opportunity_scores_json, build_package_json
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
    );

    const transaction = db().transaction(() => {
      db().prepare(`DELETE FROM ideas WHERE task_id = ?`).run(taskId);

      result.ideas.forEach((idea, index) => {
        const scopedIdeaId = getScopedIdeaId(taskId, idea.id, index);
        insertIdea.run(
          scopedIdeaId,
          taskId,
          index,
          idea.name,
          idea.oneLine,
          JSON.stringify(idea.targetUsers),
          idea.why ?? "",
          JSON.stringify(idea.signalSummary),
          idea.aso.title ?? "",
          idea.aso.subtitle ?? "",
          idea.aso.heroHook ?? "",
          idea.aso.description ?? "",
          JSON.stringify(idea.aso.keywords),
          JSON.stringify(idea.aso.valueBullets ?? []),
          idea.aso.paywallCopy ?? "",
          JSON.stringify(idea.opportunityScores ?? null),
          JSON.stringify(idea.buildPackage),
        );
      });

      db()
        .prepare(
          `
            UPDATE idea_tasks
            SET keyword = ?, market = ?, status = ?, total_idea_count = ?, error_message = NULL, updated_at = ?
            WHERE task_id = ?
          `,
        )
        .run(result.keyword, result.market, "completed", result.ideas.length, nowIso(), taskId);
    });

    transaction();
  } catch (error) {
    const message = error instanceof Error ? error.message : "Idea generation failed.";
    db()
      .prepare(`UPDATE idea_tasks SET status = ?, error_message = ?, updated_at = ? WHERE task_id = ?`)
      .run("failed", message, nowIso(), taskId);
  } finally {
    processingTasks.delete(taskId);
  }
}

function scheduleTaskProcessing(taskId: string) {
  setTimeout(() => {
    void processIdeaTask(taskId);
  }, 0);
}

export async function createIdeaTask(
  keyword: string,
  market = appEnv.defaultMarket,
  locale: Locale = "ja",
  customerId?: string,
  ideaCount = 6,
  processImmediately = false,
  scheduleProcessing = true,
) {
  const taskId = id("task");
  const createdAt = nowIso();
  const activeSubscription = customerId ? consumeGeneration(customerId) : null;
  const isUnlocked = Boolean(activeSubscription);
  const entitlementType = activeSubscription ? "subscription" : "none";
  const requestedIdeaCount = activeSubscription ? 8 : ideaCount;

  db()
    .prepare(
      `
        INSERT INTO idea_tasks (
          task_id, keyword, market, locale, customer_id, status, is_unlocked, entitlement_type, free_idea_count,
          total_idea_count, requested_idea_count, price_amount, price_currency, created_at, updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
    )
    .run(
      taskId,
      keyword.trim(),
      market,
      locale,
      customerId ?? null,
      "pending",
      isUnlocked ? 1 : 0,
      entitlementType,
      2,
      0,
      requestedIdeaCount,
      ONE_TIME_PRICE.amount,
      ONE_TIME_PRICE.currency,
      createdAt,
      createdAt,
    );

  if (processImmediately) {
    await processIdeaTask(taskId);
  } else if (scheduleProcessing) {
    scheduleTaskProcessing(taskId);
  }

  const task = parseTask(taskId);
  if (!task) {
    throw new Error("Failed to create task.");
  }

  return task;
}

export function getTask(taskId: string) {
  return parseTask(taskId);
}

export function getTaskPreview(taskId: string) {
  const task = parseTask(taskId);
  return task ? projectTask(task, "preview") : null;
}

export function getTaskFull(taskId: string) {
  const task = parseTask(taskId);
  return task ? projectTask(task, "full") : null;
}

function parseOrder(orderId: string): PaymentOrder | null {
  const row = db()
    .prepare(
      `
        SELECT id, task_id, customer_id, locale, status, purchase_type, subscription_plan_id,
               subscription_duration_months, subscription_auto_renew, amount, currency, checkout_url, provider,
               provider_session_id, created_at, paid_at
        FROM payment_orders
        WHERE id = ?
      `,
    )
    .get(orderId) as
    | {
        id: string;
        task_id: string | null;
        customer_id: string | null;
        locale: Locale;
        status: PaymentOrder["status"];
        purchase_type: PurchaseType;
        subscription_plan_id: string | null;
        subscription_duration_months: number | null;
        subscription_auto_renew: number;
        amount: number;
        currency: string;
        checkout_url: string;
        provider: string;
        provider_session_id: string | null;
        created_at: string;
        paid_at: string | null;
      }
    | undefined;

  if (!row) {
    return null;
  }

  return {
    id: row.id,
    taskId: row.task_id,
    customerId: row.customer_id,
    locale: row.locale,
    status: row.status,
    purchaseType: row.purchase_type,
    subscriptionPlanId: isSubscriptionPlanId(row.subscription_plan_id) ? row.subscription_plan_id : null,
    subscriptionDurationMonths: row.subscription_duration_months ?? null,
    subscriptionAutoRenew: Boolean(row.subscription_auto_renew),
    amount: row.amount,
    currency: row.currency,
    checkoutUrl: row.checkout_url,
    provider: row.provider,
    providerSessionId: row.provider_session_id,
    createdAt: row.created_at,
    paidAt: row.paid_at,
  };
}

export async function createOrder(input: {
  taskId?: string | null;
  purchaseType: PurchaseType;
  subscriptionPlanId?: string | null;
  locale: Locale;
  customerId?: string | null;
  origin?: string;
}) {
  const taskId = input.taskId ?? null;
  const task = taskId ? parseTask(taskId) : null;

  if (taskId && !task) {
    return null;
  }

  if (!taskId && input.purchaseType !== "subscription") {
    return null;
  }

  const orderId = id("order");
  const createdAt = nowIso();
  const selectedPlan = input.purchaseType === "subscription" ? getSubscriptionPlan(input.subscriptionPlanId) : null;
  const amount = selectedPlan ? selectedPlan.amount : ONE_TIME_PRICE.amount;
  const currency = selectedPlan ? selectedPlan.currency : ONE_TIME_PRICE.currency;
  const checkout = await createCheckoutSession({
    taskId,
    orderId,
    locale: task?.locale ?? input.locale,
    purchaseType: input.purchaseType,
    subscriptionPlanId: selectedPlan?.id ?? null,
    amount,
    currency,
    origin: input.origin,
  });

  db()
    .prepare(
      `
        INSERT INTO payment_orders (
          id, task_id, customer_id, locale, status, purchase_type, subscription_plan_id, subscription_duration_months,
          subscription_auto_renew, amount, currency, checkout_url, provider, provider_session_id, created_at, paid_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
    )
    .run(
      orderId,
      taskId,
      input.customerId ?? null,
      task?.locale ?? input.locale,
      "created",
      input.purchaseType,
      selectedPlan?.id ?? null,
      selectedPlan?.months ?? null,
      selectedPlan?.autoRenew ? 1 : 0,
      amount,
      currency,
      checkout.checkoutUrl,
      checkout.provider,
      checkout.providerSessionId,
      createdAt,
      null,
    );

  return parseOrder(orderId);
}

export function getOrder(orderId: string) {
  return parseOrder(orderId);
}

export function markOrderPaid(orderId: string) {
  const order = parseOrder(orderId);
  if (!order) {
    return null;
  }

  if (order.status === "paid") {
    return order;
  }

  const task = order.taskId ? parseTask(order.taskId) : null;
  if (order.taskId && !task) {
    return null;
  }

  const paidAt = nowIso();
  const transaction = db().transaction(() => {
    db()
      .prepare(`UPDATE payment_orders SET status = ?, paid_at = ? WHERE id = ?`)
      .run("paid", paidAt, orderId);

    if (order.purchaseType === "subscription") {
      const taskRow = task
        ? (db().prepare(`SELECT customer_id FROM idea_tasks WHERE task_id = ?`).get(task.taskId) as
            | { customer_id: string | null }
            | undefined)
        : undefined;
      const customerId = order.customerId ?? taskRow?.customer_id ?? null;

      if (customerId) {
        activateSubscription(customerId, order.subscriptionPlanId);
      }

      if (order.taskId) {
        db()
          .prepare(`UPDATE idea_tasks SET is_unlocked = 1, entitlement_type = ?, updated_at = ? WHERE task_id = ?`)
          .run("subscription", paidAt, order.taskId);
      }
    } else if (order.taskId) {
      db()
        .prepare(`UPDATE idea_tasks SET is_unlocked = 1, entitlement_type = ?, updated_at = ? WHERE task_id = ?`)
        .run("one_time_pack", paidAt, order.taskId);
    }
  });

  transaction();

  return parseOrder(orderId);
}

export function markOrderPaidBySessionId(sessionId: string) {
  const row = db().prepare(`SELECT id FROM payment_orders WHERE provider_session_id = ?`).get(sessionId) as
    | { id: string }
    | undefined;

  if (!row) {
    return null;
  }

  return markOrderPaid(row.id);
}

export function getExportMarkdown(taskId: string) {
  const task = parseTask(taskId);

  if (!task || !task.isUnlocked) {
    return null;
  }

  const customerRow = db()
    .prepare(`SELECT customer_id, entitlement_type FROM idea_tasks WHERE task_id = ?`)
    .get(taskId) as { customer_id: string | null; entitlement_type: string } | undefined;

  if (customerRow?.entitlement_type === "subscription") {
    const subscription = refreshSubscriptionIfNeeded(customerRow.customer_id);
    if (!subscription || subscription.remaining_downloads <= 0) {
      return null;
    }

    consumeDownload(customerRow.customer_id);
  }

  const lines = [
    `# Idea Pack: ${task.keyword}`,
    "",
    `Market: ${task.market}`,
    `Locale: ${task.locale}`,
    "",
  ];

  task.ideas.forEach((idea, index) => {
    lines.push(`## ${index + 1}. ${idea.name}`);
    lines.push(`- One line: ${idea.oneLine}`);
    lines.push(`- Target users: ${idea.targetUsers.join(", ")}`);
    lines.push(`- Why: ${idea.why ?? ""}`);
    lines.push(`- Signal summary: ${idea.signalSummary?.summary ?? ""}`);
    lines.push(`- Messaging title: ${idea.aso.title ?? ""}`);
    lines.push(`- Messaging subtitle: ${idea.aso.subtitle ?? ""}`);
    lines.push(`- Hero hook: ${idea.aso.heroHook ?? ""}`);
    lines.push(`- Messaging description: ${idea.aso.description ?? ""}`);
    lines.push(`- Value bullets: ${(idea.aso.valueBullets ?? []).join(" | ")}`);
    lines.push(`- Upgrade copy: ${idea.aso.paywallCopy ?? ""}`);
    lines.push(`- Messaging keywords: ${idea.aso.keywords.join(", ")}`);
    lines.push(`- Product summary: ${idea.buildPackage?.productSummary ?? ""}`);
    lines.push(`- MVP features: ${(idea.buildPackage?.mvpFeatures ?? []).join(", ")}`);
    lines.push(`- V1 roadmap: ${(idea.buildPackage?.v1Roadmap ?? []).join(", ")}`);
    lines.push(`- Dev prompt kit: ${(idea.buildPackage?.devPromptKit ?? []).join(" | ")}`);
    lines.push(`- Launch prompt kit: ${(idea.buildPackage?.launchPromptKit ?? []).join(" | ")}`);
    lines.push("");
  });

  return lines.join("\n");
}
