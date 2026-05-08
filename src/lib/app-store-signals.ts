import { appEnv } from "@/src/lib/env";
import type { Locale } from "@/src/lib/types";

type SignalInput = {
  keyword: string;
  market: string;
  locale: Locale;
};

type AppStoreResult = {
  trackName?: string;
  description?: string;
  primaryGenreName?: string;
  genres?: string[];
  averageUserRating?: number;
  userRatingCount?: number;
  price?: number;
  formattedPrice?: string;
  currentVersionReleaseDate?: string;
};

function countriesForMarket(market: string, locale: Locale) {
  const normalized = market.trim().toLowerCase();

  if (
    !normalized ||
    normalized.includes("global") ||
    normalized.includes("all") ||
    normalized.includes("全部") ||
    normalized.includes("world")
  ) {
    return ["jp", "us", "cn"];
  }

  if (normalized.includes("japan") || normalized.includes("日本")) {
    return ["jp"];
  }

  if (normalized.includes("china") || normalized.includes("中国")) {
    return ["cn"];
  }

  if (normalized.includes("korea") || normalized.includes("韩国") || normalized.includes("韓国")) {
    return ["kr"];
  }

  if (normalized.includes("kingdom") || normalized.includes("britain") || normalized.includes("英国")) {
    return ["gb"];
  }

  if (normalized.includes("germany") || normalized.includes("德国") || normalized.includes("ドイツ")) {
    return ["de"];
  }

  if (normalized.includes("france") || normalized.includes("法国") || normalized.includes("フランス")) {
    return ["fr"];
  }

  if (normalized.includes("india") || normalized.includes("印度") || normalized.includes("インド")) {
    return ["in"];
  }

  if (normalized.includes("canada") || normalized.includes("加拿大") || normalized.includes("カナダ")) {
    return ["ca"];
  }

  if (normalized.includes("australia") || normalized.includes("澳大利亚") || normalized.includes("オーストラリア")) {
    return ["au"];
  }

  if (normalized.includes("united states") || normalized.includes("usa") || normalized.includes("america") || normalized.includes("美国")) {
    return ["us"];
  }

  if (locale === "ja") {
    return ["jp"];
  }

  if (locale === "zh-CN") {
    return ["cn"];
  }

  return ["us"];
}

function expandKeyword(keyword: string, locale: Locale) {
  const normalized = keyword.trim().replace(/\s+/g, " ");
  const expansions: Partial<Record<Locale, string[]>> = {
    ja: ["アプリ", "管理", "記録", "目標", "習慣", "家計簿", "節約"],
    en: ["app", "tracker", "planner", "goals", "habit", "budget", "reminder"],
    "zh-CN": ["应用", "管理", "记录", "目标", "习惯", "预算", "提醒"],
    "zh-TW": ["應用", "管理", "記錄", "目標", "習慣", "預算", "提醒"],
    ko: ["앱", "관리", "기록", "목표", "습관", "예산", "알림"],
    es: ["app", "seguimiento", "planificador", "metas", "habito", "presupuesto", "recordatorio"],
    "pt-BR": ["app", "rastreador", "planejador", "metas", "habito", "orcamento", "lembrete"],
    fr: ["application", "suivi", "planning", "objectifs", "habitude", "budget", "rappel"],
    de: ["app", "tracker", "planer", "ziele", "gewohnheit", "budget", "erinnerung"],
    it: ["app", "tracker", "pianificatore", "obiettivi", "abitudine", "budget", "promemoria"],
    nl: ["app", "tracker", "planner", "doelen", "gewoonte", "budget", "herinnering"],
    sv: ["app", "tracker", "planerare", "mal", "vana", "budget", "paminnelse"],
    pl: ["aplikacja", "tracker", "planer", "cele", "nawyk", "budzet", "przypomnienie"],
    tr: ["uygulama", "takip", "planlayici", "hedefler", "aliskanlik", "butce", "hatirlatici"],
    id: ["aplikasi", "pelacak", "perencana", "target", "kebiasaan", "anggaran", "pengingat"],
    vi: ["ung dung", "theo doi", "lap ke hoach", "muc tieu", "thoi quen", "ngan sach", "nhac nho"],
    th: ["แอป", "ติดตาม", "วางแผน", "เป้าหมาย", "นิสัย", "งบประมาณ", "เตือน"],
    hi: ["app", "tracker", "planner", "goals", "habit", "budget", "reminder"],
    ar: ["app", "tracker", "planner", "goals", "habit", "budget", "reminder"],
    ru: ["приложение", "трекер", "планировщик", "цели", "привычка", "бюджет", "напоминание"],
  };
  const localeExpansions = expansions[locale] ?? expansions.en ?? [];

  return unique([
    normalized,
    ...localeExpansions.map((suffix) => `${normalized} ${suffix}`),
  ]).slice(0, 6);
}

function unique(items: string[]) {
  return [...new Set(items.filter(Boolean))];
}

