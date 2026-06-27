"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { AnimatedSection } from "@/components/ui/animated-section";
import { SectionHeader } from "@/components/ui/section-header";
import { StaggerGrid, StaggerItem } from "@/components/ui/reveal";
import { useLiveAnalytics } from "@/hooks/use-live-analytics";
import { SPRING } from "@/lib/constants";
import { Activity, TrendingUp, TrendingDown } from "lucide-react";

const RevenueChart = dynamic(() => import("@/components/analytics/revenue-chart"), { ssr: false });
const VisitorsChart = dynamic(() => import("@/components/analytics/visitors-chart"), { ssr: false });

export function AnalyticsSection() {
  const { metrics, connected } = useLiveAnalytics();

  const kpis = [
    { label: "Revenue", value: metrics.revenue ? `$${metrics.revenue.toLocaleString()}` : "$12,450", delta: "+18%", positive: true },
    { label: "Visitors", value: metrics.visitors?.toLocaleString() ?? "8,234", delta: "+24%", positive: true },
    { label: "Orders", value: metrics.orders?.toString() ?? "156", delta: "+12%", positive: true },
    { label: "Conversion", value: metrics.conversion ? `${metrics.conversion}%` : "3.2%", delta: "-0.4%", positive: false },
  ];

  return (
    <AnimatedSection id="analytics" background="analytics">
      <SectionHeader
        index="05"
        label="Analytics"
        title="Live Dashboard"
        description="Real-time metrics — SSE stream orqali jonli yangilanadi."
      />

      <div className="mb-8 flex items-center gap-3">
        <span className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs ${connected ? "border-green-500/30 bg-green-500/10 text-green-400" : "border-white/10 text-slate"}`}>
          <Activity className={`h-3.5 w-3.5 ${connected ? "pulse-dot" : ""}`} />
          {connected ? "Live" : "Connecting..."}
        </span>
      </div>

      <StaggerGrid className="mb-10 grid grid-cols-2 gap-4 md:grid-cols-4">
        {kpis.map((kpi) => (
          <StaggerItem key={kpi.label}>
            <div className="premium-card rounded-2xl p-6">
              <div className="text-slate text-xs tracking-wider uppercase">{kpi.label}</div>
              <div className="font-display mt-2 text-2xl font-bold md:text-3xl">{kpi.value}</div>
              <div className={`mt-2 flex items-center gap-1 text-xs ${kpi.positive ? "text-green-400" : "text-red-400"}`}>
                {kpi.positive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {kpi.delta}
              </div>
            </div>
          </StaggerItem>
        ))}
      </StaggerGrid>

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={SPRING}
          className="premium-card rounded-3xl p-6 md:p-8"
        >
          <h3 className="mb-6 font-display text-lg font-bold">Revenue</h3>
          <RevenueChart />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ ...SPRING, delay: 0.1 }}
          className="premium-card rounded-3xl p-6 md:p-8"
        >
          <h3 className="mb-6 font-display text-lg font-bold">Visitors</h3>
          <VisitorsChart />
        </motion.div>
      </div>
    </AnimatedSection>
  );
}
