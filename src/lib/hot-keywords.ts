import { appEnv } from "@/src/lib/env";
import type { Locale } from "@/src/lib/types";

const STATIC_HOT_KEYWORD_POOL: Record<Locale, string[]> = {
  ja: [
    "家計簿",
    "習慣化",
    "睡眠記録",
    "筋トレ記録",
    "勉強計画",
    "語学学習",
    "メンタルケア",
    "食事管理",
    "副業管理",
    "旅行計画",
    "タスク管理",
    "日記",
    "写真整理",
    "家族共有",
    "ペットケア",
    "育児記録",
    "通勤管理",
    "ストレス記録",
    "献立管理",
    "薬管理",
    "スキンケア記録",
    "読書記録",
    "水分補給",
    "掃除管理",
    "在庫管理",
    "推し活",
    "イベント計画",
    "引っ越し準備",
    "貯金目標",
    "カロリー記録",
    "散歩記録",
    "ガーデニング",
    "フリーランス管理",
    "出費記録",
    "睡眠改善",
  ],
  en: [
    "budget planner",
    "habit tracker",
    "study planner",
    "meal prep",
    "pet care",
    "sleep tracker",
    "gym log",
    "travel planner",
    "language learning",
    "mental wellness",
    "family organizer",
    "task manager",
    "journal",
    "side hustle",
    "photo organizer",
    "parenting log",
    "commute planner",
    "stress journal",
    "medication reminder",
    "skincare tracker",
    "reading log",
    "hydration tracker",
    "cleaning schedule",
    "inventory tracker",
    "fan community",
    "event planner",
    "moving checklist",
    "savings goal",
    "calorie tracker",
    "walking tracker",
    "gardening planner",
    "freelance tracker",
    "expense tracker",
    "sleep improvement",
  ],
  "zh-CN": [
    "家庭记账",
    "习惯养成",
    "睡眠记录",
    "健身打卡",
    "学习计划",
    "语言学习",
    "情绪记录",
    "饮食管理",
    "副业管理",
    "旅行计划",
    "任务管理",
    "日记",
    "照片整理",
    "家庭共享",
    "宠物护理",
    "育儿记录",
    "通勤规划",
    "压力记录",
    "菜单管理",
    "用药提醒",
    "护肤记录",
    "阅读记录",
    "喝水提醒",
    "清洁计划",
    "库存管理",
    "追星记录",
    "活动策划",
    "搬家清单",
    "储蓄目标",
    "热量记录",
    "步行记录",
    "园艺管理",
    "自由职业管理",
    "支出记录",
    "睡眠改善",
  ],
};

const DEFAULT_FALLBACK_KEYWORD: Record<Locale, string> = {
  ja: "習慣化",
  en: "habit tracker",
  "zh-CN": "习惯养成",
};

function shuffle<T>(items: T[]) {
  const cloned = [...items];

  for (let index = cloned.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [cloned[index], cloned[randomIndex]] = [cloned[randomIndex], cloned[index]];
  }

  return cloned;
}

function normalizeKeywordList(items: string[]) {
  return items.map((keyword) => keyword.trim()).filter(Boolean);
}

function parseConfiguredKeywords() {
  if (!appEnv.hotKeywordsJson) {
    return null;
  }

  try {
    const parsed = JSON.parse(appEnv.hotKeywordsJson) as Partial<Record<Locale, string[]>>;
    return parsed;
  } catch {
    return null;
  }
}

function getKeywordPool(locale: Locale) {
  const configured = parseConfiguredKeywords();
  const configuredList = configured?.[locale]
    ?.map((keyword) => (typeof keyword === "string" ? keyword.trim() : ""))
    .filter(Boolean);

  if (appEnv.hotKeywordSource === "env" && Array.isArray(configuredList) && configuredList.length > 0) {
    return configuredList;
  }

  const staticList = normalizeKeywordList(STATIC_HOT_KEYWORD_POOL[locale]);
  return staticList.length > 0 ? staticList : [DEFAULT_FALLBACK_KEYWORD[locale]];
}

export async function getTrendingKeywords(locale: Locale, count = 5, exclude: string[] = []) {
  const excluded = new Set(normalizeKeywordList(exclude));
  const pool = getKeywordPool(locale);
  const primary = shuffle(pool.filter((keyword) => !excluded.has(keyword)));

  if (primary.length >= count) {
    return primary.slice(0, count);
  }

  const fallback = shuffle(pool.filter((keyword) => !primary.includes(keyword)));
  return [...primary, ...fallback].slice(0, count);
}

export async function pickFallbackKeyword(locale: Locale) {
  return (await getTrendingKeywords(locale, 1))[0] ?? DEFAULT_FALLBACK_KEYWORD[locale];
}
