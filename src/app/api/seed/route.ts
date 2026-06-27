import { auth } from "@/lib/auth";
import { seedDatabase } from "@/lib/seed";
import { NextResponse } from "next/server";

export async function POST() {
  const session = await auth();
  if (!session?.user || (session.user as { role?: string }).role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const result = await seedDatabase();
  return NextResponse.json(result);
}
