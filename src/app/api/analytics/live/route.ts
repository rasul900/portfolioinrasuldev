import { cacheGet, cacheSet } from "@/lib/redis";

function generateMetrics() {
  return {
    revenue: Math.floor(10000 + Math.random() * 5000),
    visitors: Math.floor(500 + Math.random() * 200),
    orders: Math.floor(10 + Math.random() * 20),
    conversion: +(2.5 + Math.random() * 2).toFixed(1),
    timestamp: Date.now(),
  };
}

export async function GET() {
  const cached = await cacheGet<ReturnType<typeof generateMetrics>>("analytics:live");
  const data = cached ?? generateMetrics();
  if (!cached) await cacheSet("analytics:live", data, 5);
  return Response.json(data);
}
