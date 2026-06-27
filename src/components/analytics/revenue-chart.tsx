"use client";

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { month: "Jan", revenue: 4200 },
  { month: "Feb", revenue: 5100 },
  { month: "Mar", revenue: 4800 },
  { month: "Apr", revenue: 6200 },
  { month: "May", revenue: 7100 },
  { month: "Jun", revenue: 8450 },
];

export default function RevenueChart() {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.4} />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="month" stroke="#64748B" fontSize={12} />
        <YAxis stroke="#64748B" fontSize={12} />
        <Tooltip
          contentStyle={{ background: "#0F172A", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8 }}
        />
        <Area type="monotone" dataKey="revenue" stroke="#3B82F6" fill="url(#revenueGrad)" strokeWidth={2} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
