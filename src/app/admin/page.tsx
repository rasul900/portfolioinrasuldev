import Link from "next/link";
import { products } from "@/data/products";
import { GlassCard } from "@/components/ui/glass-card";

const mockOrders = [
  { orderId: "RD-ABC123", customer: "Aziz K.", total: 450000, status: "pending" },
  { orderId: "RD-DEF456", customer: "Dilnoza M.", total: 180000, status: "processing" },
  { orderId: "RD-GHI789", customer: "Jasur T.", total: 320000, status: "shipped" },
];

const stats = [
  { label: "Bugungi savdo", value: "2,450,000 UZS" },
  { label: "Buyurtmalar", value: "12" },
  { label: "Yangi foydalanuvchilar", value: "8" },
  { label: "Kam qolgan", value: "3" },
];

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-space p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="font-display text-3xl font-bold">Admin Dashboard</h1>
          <nav className="flex gap-4 text-sm">
            <Link href="/admin" className="text-glow">Dashboard</Link>
            <Link href="/admin/products" className="text-slate hover:text-white">Mahsulotlar</Link>
            <Link href="/admin/orders" className="text-slate hover:text-white">Buyurtmalar</Link>
            <Link href="/admin/analytics" className="text-slate hover:text-white">Analytics</Link>
          </nav>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <GlassCard key={s.label}>
              <div className="text-slate text-sm">{s.label}</div>
              <div className="font-display mt-1 text-2xl font-bold">{s.value}</div>
            </GlassCard>
          ))}
        </div>

        <GlassCard className="mb-8">
          <h2 className="mb-4 font-medium">So&apos;nggi buyurtmalar</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate border-b border-white/10">
                <th className="pb-3 text-left">ID</th>
                <th className="pb-3 text-left">Mijoz</th>
                <th className="pb-3 text-left">Summa</th>
                <th className="pb-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {mockOrders.map((o) => (
                <tr key={o.orderId} className="border-b border-white/5">
                  <td className="py-3 font-mono text-xs">{o.orderId}</td>
                  <td className="py-3">{o.customer}</td>
                  <td className="py-3">{o.total.toLocaleString()} UZS</td>
                  <td className="py-3">
                    <span className="rounded-full bg-azure/20 px-2 py-1 text-xs capitalize">{o.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </GlassCard>

        <GlassCard>
          <h2 className="mb-4 font-medium">Kam qolgan mahsulotlar</h2>
          <ul className="space-y-2">
            {products.filter((p) => p.stock < 20).map((p) => (
              <li key={p.slug} className="flex justify-between text-sm">
                <span>{p.name}</span>
                <span className="text-red-400">{p.stock} ta</span>
              </li>
            ))}
          </ul>
        </GlassCard>
      </div>
    </div>
  );
}
