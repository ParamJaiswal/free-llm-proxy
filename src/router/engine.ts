import { ChatCompletionRequest } from "../types";
import { listCandidates } from "./catalog";
import { ProviderClient } from "../providers/providerClient";
import { appConfig } from "../config/env";

export async function routeChatCompletion(request: ChatCompletionRequest) {
  const candidates = listCandidates(request.model);

  if (!candidates.length) {
    throw new Error("No eligible provider/model candidates. Check FREE_ONLY_MODE and provider keys.");
  }

  const errors: Array<{ provider: string; model: string; error: string }> = [];

  for (const c of candidates) {
    const client = new ProviderClient(c.provider, c.model);

    for (let attempt = 0; attempt <= appConfig.maxRetriesPerRequest; attempt++) {
      try {
        const result = await client.chatCompletions(request);
        return {
          result,
          selected: {
            provider: c.provider.id,
            model: c.model.id,
            alias: c.model.alias
          }
        };
      } catch (err: any) {
        const message = err?.response?.data?.error?.message || err?.message || "Unknown error";
        errors.push({ provider: c.provider.id, model: c.model.id, error: message });
      }
    }
  }

  throw new Error(`All providers failed: ${JSON.stringify(errors)}`);
}
