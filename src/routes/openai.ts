import { Router } from "express";
import { requireProxyKey } from "../middleware/auth";
import { loadProvidersConfig } from "../config/providers";
import { routeChatCompletion } from "../router/engine";

const router = Router();
router.use(requireProxyKey);

router.get("/models", (_req, res) => {
  const cfg = loadProvidersConfig();
  const data = cfg.providers
    .filter((p) => p.enabled)
    .flatMap((p) =>
      p.models.map((m) => ({
        id: m.alias,
        object: "model",
        owned_by: p.id,
        metadata: {
          upstream_model: m.id,
          is_free: m.isFree,
          priority: m.priority
        }
      }))
    );

  res.json({ object: "list", data });
});

router.post("/chat/completions", async (req, res) => {
  try {
    const payload = req.body;
    const routed = await routeChatCompletion(payload);

    res.json({
      ...routed.result,
      proxy: {
        selected_provider: routed.selected.provider,
        selected_model: routed.selected.model,
        selected_alias: routed.selected.alias
      }
    });
  } catch (err: any) {
    res.status(502).json({ error: { message: err?.message || "Routing failed" } });
  }
});

export default router;
