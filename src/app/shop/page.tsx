"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, Check, Filter, Search, ShoppingBag, Sparkles, Star } from "lucide-react";
import { products } from "@/data/products";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cart";
import { Footer } from "@/components/layout/footer";

const categories = ["Barchasi", ...Array.from(new Set(products.map((product) => product.category)))];

export default function ShopPage() {
  const [activeCategory, setActiveCategory] = useState("Barchasi");
  const [query, setQuery] = useState("");
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const itemCount = useCartStore((state) => state.items.reduce((sum, item) => sum + item.quantity, 0));
  const visibleProducts = useMemo(() => products.filter((product) => {
    const matchesCategory = activeCategory === "Barchasi" || product.category === activeCategory;
    const matchesQuery = `${product.name} ${product.description}`.toLowerCase().includes(query.toLowerCase());
    return matchesCategory && matchesQuery && (!featuredOnly || product.featured);
  }), [activeCategory, featuredOnly, query]);

  const addToCart = (product: (typeof products)[number]) => {
    addItem({
      productId: product.slug,
      slug: product.slug,
      name: product.name,
      image: product.images[0],
      price: product.salePrice ?? product.price,
      size: product.sizes[0]?.label ?? "One Size",
      color: product.colors[0]?.name ?? "Standard",
    });
  };

  return (
    <>
      <main className="shop-page px-5 pb-32 pt-28 md:px-8">
        <div className="mx-auto max-w-7xl">
          <section className="shop-hero relative overflow-hidden rounded-[2rem] px-6 py-12 md:px-12 md:py-16">
            <div className="shop-hero-grid" aria-hidden />
            <div className="relative z-10 max-w-2xl">
              <p className="mb-5 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.28em] text-[#e1c59d]"><Sparkles className="h-4 w-4" /> RASUL DEV / SHOP 01</p>
              <h1 className="font-display text-5xl font-bold leading-[0.95] tracking-tight md:text-7xl">Kod yozish uchun <span className="text-glow">o&apos;ziga xos</span> buyumlar.</h1>
              <p className="text-slate mt-6 max-w-lg text-base leading-7 md:text-lg">Developerlar uchun tanlangan premium kolleksiya. Har bir detal — ish stolingizga xarakter qo&apos;shish uchun.</p>
              <div className="mt-8 flex flex-wrap items-center gap-4 text-sm text-white/65"><span>4 ta kolleksiya</span><span className="h-1 w-1 rounded-full bg-[#c9a87c]" /><span>O&apos;zbekistonga yetkazib berish</span></div>
            </div>
            <div className="shop-hero-orb" aria-hidden />
            <div className="shop-hero-code" aria-hidden>{"{ }"}</div>
          </section>

          <section className="mt-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              {categories.map((category) => <button key={category} type="button" onClick={() => setActiveCategory(category)} className={`shop-filter ${activeCategory === category ? "shop-filter-active" : ""}`}>{category}</button>)}
              <button type="button" onClick={() => setFeaturedOnly((value) => !value)} className={`shop-filter flex items-center gap-2 ${featuredOnly ? "shop-filter-active" : ""}`}><Star className="h-3.5 w-3.5" /> Tanlanganlar</button>
            </div>
            <label className="shop-search flex items-center gap-3"><Search className="h-4 w-4 text-white/45" /><span className="sr-only">Mahsulot qidirish</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Mahsulot qidirish..." /></label>
          </section>

          <div className="mt-12 flex items-end justify-between"><div><p className="font-mono text-xs uppercase tracking-[0.25em] text-white/40">Kolleksiya</p><h2 className="font-display mt-2 text-3xl font-bold">Tanlangan mahsulotlar</h2></div><Link href="/cart" className="shop-cart-link"><ShoppingBag className="h-4 w-4" /> Savat {itemCount > 0 && <span>{itemCount}</span>}</Link></div>

          <section className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {visibleProducts.map((product, index) => <article key={product.slug} className={`shop-product-card ${index === 0 ? "sm:col-span-2 lg:col-span-2" : ""}`}>
              <Link href={`/shop/${product.slug}`} className="block">
                <div className={`shop-product-image ${index % 3 === 1 ? "shop-product-image-alt" : ""}`}><Image src={product.images[0]} alt={product.name} fill sizes="(max-width: 768px) 100vw, 25vw" className="object-cover transition duration-700 group-hover:scale-105" />{product.badge && <span className="shop-badge">{product.badge}</span>}<span className="shop-product-index">0{index + 1}</span></div>
                <div className="mt-5 flex items-start justify-between gap-3"><div><p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">{product.category}</p><h3 className="font-display mt-2 text-xl font-bold">{product.name}</h3></div><ArrowRight className="mt-1 h-5 w-5 text-white/45 transition-transform group-hover:translate-x-1" /></div>
                <p className="text-slate mt-2 line-clamp-2 text-sm leading-6">{product.description}</p>
                <div className="mt-4 flex items-center justify-between"><div>{product.salePrice ? <><span className="text-glow font-bold">{formatPrice(product.salePrice)}</span><span className="text-slate ml-2 text-xs line-through">{formatPrice(product.price)}</span></> : <span className="text-glow font-bold">{formatPrice(product.price)}</span>}</div><span className="text-xs text-white/45">{product.stock} dona qoldi</span></div>
              </Link>
              <button type="button" onClick={() => addToCart(product)} className="shop-add-button mt-5 w-full">Savatga qo&apos;shish <Check className="h-4 w-4" /></button>
            </article>)}
          </section>
          {visibleProducts.length === 0 && <div className="shop-empty mt-12"><Filter className="mx-auto h-8 w-8 text-[#c9a87c]" /><p className="mt-4 font-display text-xl font-semibold">Mahsulot topilmadi</p><p className="text-slate mt-2 text-sm">Boshqa kategoriya yoki qidiruv so&apos;zini sinab ko&apos;ring.</p></div>}
        </div>
      </main>
      <Footer />
    </>
  );
}
