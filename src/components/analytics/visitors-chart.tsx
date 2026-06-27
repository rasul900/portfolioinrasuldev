"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

const data = [
  { day: "Mon", sessions: 420, pageviews: 890 },
  { day: "Tue", sessions: 510, pageviews: 1020 },
  { day: "Wed", sessions: 480, pageviews: 950 },
  { day: "Thu", sessions: 620, pageviews: 1280 },
  { day: "Fri", sessions: 710, pageviews: 1450 },
  { day: "Sat", sessions: 890, pageviews: 1820 },
  { day: "Sun", sessions: 760, pageviews: 1540 },
];

export default function VisitorsChart() {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={data}>
        <XAxis dataKey="day" stroke="#64748B" fontSize={12} />
        <YAxis stroke="#64748B" fontSize={12} />
        <Tooltip
          contentStyle={{ background: "#0F172A", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8 }}
        />
        <Legend />
        <Line type="monotone" dataKey="sessions" stroke="#2563EB" strokeWidth={2} dot={false} />
        <Line type="monotone" dataKey="pageviews" stroke="#64748B" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}
