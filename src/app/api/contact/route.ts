import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import { Contact } from "@/lib/models";
import { verifyTurnstile } from "@/lib/turnstile";
import { sendContactEmail } from "@/lib/resend";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  message: z.string().min(10),
  turnstileToken: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = schema.parse(body);

    if (process.env.TURNSTILE_SECRET_KEY && data.turnstileToken) {
      const valid = await verifyTurnstile(data.turnstileToken);
      if (!valid) {
        return NextResponse.json({ error: "Captcha failed" }, { status: 403 });
      }
    }

    await connectDB();
    try {
      await Contact.create({ name: data.name, email: data.email, message: data.message });
    } catch {
      // DB optional
    }

    await sendContactEmail(data);

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    if (botToken && chatId) {
      await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: `📩 Yangi xabar\n\n👤 ${data.name}\n📧 ${data.email}\n\n${data.message}`,
        }),
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
