export async function GET() {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: object) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };

      const interval = setInterval(() => {
        send({
          revenue: Math.floor(10000 + Math.random() * 5000),
          visitors: Math.floor(500 + Math.random() * 200),
          orders: Math.floor(10 + Math.random() * 20),
          conversion: +(2.5 + Math.random() * 2).toFixed(1),
          timestamp: Date.now(),
        });
      }, 3000);

      send({ connected: true, timestamp: Date.now() });

      // Cleanup after 5 min
      setTimeout(() => {
        clearInterval(interval);
        controller.close();
      }, 300000);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
