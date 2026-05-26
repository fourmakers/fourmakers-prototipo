import cors from "@fastify/cors";
import Fastify from "fastify";
import { config, ga4Configured, bqConfigured } from "./config.js";
import { registerAnalyticsAppRoutes } from "./routes/analyticsApp.js";

const app = Fastify({ logger: true });

await app.register(cors, {
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);
    if (config.corsOrigins.includes(origin) || config.corsOrigins.includes("*")) {
      return cb(null, true);
    }
    cb(new Error("CORS bloqueado"), false);
  },
  credentials: true,
});

app.get("/health", async () => ({
  status: "ok",
  ga4: ga4Configured(),
  bigQuery: bqConfigured(),
  demoMode: config.demoMode,
}));

await registerAnalyticsAppRoutes(app);

app.listen({ port: config.port, host: "0.0.0.0" }, (err, address) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
  app.log.info(`Analytics API em ${address}`);
});
