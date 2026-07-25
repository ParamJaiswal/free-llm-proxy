import axios from "axios";
import { appConfig } from "../config/env";
import { ProviderConfig, ProviderModel, ChatCompletionRequest } from "../types";

export class ProviderClient {
  constructor(private provider: ProviderConfig, private model: ProviderModel) {}

  async chatCompletions(request: ChatCompletionRequest) {
    const key = process.env[this.provider.apiKeyEnv];
    if (!key) {
      throw new Error(`Missing API key env: ${this.provider.apiKeyEnv}`);
    }

    const payload = {
      ...request,
      model: this.model.id,
      max_tokens: Math.min(request.max_tokens ?? 1024, this.model.maxTokens)
    };

    const response = await axios.post(`${this.provider.baseUrl}/chat/completions`, payload, {
      timeout: appConfig.requestTimeoutMs,
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json"
      }
    });

    return response.data;
  }
}
