import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Order } from "@/lib/models";

function generateOrderId() {
  return `RD-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const orderId = generateOrderId();

    const order = {
      orderId,
      items: body.items,
      subtotal: body.total,
      total: body.total,
      status: body.paymentMethod === "stripe" ? "processing" : "pending",
      customer: body.customer,
      paymentMethod: body.paymentMethod ?? "bank_transfer",
      receiptUrl: body.receiptUrl,
      stripePaymentId: body.stripePaymentId,
    };

    await connectDB();
    try {
      await Order.create(order);
    } catch {
      // DB optional
    }

    return NextResponse.json({ orderId, success: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET() {
  await connectDB();
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).limit(50).lean();
    return NextResponse.json(orders);
  } catch {
    return NextResponse.json([]);
  }
}
