import { appEnv } from "@/src/lib/env";
import type { Locale } from "@/src/lib/types";

type SignalInput = {
  keyword: string;
  market: string;
  locale: Locale;
};

function countryForMarket(market: string, locale: Locale) {
  const normalized = market.trim().toLowerCase();

  if (normalized.includes("japan") || locale === "ja") {
    return "jp";
  }

  if (normalized.includes("china") || locale === "zh-CN") {
    return "cn";
  }

  return "us";
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

export async function fetchLightweightAppStoreContext(input: SignalInput) {
  if (!appEnv.appStoreSignalEnabled) {
    return [];
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    try {
      const country = countryForMarket(input.market, input.locale);
      const url = new URL("https://itunes.apple.com/search");
      url.searchParams.set("term", input.keyword);
      url.searchParams.set("country", country);
      url.searchParams.set("entity", "software");
      url.searchParams.set("limit", "8");

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

      const data = (await response.json()) as {
        results?: Array<{
          trackName?: string;
          description?: string;
          primaryGenreName?: string;
          genres?: string[];
        }>;
      };

      const results = Array.isArray(data.results) ? data.results : [];
      if (results.length === 0) {
        return [];
      }

      const titles = unique(results.map((item) => item.trackName ?? "")).slice(0, 4);
      const genres = unique(results.flatMap((item) => item.genres ?? [item.primaryGenreName ?? ""])).slice(0, 4);
      const words = topWords(results.map((item) => item.description ?? ""));

      const context: string[] = [];

      if (titles.length > 0) {
        context.push(`Top matching App Store titles include: ${titles.join(", ")}.`);
      }

      if (genres.length > 0) {
        context.push(`Common App Store categories around this keyword include: ${genres.join(", ")}.`);
      }

      if (words.length > 0) {
        context.push(`Repeated positioning terms in app descriptions include: ${words.join(", ")}.`);
      }

      return context;
    } finally {
      clearTimeout(timeout);
    }
  } catch {
    return [];
  }
}
