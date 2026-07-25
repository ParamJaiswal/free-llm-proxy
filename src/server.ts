import express from "express";
import cors from "cors";
import helmet from "helmet";
import { appConfig } from "./config/env";
import openaiRoutes from "./routes/openai";
import adminRoutes from "./routes/admin";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.get("/health", (_req, res) => {
  res.json({ status: "ok", env: appConfig.nodeEnv, freeOnlyMode: appConfig.freeOnlyMode });
});

app.use("/v1", openaiRoutes);
app.use("/admin", adminRoutes);

app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  res.status(500).json({ error: { message: err?.message || "Internal server error" } });
});

app.listen(appConfig.port, () => {
  // eslint-disable-next-line no-console
  console.log(`free-llm-proxy running on http://localhost:${appConfig.port}`);
});
