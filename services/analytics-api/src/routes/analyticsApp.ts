import type { FastifyInstance, FastifyRequest } from "fastify";
import { checkBearerAuth } from "../auth.js";
import { fail, ok } from "../envelope.js";
import { buildAnalyticsAppResponse } from "../providers/index.js";
import type { AnalyticsAppSource, AnalyticsEnvironment, AppQueryParams, DevicePlatform } from "../types.js";

function parseQuery(request: FastifyRequest): AppQueryParams | { error: string } {
  const q = request.query as Record<string, string | undefined>;
  const from = q.from?.trim();
  const to = q.to?.trim();
  const source = q.source?.trim() as AnalyticsAppSource | undefined;
  const environment = q.environment?.trim() as AnalyticsEnvironment | undefined;

  if (!from || !to) return { error: "Parâmetros from e to são obrigatórios (YYYY-MM-DD)." };
  if (!source || (source !== "firebase" && source !== "contentsquare")) {
    return { error: "Parâmetro source deve ser firebase ou contentsquare." };
  }
  if (!environment || !["dev", "hml", "prod"].includes(environment)) {
    return { error: "Parâmetro environment deve ser dev, hml ou prod." };
  }

  const device = (q.device_platform?.trim() ?? "all") as DevicePlatform;

  return {
    from,
    to,
    platform: "app",
    environment,
    source,
    device_platform: device,
    feature: q.feature?.trim(),
    organization_id: q.organization_id?.trim(),
    user_role: q.user_role?.trim(),
    app_version: q.app_version?.trim(),
    client_id: q.client_id?.trim(),
  };
}

export async function registerAnalyticsAppRoutes(app: FastifyInstance): Promise<void> {
  const handler = async (request: FastifyRequest) => {
    if (!checkBearerAuth(request)) {
      return fail("Não autorizado.", "Bearer token inválido ou ausente.");
    }

    const parsed = parseQuery(request);
    if ("error" in parsed) {
      return fail(parsed.error);
    }

    try {
      const retorno = await buildAnalyticsAppResponse(parsed);
      return ok(retorno);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return fail(message, [message]);
    }
  };

  app.get("/analytics/app", handler);
  app.get("/api/analytics/app/:source/dashboard", async (request, reply) => {
    const source = (request.params as { source: string }).source;
    if (source !== "firebase" && source !== "contentsquare") {
      return reply.status(404).send(fail("Source inválido."));
    }
    const q = request.query as Record<string, string>;
    request.query = { ...q, source } as never;
    return handler(request);
  });
}
