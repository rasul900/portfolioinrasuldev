"use client";

import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  : null;

function PaymentForm({
  onSuccess,
  amount,
}: {
  onSuccess: (paymentIntentId: string) => void;
  amount: number;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    if (!stripe || !elements) return;
    setLoading(true);
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });
    setLoading(false);
    if (error) {
      toast.error(error.message ?? "To'lov xatosi");
    } else if (paymentIntent?.status === "succeeded") {
      onSuccess(paymentIntent.id);
      toast.success("To'lov muvaffaqiyatli!");
    }
  };

  return (
    <div className="space-y-4">
      <PaymentElement />
      <Button onClick={handlePay} disabled={!stripe || loading} className="w-full">
        {loading ? "To'lanmoqda..." : `To'lash — $${(amount / 100).toFixed(2)}`}
      </Button>
    </div>
  );
}

export function StripeCheckout({
  amount,
  orderId,
  onSuccess,
}: {
  amount: number;
  orderId: string;
  onSuccess: (paymentIntentId: string) => void;
}) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  useEffect(() => {
    if (!stripePromise) return;
    fetch("/api/stripe/create-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: Math.max(50, Math.round(amount / 1000)), // UZS to cents approx for USD demo
        currency: "usd",
        metadata: { orderId },
      }),
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.clientSecret) setClientSecret(d.clientSecret);
      })
      .catch(() => {});
  }, [amount, orderId]);

  if (!stripePromise || !clientSecret) {
    return (
      <p className="text-slate text-sm">
        Stripe sozlanmagan. Bank o&apos;tkazmasidan foydalaning.
      </p>
    );
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: "night" } }}>
      <PaymentForm onSuccess={onSuccess} amount={amount} />
    </Elements>
  );
}
