/**
 * OpenAI DALL-E Image Generation Provider
 */

import { registerMediaProvider } from "../index";
import { openAiImageGenTool } from "@/tools/image-gen";

const openaiImageProvider = {
  id: "openai-image",
  name: "DALL-E",
  description: "OpenAI's DALL-E image generation",
  type: "image" as const,
  generate: async (prompt: string, options: any = {}) => {
    const result = await openAiImageGenTool.run({
      prompt,
      size: options.size || "1024x1024",
      quality: options.quality || "standard",
      style: options.style || "vivid",
    });

    return {
      type: "image",
      url: result.data.url,
      prompt: prompt,
      revisedPrompt: result.data.prompt,
      metadata: {
        service: "openai",
        model: "dall-e-3",
        ...options,
      },
    };
  },
  isAvailable: () => !!process.env.OPENAI_API_KEY,
};

// Register the OpenAI image provider
registerMediaProvider(openaiImageProvider);

export default openaiImageProvider;
