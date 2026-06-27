import Link from "next/link";
import Image from "next/image";
import { products } from "@/data/products";
import { formatPrice } from "@/lib/utils";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export const metadata = {
  title: "Shop — RASUL DEV",
  description: "Premium merch and digital products",
};

export default function ShopPage() {
  return (
    <>
      <div className="pt-28 px-6 pb-32">
        <div className="mx-auto max-w-7xl">
          <h1 className="font-display mb-4 text-5xl font-bold">Shop</h1>
          <p className="text-slate mb-12 max-w-xl">Premium mahsulotlar — cheklangan nashrlar.</p>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <Link
                key={product.slug}
                href={`/shop/${product.slug}`}
                className="interactive group"
              >
                <div className="relative overflow-hidden rounded-2xl">
                  {product.badge && (
                    <span className="absolute top-3 left-3 z-10 rounded-full bg-azure px-3 py-1 text-xs font-bold">
                      {product.badge}
                    </span>
                  )}
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    width={400}
                    height={500}
                    className="h-72 w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="glass absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
                <h2 className="mt-4 font-display text-lg font-bold">{product.name}</h2>
                <div className="mt-1 flex items-center gap-2">
                  {product.salePrice ? (
                    <>
                      <span className="text-glow font-bold">{formatPrice(product.salePrice)}</span>
                      <span className="text-slate text-sm line-through">{formatPrice(product.price)}</span>
                    </>
                  ) : (
                    <span className="text-glow font-bold">{formatPrice(product.price)}</span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
