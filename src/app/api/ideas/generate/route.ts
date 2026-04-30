import { randomUUID } from "node:crypto";

import { NextResponse } from "next/server";

import { pickFallbackKeyword } from "@/src/lib/hot-keywords";
import { resolveLocale } from "@/src/lib/locale";
import { consumeFreeGeneration, createIdeaTask, getDailyFreeGenerationStatus } from "@/src/lib/store";

export const runtime = "nodejs";
export const maxDuration = 60;

function parseCustomerId(request: Request) {
  const cookie = request.headers.get("cookie") ?? "";
  const match = cookie.match(/idea_finder_customer=([^;]+)/);
  return match?.[1] ?? "";
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const rawKeyword = typeof body?.keyword === "string" ? body.keyword.trim() : "";
    const market = typeof body?.market === "string" && body.market.trim() ? body.market.trim() : "Japan";
    const locale = resolveLocale(typeof body?.locale === "string" ? body.locale : undefined);
    const customerId = parseCustomerId(request) || `cust_${randomUUID().replace(/-/g, "").slice(0, 16)}`;
    const keyword = (rawKeyword || (await pickFallbackKeyword(locale))).trim();

    consumeFreeGeneration(customerId);
    const task = await createIdeaTask(keyword, market, locale, customerId, 6);
    const response = NextResponse.json(
      {
        taskId: task.taskId,
        status: task.status,
        keyword: task.keyword,
        locale: task.locale,
        freeUsage: getDailyFreeGenerationStatus(customerId),
      },
      { status: 202 },
    );

    response.cookies.set("idea_finder_customer", customerId, {
      httpOnly: false,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });

    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to generate ideas.";
    return NextResponse.json(
      {
        error: {
          code: "IDEA_GENERATION_FAILED",
          message,
        },
      },
      { status: 500 },
    );
  }
}
