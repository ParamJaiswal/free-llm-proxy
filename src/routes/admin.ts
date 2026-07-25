import { Router } from "express";
import { requireAdminKey } from "../middleware/auth";
import { loadProvidersConfig } from "../config/providers";

const router = Router();
router.use(requireAdminKey);

router.get("/providers", (_req, res) => {
  const cfg = loadProvidersConfig();
  res.json(cfg);
});

router.post("/evals/run", (_req, res) => {
  res.json({
    status: "ok",
    note: "Run your benchmark prompts externally and store results here in a future extension.",
    timestamp: new Date().toISOString()
  });
});

router.get("/evals/recommendations", (_req, res) => {
  const cfg = loadProvidersConfig();
  const recommendations = cfg.providers
    .flatMap((p) => p.models.map((m) => ({ provider: p.id, alias: m.alias, priority: m.priority, isFree: m.isFree })))
    .sort((a, b) => a.priority - b.priority)
    .slice(0, 10);

  res.json({
    mode: "human-approved-safe",
    recommendations,
    message: "Review and manually adjust config/providers.json before applying changes."
  });
});

export default router;
