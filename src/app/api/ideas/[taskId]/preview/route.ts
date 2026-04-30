import { NextResponse } from "next/server";

import { getTaskPreview } from "@/src/lib/store";

type RouteContext = {
  params: Promise<{
    taskId: string;
  }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { taskId } = await context.params;
  const task = getTaskPreview(taskId);

  if (!task) {
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

  return NextResponse.json(task);
}
