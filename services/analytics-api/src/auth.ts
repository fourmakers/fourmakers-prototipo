import type { FastifyRequest } from "fastify";
import { config } from "./config.js";

export function checkBearerAuth(request: FastifyRequest): boolean {
  const expected = config.analyticsApiToken;
  if (!expected) return true;

  const header = request.headers.authorization;
  if (!header?.startsWith("Bearer ")) return false;
  return header.slice(7) === expected;
}
