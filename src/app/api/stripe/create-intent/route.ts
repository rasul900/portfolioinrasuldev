import { NextResponse } from "next/server";
import { getStripe, isStripeEnabled } from "@/lib/stripe";

export async function POST(req: Request) {
  if (!isStripeEnabled()) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }

  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json({ error: "Stripe unavailable" }, { status: 503 });
  }

  try {
    const { amount, currency = "usd", metadata } = await req.json();
    const intent = await stripe.paymentIntents.create({
      amount: Math.round(amount),
      currency,
      automatic_payment_methods: { enabled: true },
      metadata: metadata ?? {},
    });
    return NextResponse.json({
      clientSecret: intent.client_secret,
      paymentIntentId: intent.id,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Payment intent failed" }, { status: 500 });
  }
}
