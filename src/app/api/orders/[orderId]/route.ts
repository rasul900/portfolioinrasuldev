import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { Order } from "@/lib/models";
import { sendOrderStatusEmail } from "@/lib/resend";
import { cacheDel } from "@/lib/redis";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const session = await auth();
  if (!session?.user || (session.user as { role?: string }).role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { orderId } = await params;
  const { status } = await req.json();
  await connectDB();

  try {
    const order = await Order.findOneAndUpdate({ orderId }, { status }, { new: true });
    if (!order) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    const email = order.customer?.email ?? order.customer?.telegram;
    if (typeof email === "string" && email.includes("@")) {
      await sendOrderStatusEmail(email, orderId, status);
    }
    await cacheDel("analytics:live");
    return NextResponse.json({ success: true, order });
  } catch {
    return NextResponse.json({ success: true, orderId, status });
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const { orderId } = await params;
  const { receiptUrl } = await req.json();
  await connectDB();

  try {
    await Order.findOneAndUpdate({ orderId }, { receiptUrl, status: "processing" });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: true, fallback: true });
  }
}
