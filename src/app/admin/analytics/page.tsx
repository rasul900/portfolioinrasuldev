"use client";

import dynamic from "next/dynamic";
import Link from "next/link";

const RevenueChart = dynamic(() => import("@/components/analytics/revenue-chart"), { ssr: false });
const VisitorsChart = dynamic(() => import("@/components/analytics/visitors-chart"), { ssr: false });

export default function AdminAnalyticsPage() {
  return (
    <div className="min-h-screen bg-space p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="font-display text-3xl font-bold">Analytics</h1>
          <Link href="/admin" className="text-slate text-sm hover:text-white">← Dashboard</Link>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="glass rounded-2xl p-6">
            <h3 className="mb-4">Revenue</h3>
            <RevenueChart />
          </div>
          <div className="glass rounded-2xl p-6">
            <h3 className="mb-4">Visitors</h3>
            <VisitorsChart />
          </div>
        </div>
      </div>
    </div>
  );
}
