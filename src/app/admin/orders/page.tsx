import Link from "next/link";
import { AdminOrdersKanban } from "@/components/admin/orders-kanban";

export default function AdminOrdersPage() {
  return (
    <div className="min-h-screen bg-space p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="font-display text-3xl font-bold">Buyurtmalar — Kanban</h1>
          <Link href="/admin" className="text-slate text-sm hover:text-white">← Dashboard</Link>
        </div>
        <AdminOrdersKanban />
      </div>
    </div>
  );
}