function topWords(texts: string[]) {
  const counter = new Map<string, number>();
  const stopWords = new Set(["with", "your", "from", "this", "that", "more", "into", "daily", "easy"]);

  texts
    .join(" ")
    .toLowerCase()
    .split(/[^a-z0-9]+/i)
    .filter((token) => token.length >= 4 && !stopWords.has(token))
    .forEach((token) => {
      counter.set(token, (counter.get(token) ?? 0) + 1);
    });

  return [...counter.entries()]
    .sort((left, right) => right[1] - left[1])
    .slice(0, 5)
    .map(([token]) => token);
}

function bucketRating(rating: number | undefined) {
  if (typeof rating !== "number" || Number.isNaN(rating)) {
    return "unknown";
  }

  if (rating >= 4.5) {
    return "excellent";
  }

  if (rating >= 4) {
    return "good";
  }

  if (rating >= 3) {
    return "mixed";
  }

  return "weak";
}

function median(values: number[]) {
  if (values.length === 0) {
    return 0;
  }

  const sorted = [...values].sort((left, right) => left - right);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[middle - 1] + sorted[middle]) / 2 : sorted[middle];
}

function daysSince(dateValue: string | undefined) {
  if (!dateValue) {
    return null;
  }

  const timestamp = Date.parse(dateValue);
  if (Number.isNaN(timestamp)) {
    return null;
  }

  return Math.max(0, Math.round((Date.now() - timestamp) / 86_400_000));
}

async function fetchAppStoreResults(term: string, country: string, signal: AbortSignal) {
  const url = new URL("https://itunes.apple.com/search");
  url.searchParams.set("term", term);
  url.searchParams.set("country", country);
  url.searchParams.set("entity", "software");
  url.searchParams.set("limit", "30");

  const response = await fetch(url, {
    headers: {
      "User-Agent": "AppIdeaFinder/1.0",
    },
    signal,
    next: {
      revalidate: 3600,
    },
  });

  if (!response.ok) {
    return [];
  }

  const data = (await response.json()) as { results?: AppStoreResult[] };
  return Array.isArray(data.results) ? data.results : [];
}

export async function fetchLightweightAppStoreContext(input: SignalInput) {
  if (!appEnv.appStoreSignalEnabled) {
    return [];
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    try {
      const countries = countriesForMarket(input.market, input.locale);
      const keywordVariants = expandKeyword(input.keyword, input.locale);
      const settledResults = await Promise.allSettled(
        countries.flatMap((country) =>
          keywordVariants.map((term) => fetchAppStoreResults(term, country, controller.signal)),
        ),
      );
      const results = settledResults
        .flatMap((settled) => (settled.status === "fulfilled" ? settled.value : []))
        .filter((item, index, list) => {
          const name = item.trackName?.trim().toLowerCase();
          return Boolean(name) && list.findIndex((candidate) => candidate.trackName?.trim().toLowerCase() === name) === index;
        });

      if (results.length === 0) {
        return [];
      }

      const titles = unique(results.map((item) => item.trackName ?? "")).slice(0, 8);
      const genres = unique(results.flatMap((item) => item.genres ?? [item.primaryGenreName ?? ""])).slice(0, 6);
      const words = topWords(results.map((item) => item.description ?? ""));
      const ratingCounts = results.map((item) => item.userRatingCount ?? 0).filter((value) => value > 0);
      const ratedApps = results.filter((item) => typeof item.averageUserRating === "number");
      const averageRating =
        ratedApps.length > 0
          ? ratedApps.reduce((sum, item) => sum + (item.averageUserRating ?? 0), 0) / ratedApps.length
          : 0;
      const paidApps = results.filter((item) => (item.price ?? 0) > 0);
      const recentlyUpdated = results.filter((item) => {
        const days = daysSince(item.currentVersionReleaseDate);
        return typeof days === "number" && days <= 180;
      });
      const staleApps = results.filter((item) => {
        const days = daysSince(item.currentVersionReleaseDate);
        return typeof days === "number" && days >= 540;
      });

      const context: string[] = [];

      context.push(`Keyword variants sampled: ${keywordVariants.join(", ")}.`);
      context.push(`App Store countries sampled: ${countries.map((country) => country.toUpperCase()).join(", ")}.`);
      context.push(`Sampled ${results.length} unique App Store apps across the selected keyword variants.`);

      if (titles.length > 0) {
        context.push(`Top matching App Store titles include: ${titles.join(", ")}.`);
      }

      if (genres.length > 0) {
        context.push(`Common App Store categories around this keyword include: ${genres.join(", ")}.`);
      }

      if (words.length > 0) {
        context.push(`Repeated positioning terms in app descriptions include: ${words.join(", ")}.`);
      }

      if (ratedApps.length > 0) {
        context.push(
          `Rating signal: average rating is ${averageRating.toFixed(1)} (${bucketRating(averageRating)}), median rating count is ${Math.round(median(ratingCounts))}.`,
        );
      }

      context.push(
        `Monetization signal: ${paidApps.length} of ${results.length} sampled apps are paid upfront; most others are free and may rely on ads, subscriptions, or in-app purchases.`,
      );

      if (recentlyUpdated.length > 0 || staleApps.length > 0) {
        context.push(
          `Freshness signal: ${recentlyUpdated.length} sampled apps were updated within 180 days, while ${staleApps.length} appear stale for 18+ months.`,
        );
      }

      return context;
    } finally {
      clearTimeout(timeout);
    }
  } catch {
    return [];
  }
}
