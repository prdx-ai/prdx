/**
 * Google Gemini LLM Provider
 */

import { registerLLMProvider } from "./index";
import { generateCompletion as geminiGenerateCompletion } from "@/lib/gemini";

const geminiProvider = {
  id: "gemini",
  name: "Google Gemini",
  description: "Google's Gemini Pro and other models",
  generateCompletion: async (
    messages: any[],
    systemPrompt: string,
    options: any = {},
  ) => {
    return await geminiGenerateCompletion(messages, systemPrompt, options);
  },
  isAvailable: () => !!process.env.GEMINI_API_KEY,
};

// Register the Gemini provider
registerLLMProvider(geminiProvider);

export default geminiProvider;
