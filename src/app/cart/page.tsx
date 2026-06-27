"use client";

import { useCartStore } from "@/store/cart";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { Footer } from "@/components/layout/footer";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const total = useCartStore((s) => s.total);

  return (
    <>
      <div className="mx-auto max-w-3xl px-6 pt-28 pb-32">
        <h1 className="font-display mb-8 text-4xl font-bold">Savat</h1>
        {items.length === 0 ? (
          <div className="text-center">
            <p className="text-slate mb-6">Savat bo&apos;sh</p>
            <Button href="/shop">Shopga o&apos;tish</Button>
          </div>
        ) : (
          <>
            <ul className="space-y-4">
              {items.map((item) => (
                <li key={`${item.productId}-${item.size}-${item.color}`} className="glass flex gap-4 rounded-xl p-4">
                  <Image src={item.image} alt={item.name} width={80} height={80} className="h-20 w-20 rounded-lg object-cover" />
                  <div className="flex-1">
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-slate text-xs">{item.size} / {item.color}</p>
                    <p className="text-glow mt-1">{formatPrice(item.price)}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <button onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity - 1)} className="interactive rounded border border-white/10 p-1"><Minus className="h-3 w-3" /></button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity + 1)} className="interactive rounded border border-white/10 p-1"><Plus className="h-3 w-3" /></button>
                      <button onClick={() => removeItem(item.productId, item.size, item.color)} className="interactive ml-auto text-red-400"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex items-center justify-between text-xl font-bold">
              <span>Jami</span>
              <span>{formatPrice(total())}</span>
            </div>
            <Link href="/checkout">
              <Button className="mt-6 w-full" magnetic>Checkout</Button>
            </Link>
          </>
        )}
      </div>
      <Footer />
    </>
  );
}
