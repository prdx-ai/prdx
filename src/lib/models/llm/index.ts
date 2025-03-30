/**
 * LLM Provider Registry
 * Central registry for all language model providers
 */

export interface LLMProvider {
  id: string;
  name: string;
  description: string;
  generateCompletion: (
    messages: any[],
    systemPrompt: string,
    options?: any,
  ) => Promise<any>;
  generateCompletionWithTools?: (
    messages: any[],
    systemPrompt: string,
    tools: any[],
    options?: any,
  ) => Promise<any>;
  isAvailable: () => boolean;
}

// Registry to store all available LLM providers
const llmRegistry = new Map<string, LLMProvider>();

/**
 * Register a new LLM provider
 */
export function registerLLMProvider(provider: LLMProvider) {
  llmRegistry.set(provider.id, provider);
}

/**
 * Get an LLM provider by ID
 */
export function getLLMProvider(id: string): LLMProvider | undefined {
  return llmRegistry.get(id);
}

/**
 * Get all registered LLM providers
 */
export function getAllLLMProviders(): LLMProvider[] {
  return Array.from(llmRegistry.values());
}

/**
 * Get all available LLM providers (those with API keys configured)
 */
export function getAvailableLLMProviders(): LLMProvider[] {
  return getAllLLMProviders().filter((provider) => provider.isAvailable());
}

/**
 * Default LLM provider ID to use if none specified
 */
export function getDefaultLLMProvider(): string {
  const available = getAvailableLLMProviders();
  if (available.length === 0) return "";

  // Prefer OpenAI if available
  const openai = available.find((p) => p.id === "openai");
  if (openai) return openai.id;

  // Otherwise return the first available provider
  return available[0].id;
}
