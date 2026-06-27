"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { X, Minus, Plus, Trash2 } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { SPRING } from "@/lib/constants";

export function CartDrawer() {
  const isOpen = useCartStore((s) => s.isOpen);
  const toggleCart = useCartStore((s) => s.toggleCart);
  const items = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const total = useCartStore((s) => s.total);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] bg-black/60"
            onClick={toggleCart}
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={SPRING}
            className="glass fixed top-0 right-0 z-[90] flex h-full w-full max-w-md flex-col border-l border-white/10"
          >
            <div className="flex items-center justify-between border-b border-white/10 p-6">
              <h2 className="font-display text-xl font-bold">Savat</h2>
              <button onClick={toggleCart} className="interactive rounded-lg p-2 hover:bg-white/5">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <p className="text-slate text-center py-12">Savat bo&apos;sh</p>
              ) : (
                <ul className="space-y-4">
                  {items.map((item) => (
                    <li key={`${item.productId}-${item.size}-${item.color}`} className="flex gap-4">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={80}
                        height={80}
                        className="h-20 w-20 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-slate text-xs">
                          {item.size} / {item.color}
                        </p>
                        <p className="text-glow mt-1 text-sm">{formatPrice(item.price)}</p>
                        <div className="mt-2 flex items-center gap-2">
                          <button
                            onClick={() =>
                              updateQuantity(item.productId, item.size, item.color, item.quantity - 1)
                            }
                            className="interactive rounded border border-white/10 p-1"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-6 text-center text-sm">{item.quantity}</span>
                          <button
                            onClick={() =>
                              updateQuantity(item.productId, item.size, item.color, item.quantity + 1)
                            }
                            className="interactive rounded border border-white/10 p-1"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                          <button
                            onClick={() => removeItem(item.productId, item.size, item.color)}
                            className="interactive ml-auto text-red-400"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-white/10 p-6">
                <div className="mb-4 flex justify-between text-lg font-bold">
                  <span>Jami</span>
                  <span>{formatPrice(total())}</span>
                </div>
                <Link href="/checkout" onClick={toggleCart}>
                  <Button className="w-full" magnetic>
                    Buyurtma berish
                  </Button>
                </Link>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
