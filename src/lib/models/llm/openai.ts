/**
 * OpenAI LLM Provider
 */

import { registerLLMProvider } from "./index";
import {
  generateCompletion as openaiGenerateCompletion,
  generateCompletionWithTools,
} from "@/lib/openai";

const openaiProvider = {
  id: "openai",
  name: "OpenAI",
  description: "GPT-4o and other OpenAI models",
  generateCompletion: async (
    messages: any[],
    systemPrompt: string,
    options: any = {},
  ) => {
    const formattedMessages = [
      { role: "system", content: systemPrompt },
      ...messages,
    ];
    return await openaiGenerateCompletion(formattedMessages, options);
  },
  generateCompletionWithTools: async (
    messages: any[],
    systemPrompt: string,
    tools: any[],
    options: any = {},
  ) => {
    const formattedMessages = [
      { role: "system", content: systemPrompt },
      ...messages,
    ];
    return await generateCompletionWithTools(formattedMessages, tools, options);
  },
  isAvailable: () => !!process.env.OPENAI_API_KEY,
};

// Register the OpenAI provider
registerLLMProvider(openaiProvider);

export default openaiProvider;
