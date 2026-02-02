import { mkdir } from "fs/promises";
import { join } from "path";

await mkdir("uploads", { recursive: true });

const server = Bun.serve({
  port: 3000,

  async fetch(req) {
    if (!req.body) {
      return new Response("No body", { status: 400 });
    }

    const filePath = join("uploads", `upload-${Date.now()}.bin`);
    const file = Bun.file(filePath);

    const reader = req.body.getReader();
    const writer = file.writer();

    let bytes = 0;

    const responseStream = new ReadableStream({
      async start(controller) {
        try {
          while (true) {
            const { value, done } = await reader.read();
            if (done) break;

            bytes += value.byteLength;
            await writer.write(value);
            controller.enqueue(`Received ${Math.round(bytes / 1024)} KB\n`);
          }

          controller.enqueue("Upload complete\n");
        } catch (err) {
          controller.enqueue("Upload failed\n");
        } finally {
          await writer.end();
          controller.close();
        }
      },
    });

    return new Response(responseStream, {
      headers: {
        "Content-Type": "text/plain",
        "Transfer-Encoding": "chunked",
      },
    });
  },
});

console.log(`Server running on http://localhost:${server.port}`);
