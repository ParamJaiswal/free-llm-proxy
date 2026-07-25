import { appConfig } from "../config/env";
import { loadProvidersConfig } from "../config/providers";
import { ProviderConfig, ProviderModel } from "../types";

export type Candidate = {
  provider: ProviderConfig;
  model: ProviderModel;
};

export function listCandidates(requestedModel: string): Candidate[] {
  const cfg = loadProvidersConfig();

  const all: Candidate[] = [];

  for (const provider of cfg.providers.filter((p) => p.enabled)) {
    for (const model of provider.models) {
      if (appConfig.freeOnlyMode && !model.isFree) continue;

      const requestedAny = requestedModel === "router:auto" || requestedModel === "auto";
      const matches =
        requestedAny ||
        model.alias === requestedModel ||
        model.id === requestedModel ||
        `${provider.id}/${model.id}` === requestedModel;

      if (matches) {
        all.push({ provider, model });
      }
    }
  }

  return all.sort((a, b) => a.model.priority - b.model.priority);
}
