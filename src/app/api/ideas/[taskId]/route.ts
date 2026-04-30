import { NextResponse } from "next/server";

import { getExportMarkdown, getTaskFull } from "@/src/lib/store";

type RouteContext = {
  params: Promise<{
    taskId: string;
  }>;
};

export async function GET(request: Request, context: RouteContext) {
  const { taskId } = await context.params;
  const { searchParams } = new URL(request.url);
  const format = searchParams.get("format");

  if (format === "md") {
    const markdown = getExportMarkdown(taskId);

    if (!markdown) {
      return NextResponse.json(
        {
          error: {
            code: "EXPORT_NOT_AVAILABLE",
            message: "Export is available only after unlock.",
          },
        },
        { status: 403 },
      );
    }

    return new NextResponse(markdown, {
      status: 200,
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
        "Content-Disposition": `attachment; filename="${taskId}.md"`,
      },
    });
  }

  const task = getTaskFull(taskId);

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
