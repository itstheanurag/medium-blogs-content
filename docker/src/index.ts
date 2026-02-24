import { Hono } from "hono";

const app = new Hono();

// Root route
app.get("/", (c) => {
  return c.json({ message: "Hello from Hono!" });
});

// Health check endpoint
app.get("/health", (c) => {
  return c.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Start the server on port 3000
const server = Bun.serve({
  fetch: app.fetch,
  port: 3000,
});

console.log(`Server running at ${server.url}`);
