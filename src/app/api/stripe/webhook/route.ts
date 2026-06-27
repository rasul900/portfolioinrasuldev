import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { connectDB } from "@/lib/mongodb";
import { Order } from "@/lib/models";

export async function POST(req: Request) {
  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }

  const body = await req.text();
  const sig = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    return NextResponse.json({ error: "Webhook not configured" }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.error("Webhook signature failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "payment_intent.succeeded") {
    const intent = event.data.object;
    const orderId = intent.metadata?.orderId;
    if (orderId) {
      await connectDB();
      try {
        await Order.findOneAndUpdate(
          { orderId },
          { status: "processing", paymentMethod: "stripe", stripePaymentId: intent.id }
        );
      } catch {
        // optional DB
      }
    }
  }

  return NextResponse.json({ received: true });
}
