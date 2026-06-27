import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { uploadToCloudinary, isCloudinaryEnabled } from "@/lib/cloudinary";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) {
      return NextResponse.json({ error: "No file" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const base64 = `data:${file.type};base64,${Buffer.from(bytes).toString("base64")}`;

    if (isCloudinaryEnabled()) {
      const url = await uploadToCloudinary(base64);
      if (url) return NextResponse.json({ url });
    }

    // Dev fallback: return data URL (stored in order locally)
    return NextResponse.json({
      url: base64,
      fallback: true,
      message: "Cloudinary not configured — using local preview",
    });
  } catch {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
