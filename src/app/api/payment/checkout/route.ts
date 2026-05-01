import { randomUUID } from "node:crypto";

import { NextResponse } from "next/server";

import { createOrder, getTask } from "@/src/lib/store";
import { resolveLocale } from "@/src/lib/locale";
import type { PurchaseType } from "@/src/lib/types";

function parseCustomerId(request: Request) {
  const cookie = request.headers.get("cookie") ?? "";
  const match = cookie.match(/idea_finder_customer=([^;]+)/);
  return match?.[1] ?? "";
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const taskId = typeof body?.taskId === "string" && body.taskId.trim() ? body.taskId : "";
  const locale = resolveLocale(typeof body?.locale === "string" ? body.locale : undefined);
  const purchaseType: PurchaseType = body?.purchaseType === "subscription" ? "subscription" : "one_time_pack";
  const subscriptionPlanId = typeof body?.subscriptionPlanId === "string" ? body.subscriptionPlanId : null;
  const existingCustomerId = parseCustomerId(request);
  const customerId = existingCustomerId || `cust_${randomUUID().replace(/-/g, "").slice(0, 16)}`;

  if (!taskId && purchaseType !== "subscription") {
    return NextResponse.json(
      {
        error: {
          code: "TASK_REQUIRED",
          message: "A task is required for one-time pack checkout.",
        },
      },
      { status: 400 },
    );
  }

  const task = taskId ? getTask(taskId) : null;

  if (taskId && !task) {
    return NextResponse.json(
      {
        error: {
          code: "TASK_NOT_FOUND",
          message: "No idea task found for the provided taskId.",
        },
      },
      { status: 404 },
    );
  }

  if (task && task.status !== "completed") {
    return NextResponse.json(
      {
        error: {
          code: "TASK_NOT_READY",
          message: "Ideas must finish generating before checkout.",
        },
      },
      { status: 400 },
    );
  }

  if (task && task.isUnlocked) {
    return NextResponse.json(
      {
        error: {
          code: "ALREADY_UNLOCKED",
          message: "This idea pack is already unlocked.",
        },
      },
      { status: 409 },
    );
  }

  const origin = new URL(request.url).origin;
  const order = await createOrder({
    taskId: taskId || null,
    purchaseType,
    subscriptionPlanId,
    locale: task?.locale ?? locale,
    customerId,
    origin,
  });

  if (!order) {
    return NextResponse.json(
      {
        error: {
          code: "CHECKOUT_CREATE_FAILED",
          message: "Failed to create checkout order.",
        },
      },
      { status: 500 },
    );
  }

  const response = NextResponse.json(
    {
      order,
    },
    { status: 201 },
  );

  if (!existingCustomerId) {
    response.cookies.set("idea_finder_customer", customerId, {
      httpOnly: false,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });
  }

  return response;
}
