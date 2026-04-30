import { NextResponse } from "next/server";

import { getTrendingKeywords } from "@/src/lib/hot-keywords";
import { resolveLocale } from "@/src/lib/locale";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const locale = resolveLocale(searchParams.get("locale"));
  const countParam = Number(searchParams.get("count") ?? "5");
  const count = Number.isFinite(countParam) ? Math.min(Math.max(Math.trunc(countParam), 1), 10) : 5;
  const exclude = searchParams
    .getAll("exclude")
    .flatMap((value) => value.split(","))
    .map((value) => value.trim())
    .filter(Boolean);

  const keywords = await getTrendingKeywords(locale, count, exclude);

  return NextResponse.json({
    locale,
    keywords,
  });
}
