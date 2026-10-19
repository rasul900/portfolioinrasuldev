import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { News } from "@/lib/models";

export async function GET() {
  try {
    await connectDB();
    if (!News.db?.readyState) return NextResponse.json([]);
    const news = await News.find({ active: true }).sort({ createdAt: -1 }).lean();
    return NextResponse.json(news);
  } catch {
    return NextResponse.json({ error: "Yangiliklarni yuklab bo‘lmadi" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Ruxsat berilmagan" }, { status: 401 });

  try {
    const body = await request.json();
    const title = typeof body.title === "string" ? body.title.trim() : "";
    const text = typeof body.text === "string" ? body.text.trim() : "";
    if (!title || !text) return NextResponse.json({ error: "Sarlavha va matn majburiy" }, { status: 400 });

    await connectDB();
    if (!News.db?.readyState) return NextResponse.json({ error: "MongoDB ulanmagan" }, { status: 503 });
    const item = await News.create({
      title: title.slice(0, 120),
      text: text.slice(0, 500),
      link: typeof body.link === "string" ? body.link.trim().slice(0, 500) : "",
      image: typeof body.image === "string" ? body.image.trim().slice(0, 1000) : "",
      position: ["top", "bottom", "side"].includes(body.position) ? body.position : "side",
      active: body.active !== false,
    });
    return NextResponse.json(item, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Yangilik yaratilmadi" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Ruxsat berilmagan" }, { status: 401 });
  try {
    const { id, active } = await request.json();
    await connectDB();
    const item = await News.findByIdAndUpdate(id, { active: Boolean(active) }, { new: true });
    return item ? NextResponse.json(item) : NextResponse.json({ error: "Topilmadi" }, { status: 404 });
  } catch {
    return NextResponse.json({ error: "Yangilik yangilanmadi" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Ruxsat berilmagan" }, { status: 401 });
  try {
    const { id } = await request.json();
    await connectDB();
    await News.findByIdAndDelete(id);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Yangilik o‘chirilmadi" }, { status: 500 });
  }
}
