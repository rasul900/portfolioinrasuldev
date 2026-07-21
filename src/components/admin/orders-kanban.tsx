"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";

type OrderStatus = "pending" | "processing" | "packed" | "shipped" | "delivered" | "cancelled";

interface Order {
  orderId: string;
  customer: string;
  total: number;
  status: OrderStatus;
}

const initialOrders: Order[] = [
  { orderId: "RD-ABC123", customer: "Aziz K.", total: 450000, status: "pending" },
  { orderId: "RD-DEF456", customer: "Dilnoza M.", total: 180000, status: "processing" },
  { orderId: "RD-GHI789", customer: "Jasur T.", total: 320000, status: "packed" },
  { orderId: "RD-JKL012", customer: "Nodira S.", total: 65000, status: "shipped" },
  { orderId: "RD-MNO345", customer: "Sardor A.", total: 520000, status: "delivered" },
];

const columns: { id: OrderStatus; label: string }[] = [
  { id: "pending", label: "Pending" },
  { id: "processing", label: "Processing" },
  { id: "packed", label: "Packed" },
  { id: "shipped", label: "Shipped" },
  { id: "delivered", label: "Delivered" },
];

export function AdminOrdersKanban() {
  const [orders, setOrders] = useState(initialOrders);
  const [dragId, setDragId] = useState<string | null>(null);

  const onDrop = async (status: OrderStatus) => {
    if (!dragId) return;
    setOrders((prev) => prev.map((o) => (o.orderId === dragId ? { ...o, status } : o)));
    try {
      await fetch(`/api/orders/${dragId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      toast.success("Status yangilandi");
    } catch {
      toast.error("API xatosi — lokal yangilandi");
    }
    setDragId(null);
  };

  const exportXlsx = () => {
    const ws = XLSX.utils.json_to_sheet(orders);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Orders");
    XLSX.writeFile(wb, "rasul-dev-orders.xlsx");
    toast.success("Excel yuklab olindi");
  };

  const exportInvoice = (order: Order) => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("RASUL DEV — Invoice", 20, 20);
    doc.setFontSize(12);
    doc.text(`Order: ${order.orderId}`, 20, 40);
    doc.text(`Customer: ${order.customer}`, 20, 50);
    doc.text(`Total: ${order.total.toLocaleString()} UZS`, 20, 60);
    doc.text(`Status: ${order.status}`, 20, 70);
    doc.save(`${order.orderId}-invoice.pdf`);
  };

  return (
    <div>
      <div className="pt-10 mb-6 flex gap-4">
        <Button variant="secondary" onClick={exportXlsx}>
          <Download className="h-4 w-4" /> Excel export
        </Button>
        <Button variant="secondary" onClick={() => fetch("/api/seed", { method: "POST" }).then(() => toast.success("DB seeded"))}>
          Seed Database
        </Button>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {columns.map((col) => (
          <div
            key={col.id}
            className="min-w-[220px] flex-1"
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => onDrop(col.id)}
          >
            <h3 className="text-slate mb-3 text-sm font-medium capitalize">{col.label}</h3>
            <div className="space-y-3">
              {orders.filter((o) => o.status === col.id).map((order) => (
                <GlassCard
                  key={order.orderId}
                  draggable
                  onDragStart={() => setDragId(order.orderId)}
                  className="cursor-grab active:cursor-grabbing"
                >
                  <div className="font-mono text-xs text-glow">{order.orderId}</div>
                  <div className="mt-1 font-medium">{order.customer}</div>
                  <div className="text-slate text-sm">{order.total.toLocaleString()} UZS</div>
                  <button
                    onClick={() => exportInvoice(order)}
                    className="interactive mt-2 flex items-center gap-1 text-xs text-azure"
                  >
                    <FileText className="h-3 w-3" /> Invoice PDF
                  </button>
                </GlassCard>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
