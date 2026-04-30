import { NextResponse } from "next/server";

import { getOrder } from "@/src/lib/store";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const order = getOrder(id);

  if (!order) {
    return NextResponse.json(
      {
        error: {
          code: "ORDER_NOT_FOUND",
          message: "No payment order found for the provided id.",
        },
      },
      { status: 404 },
    );
  }

  return NextResponse.json(order);
}
