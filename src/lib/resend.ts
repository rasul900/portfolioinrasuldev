import { Resend } from "resend";

let resend: Resend | null = null;

export function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  if (!resend) resend = new Resend(key);
  return resend;
}

export async function sendContactEmail(data: {
  name: string;
  email: string;
  message: string;
}) {
  const client = getResend();
  const to = process.env.CONTACT_EMAIL ?? "hello@rasuldev.uz";
  if (!client) return false;
  try {
    await client.emails.send({
      from: "RASUL DEV <onboarding@resend.dev>",
      to,
      replyTo: data.email,
      subject: `Yangi xabar: ${data.name}`,
      text: `Ism: ${data.name}\nEmail: ${data.email}\n\n${data.message}`,
    });
    return true;
  } catch (e) {
    console.error("Resend failed:", e);
    return false;
  }
}

export async function sendOrderStatusEmail(
  email: string,
  orderId: string,
  status: string
) {
  const client = getResend();
  if (!client || !email.includes("@")) return false;
  try {
    await client.emails.send({
      from: "RASUL DEV <onboarding@resend.dev>",
      to: email,
      subject: `Buyurtma ${orderId} — ${status}`,
      text: `Buyurtmangiz statusi yangilandi: ${status}\nBuyurtma ID: ${orderId}`,
    });
    return true;
  } catch {
    return false;
  }
}
