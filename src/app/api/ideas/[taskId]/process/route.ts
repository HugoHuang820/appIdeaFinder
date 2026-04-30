import { NextResponse } from "next/server";

import { getTaskPreview, processIdeaTask } from "@/src/lib/store";

export const runtime = "nodejs";
export const maxDuration = 60;

type RouteContext = {
  params: Promise<{
    taskId: string;
  }>;
};

export async function POST(_request: Request, context: RouteContext) {
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

  if (task.status === "pending" || task.status === "processing") {
    await processIdeaTask(taskId);
  }

  const updatedTask = getTaskPreview(taskId);

  if (!updatedTask) {
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

  return NextResponse.json(updatedTask);
}
