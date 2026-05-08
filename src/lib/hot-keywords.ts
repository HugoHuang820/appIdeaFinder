import { appEnv } from "@/src/lib/env";
import type { Locale } from "@/src/lib/types";

type AppStoreSearchResult = {
  trackName?: string;
  primaryGenreName?: string;
  genres?: string[];
};

const LOCALE_KEYWORD_POOL: Partial<Record<Locale, string[]>> = {
  ja: [
    "家計簿",
    "習慣化",
    "睡眠記録",
    "筋トレ記録",
    "勉強計画",
    "語学学習",
    "食事管理",
    "副業管理",
    "旅行計画",
    "タスク管理",
    "日記",
    "写真整理",
    "家族共有",
    "ペットケア",
    "通勤管理",
    "ストレス記録",
    "献立管理",
    "薬管理",
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
  "zh-TW": [
    "家庭記帳",
    "習慣養成",
    "睡眠紀錄",
    "健身打卡",
    "學習計畫",
    "語言學習",
    "飲食管理",
    "副業管理",
    "旅行計畫",
    "任務管理",
    "寵物照護",
    "儲蓄目標",
  ],
};

const MARKET_KEYWORD_POOL: Record<string, string[]> = {
  global: [
    "AI habit coach",
    "budget planner",
    "walking tracker",
    "meal prep",
    "sleep improvement",
    "language learning",
    "pet care",
    "family organizer",
    "study planner",
    "mental wellness",
    "savings goal",
    "freelance tracker",
  ],
  japan: [
    "家計簿",
    "推し活",
    "睡眠改善",
    "通勤管理",
    "献立管理",
    "貯金目標",
    "薬管理",
    "写真整理",
    "学習計画",
    "ペットケア",
    "散歩記録",
    "副業管理",
  ],
  "united states": [
    "AI habit coach",
    "budget planner",
    "walking tracker",
    "meal prep",
    "side hustle",
    "mental wellness",
    "pet care",
    "sleep tracker",
    "family organizer",
    "medication reminder",
    "skincare tracker",
    "savings goal",
  ],
  china: [
    "记账",
    "副业",
    "学习计划",
    "睡眠记录",
    "健身打卡",
    "喝水提醒",
    "宠物护理",
    "家庭共享",
    "储蓄目标",
    "情绪记录",
    "旅行计划",
    "任务管理",
  ],
  "south korea": [
    "habit tracker",
    "study planner",
    "expense tracker",
    "meal planner",
    "sleep tracker",
    "pet care",
    "language learning",
    "walking tracker",
  ],
  "united kingdom": [
    "budget planner",
    "commute planner",
    "meal prep",
    "walking tracker",
    "family organizer",
    "side hustle",
    "mental wellness",
    "reading log",
  ],
  germany: [
    "budget planner",
    "habit tracker",
    "meal planner",
    "walking tracker",
    "family organizer",
    "language learning",
    "expense tracker",
    "sleep improvement",
  ],
  france: [
    "budget planner",
    "meal planner",
    "walking tracker",
    "language learning",
    "family organizer",
    "habit tracker",
    "sleep tracker",
    "pet care",
  ],
  india: [
    "study planner",
    "expense tracker",
    "habit tracker",
    "language learning",
    "side hustle",
    "walking tracker",
    "meal planner",
    "exam prep",
  ],
  canada: [
    "budget planner",
    "walking tracker",
    "meal prep",
    "family organizer",
    "habit tracker",
    "mental wellness",
    "pet care",
    "sleep tracker",
  ],
  australia: [
    "budget planner",
    "walking tracker",
    "meal prep",
    "pet care",
    "habit tracker",
    "family organizer",
    "freelance tracker",
    "sleep improvement",
  ],
};

const DEFAULT_FALLBACK_KEYWORD: Partial<Record<Locale, string>> = {
  ja: "習慣化",
  en: "habit tracker",
  "zh-CN": "习惯养成",
  "zh-TW": "習慣養成",
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
  return [...new Set(items.map((keyword) => keyword.trim()).filter(Boolean))];
}

function normalizeMarket(market?: string) {
  return (market || "Global").trim().toLowerCase();
}

function countriesForMarket(market?: string) {
  const normalized = normalizeMarket(market);

  if (normalized.includes("global") || normalized.includes("all") || normalized.includes("全部")) {
    return ["jp", "us", "cn"];
  }

  if (normalized.includes("japan") || normalized.includes("日本")) return ["jp"];
  if (normalized.includes("china") || normalized.includes("中国")) return ["cn"];
  if (normalized.includes("korea")) return ["kr"];
  if (normalized.includes("kingdom") || normalized.includes("britain")) return ["gb"];
  if (normalized.includes("germany")) return ["de"];
  if (normalized.includes("france")) return ["fr"];
  if (normalized.includes("india")) return ["in"];
  if (normalized.includes("canada")) return ["ca"];
  if (normalized.includes("australia")) return ["au"];
  if (normalized.includes("united states") || normalized.includes("usa") || normalized.includes("america")) return ["us"];

  return ["us"];
}

function marketKeywordPool(market?: string) {
  const normalized = normalizeMarket(market);
  const key = Object.keys(MARKET_KEYWORD_POOL).find((item) => normalized.includes(item));
  return MARKET_KEYWORD_POOL[key ?? "global"];
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

function configuredKeywordPool(locale: Locale) {
  const configured = parseConfiguredKeywords();
  return configured?.[locale]
    ?.map((keyword) => (typeof keyword === "string" ? keyword.trim() : ""))
    .filter(Boolean);
}

function getKeywordPool(locale: Locale, market?: string) {
  const configuredList = configuredKeywordPool(locale);

  if (appEnv.hotKeywordSource === "env" && Array.isArray(configuredList) && configuredList.length > 0) {
    return configuredList;
  }

  return normalizeKeywordList([...(LOCALE_KEYWORD_POOL[locale] ?? []), ...(LOCALE_KEYWORD_POOL.en ?? [])]);
}

function extractCandidateFromTitle(title: string) {
  return title
    .replace(/[™®©]/g, "")
    .replace(/[-–—:|].*$/g, "")
    .replace(/\b(app|apps|tracker|planner|manager|journal|diary)\b$/i, "")
    .trim()
    .split(/\s+/)
    .slice(0, 3)
    .join(" ");
}

function cleanCandidate(value: string) {
  const candidate = value.trim().replace(/\s+/g, " ");
  const lower = candidate.toLowerCase();
  const blocked = new Set(["utilities", "lifestyle", "health", "fitness", "productivity", "education", "finance"]);

  if (candidate.length < 4 || candidate.length > 36 || blocked.has(lower)) {
    return "";
  }

  return candidate;
}

async function fetchAppStoreCandidates(seedKeywords: string[], market?: string) {
  if (!appEnv.appStoreSignalEnabled) {
    return [];
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 2500);

  try {
    const countries = countriesForMarket(market);
    const seeds = seedKeywords.slice(0, 3);
    const settled = await Promise.allSettled(
      countries.flatMap((country) =>
        seeds.map(async (seed) => {
          const url = new URL("https://itunes.apple.com/search");
          url.searchParams.set("term", seed);
          url.searchParams.set("country", country);
          url.searchParams.set("entity", "software");
          url.searchParams.set("limit", "12");

          const response = await fetch(url, {
            headers: {
              "User-Agent": "AppIdeaFinder/1.0",
            },
            signal: controller.signal,
            next: {
              revalidate: 3600,
            },
          });

          if (!response.ok) {
            return [];
          }

          const data = (await response.json()) as { results?: AppStoreSearchResult[] };
          return Array.isArray(data.results) ? data.results : [];
        }),
      ),
    );

    return normalizeKeywordList(
      settled
        .flatMap((item) => (item.status === "fulfilled" ? item.value : []))
        .flatMap((result) => [
          result.trackName ? extractCandidateFromTitle(result.trackName) : "",
          result.primaryGenreName ?? "",
          ...(result.genres ?? []),
        ])
        .map(cleanCandidate)
        .filter(Boolean),
    );
  } catch {
    return [];
  } finally {
    clearTimeout(timeout);
  }
}

export async function getTrendingKeywords(locale: Locale, count = 5, exclude: string[] = [], market = "Global") {
  const excluded = new Set(normalizeKeywordList(exclude).map((keyword) => keyword.toLowerCase()));
  const configuredList = configuredKeywordPool(locale);
  const marketPool = shuffle(marketKeywordPool(market));
  const localePool = shuffle(getKeywordPool(locale, market));
  const curatedPool =
    appEnv.hotKeywordSource === "env" && Array.isArray(configuredList) && configuredList.length > 0
      ? shuffle(configuredList)
      : normalizeKeywordList([...marketPool, ...localePool]);
  const dynamicPool = shuffle(await fetchAppStoreCandidates(curatedPool, market));
  const combinedPool = normalizeKeywordList([...curatedPool, ...dynamicPool]);
  const primary = combinedPool.filter((keyword) => !excluded.has(keyword.toLowerCase()));

  if (primary.length >= count) {
    return primary.slice(0, count);
  }

  return [...primary, ...combinedPool.filter((keyword) => !primary.includes(keyword))].slice(0, count);
}

export async function pickFallbackKeyword(locale: Locale, market = "Global") {
  return (
    (await getTrendingKeywords(locale, 1, [], market))[0] ??
    DEFAULT_FALLBACK_KEYWORD[locale] ??
    DEFAULT_FALLBACK_KEYWORD.en ??
    "habit tracker"
  );
}
