/**
 * Anthropic (Claude) LLM Provider
 */

import { registerLLMProvider } from "./index";
import {
  generateCompletion as anthropicGenerateCompletion,
  generateCompletionWithTools,
} from "@/lib/anthropic";

const anthropicProvider = {
  id: "anthropic",
  name: "Anthropic Claude",
  description: "Claude 3 Opus and other Anthropic models",
  generateCompletion: async (
    messages: any[],
    systemPrompt: string,
    options: any = {},
  ) => {
    // Anthropic expects messages without the system role
    return await anthropicGenerateCompletion(messages, systemPrompt, options);
  },
  generateCompletionWithTools: async (
    messages: any[],
    systemPrompt: string,
    tools: any[],
    options: any = {},
  ) => {
    return await generateCompletionWithTools(
      messages,
      systemPrompt,
      tools,
      options,
    );
  },
  isAvailable: () => !!process.env.ANTHROPIC_API_KEY,
};

// Register the Anthropic provider
registerLLMProvider(anthropicProvider);

export default anthropicProvider;
