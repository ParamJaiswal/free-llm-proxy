export type ChatMessage = {
  role: "system" | "user" | "assistant" | "tool";
  content: string;
};

export type ChatCompletionRequest = {
  model: string;
  messages: ChatMessage[];
  temperature?: number;
  max_tokens?: number;
};

export type ProviderModel = {
  id: string;
  alias: string;
  isFree: boolean;
  priority: number;
  maxTokens: number;
};

export type ProviderConfig = {
  id: string;
  name: string;
  baseUrl: string;
  apiKeyEnv: string;
  enabled: boolean;
  models: ProviderModel[];
};

export type ProvidersFile = {
  providers: ProviderConfig[];
};
