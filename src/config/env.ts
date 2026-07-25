import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const EnvSchema = z.object({
  PORT: z.string().default("8080"),
  NODE_ENV: z.string().default("development"),
  PROXY_API_KEY: z.string().min(1),
  ADMIN_API_KEY: z.string().min(1),
  FREE_ONLY_MODE: z.string().default("true"),
  MAX_REQUEST_USD: z.string().default("0"),
  REQUEST_TIMEOUT_MS: z.string().default("30000"),
  MAX_RETRIES_PER_REQUEST: z.string().default("2")
});

const parsed = EnvSchema.parse(process.env);

export const appConfig = {
  port: Number(parsed.PORT),
  nodeEnv: parsed.NODE_ENV,
  proxyApiKey: parsed.PROXY_API_KEY,
  adminApiKey: parsed.ADMIN_API_KEY,
  freeOnlyMode: parsed.FREE_ONLY_MODE === "true",
  maxRequestUsd: Number(parsed.MAX_REQUEST_USD),
  requestTimeoutMs: Number(parsed.REQUEST_TIMEOUT_MS),
  maxRetriesPerRequest: Number(parsed.MAX_RETRIES_PER_REQUEST)
};
