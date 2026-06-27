"use client";

import { useState } from "react";
import Image from "next/image";
import { useCartStore } from "@/store/cart";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { Footer } from "@/components/layout/footer";
import { toast } from "sonner";
import { Star } from "lucide-react";
import type { Product } from "@/types";

export function ProductDetail({ product }: { product: Product }) {
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]?.label ?? "One Size");
  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name ?? "Default");
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const addItem = useCartStore((s) => s.addItem);

  const price = product.salePrice ?? product.price;
  const sizeStock = product.sizes.find((s) => s.label === selectedSize)?.stock ?? 0;

  const handleAdd = () => {
    addItem({
      productId: product.slug,
      slug: product.slug,
      name: product.name,
      image: product.images[0],
      price,
      size: selectedSize,
      color: selectedColor,
      quantity,
    });
    toast.success("Savatga qo'shildi!");
  };

  const avgRating =
    product.reviews.length > 0
      ? product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length
      : 0;

  return (
    <>
      <div className="mx-auto max-w-7xl px-6 pt-28 pb-32">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <div className="overflow-hidden rounded-2xl">
              <Image
                src={product.images[activeImage]}
                alt={product.name}
                width={600}
                height={700}
                className="h-[500px] w-full object-cover"
              />
            </div>
            {product.images.length > 1 && (
              <div className="mt-4 flex gap-3">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`interactive overflow-hidden rounded-lg border-2 ${activeImage === i ? "border-azure" : "border-transparent"}`}
                  >
                    <Image src={img} alt="" width={80} height={80} className="h-20 w-20 object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            {product.badge && (
              <span className="mb-2 inline-block rounded-full bg-azure px-3 py-1 text-xs font-bold">
                {product.badge}
              </span>
            )}
            <h1 className="font-display text-4xl font-bold">{product.name}</h1>
            <div className="mt-2 flex items-center gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${i < Math.round(avgRating) ? "fill-yellow-400 text-yellow-400" : "text-slate"}`}
                />
              ))}
              <span className="text-slate text-sm">({product.reviews.length} sharh)</span>
            </div>
            <p className="text-slate mt-4">{product.description}</p>
            <div className="mt-6 text-3xl font-bold text-glow">{formatPrice(price)}</div>

            <div className="mt-8">
              <label className="mb-2 block text-sm">O&apos;lcham</label>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s.label}
                    onClick={() => setSelectedSize(s.label)}
                    disabled={s.stock === 0}
                    className={`interactive rounded-lg border px-4 py-2 text-sm ${
                      selectedSize === s.label ? "border-azure bg-azure/20" : "border-white/10"
                    } ${s.stock === 0 ? "line-through opacity-40" : ""}`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <label className="mb-2 block text-sm">Rang</label>
              <div className="flex gap-3">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColor(c.name)}
                    className={`interactive h-8 w-8 rounded-full border-2 ${
                      selectedColor === c.name ? "border-white" : "border-transparent"
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  />
                ))}
              </div>
            </div>

            <div className="mt-6 flex items-center gap-4">
              <label className="text-sm">Miqdor</label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="interactive rounded border border-white/10 px-3 py-1"
                >
                  -
                </button>
                <span>{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(sizeStock, quantity + 1))}
                  className="interactive rounded border border-white/10 px-3 py-1"
                >
                  +
                </button>
              </div>
              <span className="text-slate text-sm">{sizeStock} ta qoldi</span>
            </div>

            <Button magnetic className="mt-8 w-full max-w-sm" onClick={handleAdd}>
              Savatga qo&apos;shish
            </Button>
          </div>
        </div>

        {product.reviews.length > 0 && (
          <div className="mt-16">
            <h2 className="font-display mb-6 text-2xl font-bold">Sharhlar</h2>
            <div className="space-y-4">
              {product.reviews.map((r) => (
                <div key={r.id} className="glass rounded-xl p-4">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{r.author}</span>
                    <span className="text-slate text-xs">{r.date}</span>
                  </div>
                  <p className="text-slate mt-2 text-sm">{r.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
