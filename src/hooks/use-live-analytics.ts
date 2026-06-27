"use client";

import { useEffect, useState } from "react";

interface LiveMetrics {
  revenue?: number;
  visitors?: number;
  orders?: number;
  conversion?: number;
  connected?: boolean;
}

export function useLiveAnalytics() {
  const [metrics, setMetrics] = useState<LiveMetrics>({});
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const es = new EventSource("/api/analytics/stream");
    es.onmessage = (e) => {
      const data = JSON.parse(e.data) as LiveMetrics;
      if (data.connected) {
        setConnected(true);
      } else {
        setMetrics(data);
      }
    };
    es.onerror = () => {
      setConnected(false);
      es.close();
    };
    return () => es.close();
  }, []);

  return { metrics, connected };
}
