import Link from "next/link";
import { products } from "@/data/products";
import { GlassCard } from "@/components/ui/glass-card";
import { formatPrice } from "@/lib/utils";

export default function AdminProductsPage() {
  return (
    <div className="min-h-screen bg-space p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="font-display text-3xl font-bold">Mahsulotlar</h1>
          <Link href="/admin" className="text-slate text-sm hover:text-white">← Dashboard</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate border-b border-white/10">
                <th className="pb-3 text-left">Nomi</th>
                <th className="pb-3 text-left">Kategoriya</th>
                <th className="pb-3 text-left">Narx</th>
                <th className="pb-3 text-left">Stock</th>
                <th className="pb-3 text-left">Badge</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.slug} className="border-b border-white/5">
                  <td className="py-3 font-medium">{p.name}</td>
                  <td className="py-3 text-slate">{p.category}</td>
                  <td className="py-3">{formatPrice(p.salePrice ?? p.price)}</td>
                  <td className="py-3">{p.stock}</td>
                  <td className="py-3">{p.badge ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
