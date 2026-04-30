import { NextResponse } from "next/server";

import { verifyStripeWebhook } from "@/src/lib/payment-provider";
import { markOrderPaid, markOrderPaidBySessionId } from "@/src/lib/store";

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  const rawBody = await request.text();

  try {
    const event = verifyStripeWebhook(signature, rawBody);

    if (event?.type === "checkout.session.completed") {
      const session = event.data.object;
      const orderId = typeof session.metadata?.orderId === "string" ? session.metadata.orderId : "";

      if (orderId) {
        markOrderPaid(orderId);
      } else if (session.id) {
        markOrderPaidBySessionId(session.id);
      }
    }

    if (event) {
      return NextResponse.json({ received: true });
    }
  } catch {
    return NextResponse.json(
      {
        error: {
          code: "INVALID_WEBHOOK_SIGNATURE",
          message: "Stripe webhook signature verification failed.",
        },
      },
      { status: 400 },
    );
  }

  const body = rawBody ? (JSON.parse(rawBody) as Record<string, unknown>) : null;
  const orderId =
    typeof (body?.data as { object?: { metadata?: { orderId?: string } } })?.object?.metadata?.orderId === "string"
      ? (body?.data as { object: { metadata: { orderId: string } } }).object.metadata.orderId
      : "";
  const paymentStatus = (body?.data as { object?: { payment_status?: string } })?.object?.payment_status;

  if (!orderId || paymentStatus !== "paid") {
    return NextResponse.json(
      {
        received: true,
      },
      { status: 200 },
    );
  }

  markOrderPaid(orderId);

  return NextResponse.json({
    received: true,
  });
}
