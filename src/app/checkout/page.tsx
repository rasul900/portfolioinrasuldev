"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCartStore } from "@/store/cart";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { Footer } from "@/components/layout/footer";
import { ReceiptUpload } from "@/components/shop/receipt-upload";
import { StripeCheckout } from "@/components/shop/stripe-checkout";
import { toast } from "sonner";
import { Check, CreditCard, Building2 } from "lucide-react";

const schema = z.object({
  fullName: z.string().min(2),
  phone: z.string().min(9),
  telegram: z.string().min(2),
  email: z.string().email().optional().or(z.literal("")),
  country: z.string().min(2),
  city: z.string().min(2),
  region: z.string().min(2),
  address: z.string().min(5),
  postalCode: z.string().min(3),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;
type PaymentMethod = "bank_transfer" | "stripe";

const steps = ["Savat", "Yetkazish", "To'lov", "Tasdiq"];

export default function CheckoutPage() {
  const [step, setStep] = useState(0);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("bank_transfer");
  const [receiptUrl, setReceiptUrl] = useState<string | null>(null);
  const [stripePaymentId, setStripePaymentId] = useState<string | null>(null);
  const [pendingOrderId, setPendingOrderId] = useState<string | null>(null);

  const items = useCartStore((s) => s.items);
  const total = useCartStore((s) => s.total);
  const clearCart = useCartStore((s) => s.clearCart);

  const { register, handleSubmit, getValues, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { country: "O'zbekiston", city: "Toshkent" },
  });

  if (items.length === 0 && !orderId) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-6">
        <p className="text-slate mb-4">Savat bo&apos;sh</p>
        <Button href="/shop">Shopga o&apos;tish</Button>
      </div>
    );
  }

  const createOrder = async (extra: Record<string, unknown> = {}) => {
    const customer = getValues();
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items,
        customer,
        total: total(),
        paymentMethod,
        receiptUrl,
        stripePaymentId,
        ...extra,
      }),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error);
    return result.orderId as string;
  };

  const onSubmit = async () => {
    try {
      const id = await createOrder();
      setOrderId(id);
      setStep(3);
      clearCart();
      toast.success("Buyurtma qabul qilindi!");
    } catch {
      toast.error("Xatolik yuz berdi");
    }
  };

  const handleStripeSuccess = async (paymentIntentId: string) => {
    setStripePaymentId(paymentIntentId);
    try {
      const id = pendingOrderId ?? (await createOrder({ paymentMethod: "stripe", stripePaymentId: paymentIntentId }));
      setOrderId(id);
      setStep(3);
      clearCart();
    } catch {
      toast.error("Buyurtma saqlash xatosi");
    }
  };

  const prepareStripeOrder = () => {
    const id = `RD-PENDING-${Date.now().toString(36).toUpperCase()}`;
    setPendingOrderId(id);
  };

  return (
    <>
      <div className="mx-auto max-w-3xl px-6 pt-28 pb-32">
        <h1 className="font-display mb-8 text-4xl font-bold">Checkout</h1>

        <div className="mb-12 flex justify-between">
          {steps.map((s, i) => (
            <div key={s} className={`flex items-center gap-2 text-sm ${i <= step ? "text-glow" : "text-slate"}`}>
              <span className={`flex h-8 w-8 items-center justify-center rounded-full border ${i <= step ? "border-azure bg-azure/20" : "border-white/10"}`}>
                {i < step ? <Check className="h-4 w-4" /> : i + 1}
              </span>
              <span className="hidden sm:inline">{s}</span>
            </div>
          ))}
        </div>

        {step === 3 && orderId ? (
          <div className="glass rounded-2xl p-8 text-center">
            <div className="mb-4 text-5xl text-green-400">✓</div>
            <h2 className="font-display text-2xl font-bold">Buyurtma tasdiqlandi!</h2>
            <p className="text-slate mt-2">Buyurtma raqami: <span className="text-glow font-mono">{orderId}</span></p>
            {paymentMethod === "bank_transfer" && !receiptUrl && (
              <>
                <p className="text-slate mt-4 text-sm">To&apos;lovdan keyin chekni yuklang:</p>
                <ReceiptUpload orderId={orderId} onUploaded={setReceiptUrl} />
              </>
            )}
            <Button href="/" className="mt-8">Bosh sahifa</Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            {step === 0 && (
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={`${item.productId}-${item.size}`} className="glass flex justify-between rounded-xl p-4">
                    <span>{item.name} × {item.quantity}</span>
                    <span>{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
                <div className="flex justify-between text-lg font-bold">
                  <span>Jami</span>
                  <span>{formatPrice(total())}</span>
                </div>
                <Button type="button" onClick={() => setStep(1)} className="w-full">Davom etish</Button>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-4">
                {(["fullName", "phone", "telegram", "email", "country", "city", "region", "address", "postalCode"] as const).map((field) => (
                  <div key={field}>
                    <input {...register(field)} placeholder={field} className="glass interactive w-full rounded-xl px-4 py-3 outline-none" />
                    {errors[field] && <p className="mt-1 text-sm text-red-400">Majburiy maydon</p>}
                  </div>
                ))}
                <textarea {...register("notes")} placeholder="Izoh" className="glass w-full rounded-xl px-4 py-3 outline-none" rows={3} />
                <div className="flex gap-4">
                  <Button type="button" variant="secondary" onClick={() => setStep(0)}>Orqaga</Button>
                  <Button type="button" onClick={() => setStep(2)} className="flex-1">To&apos;lovga</Button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("bank_transfer")}
                    className={`glass interactive rounded-xl p-4 text-left ${paymentMethod === "bank_transfer" ? "ring-2 ring-azure" : ""}`}
                  >
                    <Building2 className="mb-2 h-6 w-6 text-glow" />
                    <div className="font-medium">Bank o&apos;tkazmasi</div>
                    <div className="text-slate text-xs">UZS / USD / EUR</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => { setPaymentMethod("stripe"); prepareStripeOrder(); }}
                    className={`glass interactive rounded-xl p-4 text-left ${paymentMethod === "stripe" ? "ring-2 ring-azure" : ""}`}
                  >
                    <CreditCard className="mb-2 h-6 w-6 text-glow" />
                    <div className="font-medium">Karta (Stripe)</div>
                    <div className="text-slate text-xs">Visa, Mastercard</div>
                  </button>
                </div>

                {paymentMethod === "bank_transfer" ? (
                  <>
                    <div className="glass rounded-xl p-6">
                      <h3 className="mb-4 font-medium">Bank rekvizitlari</h3>
                      <p className="text-slate text-sm">UZS: 8600 0000 0000 0000 — RASUL DEV</p>
                      <p className="text-slate text-sm">USD: IBAN UZ00 0000 0000 0000 0000</p>
                      <p className="text-slate mt-4 text-sm">Izohda buyurtma raqamini yozing.</p>
                    </div>
                    <ReceiptUpload onUploaded={setReceiptUrl} />
                    <div className="flex gap-4">
                      <Button type="button" variant="secondary" onClick={() => setStep(1)}>Orqaga</Button>
                      <Button type="submit" className="flex-1">Buyurtmani tasdiqlash</Button>
                    </div>
                  </>
                ) : (
                  <>
                    <StripeCheckout
                      amount={total()}
                      orderId={pendingOrderId ?? "pending"}
                      onSuccess={handleStripeSuccess}
                    />
                    <Button type="button" variant="secondary" onClick={() => setStep(1)}>Orqaga</Button>
                  </>
                )}
              </div>
            )}
          </form>
        )}
      </div>
      <Footer />
    </>
  );
}
