import { Tool, ToolInput, ToolOutput, registerTool } from "@/lib/tools";

/**
 * Generic image generation tool that selects the appropriate service
 */
export const imageGenTool: Tool = {
  name: "image-gen",
  description:
    "Generate images from text descriptions using the best available service",
  category: "image-generation",
  inputs: [
    {
      name: "prompt",
      type: "string",
      description: "Text description of the image to generate",
      required: true,
    },
    {
      name: "service",
      type: "string",
      description: "Service to use (openai, stability, midjourney)",
      required: false,
    },
    {
      name: "style",
      type: "string",
      description: "Style of the image (vivid, natural, etc.)",
      required: false,
    },
    {
      name: "size",
      type: "string",
      description: "Size of the image (1024x1024, etc.)",
      required: false,
    },
  ],
  run: async (inputs: Record<string, any>): Promise<ToolOutput> => {
    try {
      const { prompt, service = "openai", style, size } = inputs;

      // Select the appropriate service
      switch (service.toLowerCase()) {
        case "openai":
        case "dalle":
          return await openAiImageGenTool.run(inputs);
        case "stability":
          return await stabilityAiImageGenTool.run(inputs);
        case "midjourney":
          return await midjourneyImageGenTool.run(inputs);
        default:
          // Default to OpenAI if service is not recognized
          return await openAiImageGenTool.run(inputs);
      }
    } catch (error) {
      console.error("Error generating image:", error);
      throw error;
    }
  },
};

/**
 * Text-to-Image generation tool using OpenAI DALL-E
 */
export const openAiImageGenTool: Tool = {
  name: "openai-image-gen",
  description: "Generate images from text descriptions using OpenAI DALL-E",
  category: "image-generation",
  inputs: [
    {
      name: "prompt",
      type: "string",
      description: "Text description of the image to generate",
      required: true,
    },
    {
      name: "size",
      type: "string",
      description: "Size of the image (1024x1024, 1024x1792, 1792x1024)",
      required: false,
    },
    {
      name: "quality",
      type: "string",
      description: "Quality of the image (standard, hd)",
      required: false,
    },
    {
      name: "style",
      type: "string",
      description: "Style of the image (vivid, natural)",
      required: false,
    },
  ],
  run: async (inputs: Record<string, any>): Promise<ToolOutput> => {
    try {
      const {
        prompt,
        size = "1024x1024",
        quality = "standard",
        style = "vivid",
      } = inputs;

      // Call OpenAI API
      const response = await fetch(
        "https://api.openai.com/v1/images/generations",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: "dall-e-3",
            prompt,
            n: 1,
            size,
            quality,
            style,
          }),
        },
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(
          `OpenAI API error: ${error.error?.message || "Unknown error"}`,
        );
      }

      const data = await response.json();

      return {
        type: "image",
        data: {
          url: data.data[0].url,
          prompt: data.data[0].revised_prompt || prompt,
          service: "openai",
        },
      };
    } catch (error) {
      console.error("Error generating image with OpenAI:", error);
      throw error;
    }
  },
};

/**
 * Text-to-Image generation tool using Stability AI
 */
export const stabilityAiImageGenTool: Tool = {
  name: "stability-image-gen",
  description: "Generate images from text descriptions using Stability AI",
  category: "image-generation",
  inputs: [
    {
      name: "prompt",
      type: "string",
      description: "Text description of the image to generate",
      required: true,
    },
    {
      name: "width",
      type: "number",
      description: "Width of the image",
      required: false,
    },
    {
      name: "height",
      type: "number",
      description: "Height of the image",
      required: false,
    },
    {
      name: "cfgScale",
      type: "number",
      description:
        "How strictly the diffusion process adheres to the prompt text (higher values keep your image closer to your prompt)",
      required: false,
    },
  ],
  run: async (inputs: Record<string, any>): Promise<ToolOutput> => {
    try {
      const { prompt, width = 1024, height = 1024, cfgScale = 7 } = inputs;

      // This is a placeholder implementation
      // In a real implementation, you would call the Stability AI API

      // For demo purposes, return a placeholder image
      const placeholderImages = [
        "https://images.unsplash.com/photo-1579546929518-9e396f3cc809",
        "https://images.unsplash.com/photo-1557682250-33bd709cbe85",
        "https://images.unsplash.com/photo-1505144808419-1957a94ca61e",
      ];

      const randomIndex = Math.floor(Math.random() * placeholderImages.length);
      const imageUrl = `${placeholderImages[randomIndex]}?w=${width}&h=${height}`;

      return {
        type: "image",
        data: {
          url: imageUrl,
          prompt,
          service: "stability",
          width,
          height,
        },
      };
    } catch (error) {
      console.error("Error generating image with Stability AI:", error);
      throw error;
    }
  },
};

/**
 * Text-to-Image generation tool using Midjourney
 */
export const midjourneyImageGenTool: Tool = {
  name: "midjourney-image-gen",
  description: "Generate images from text descriptions using Midjourney",
  category: "image-generation",
  inputs: [
    {
      name: "prompt",
      type: "string",
      description: "Text description of the image to generate",
      required: true,
    },
    {
      name: "style",
      type: "string",
      description: "Style of the image",
      required: false,
    },
    {
      name: "version",
      type: "string",
      description: "Midjourney version to use",
      required: false,
    },
  ],
  run: async (inputs: Record<string, any>): Promise<ToolOutput> => {
    try {
      const { prompt, style = "default", version = "5.2" } = inputs;

      // This is a placeholder implementation
      // In a real implementation, you would call the Midjourney API or use a proxy service

      // For demo purposes, return a placeholder image
      const placeholderImages = [
        "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe",
        "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d",
        "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85",
      ];

      const randomIndex = Math.floor(Math.random() * placeholderImages.length);
      const imageUrl = `${placeholderImages[randomIndex]}?w=1024&h=1024`;

      return {
        type: "image",
        data: {
          url: imageUrl,
          prompt,
          service: "midjourney",
          style,
          version,
        },
      };
    } catch (error) {
      console.error("Error generating image with Midjourney:", error);
      throw error;
    }
  },
};

// Register tools
registerTool(imageGenTool);
registerTool(openAiImageGenTool);
registerTool(stabilityAiImageGenTool);
registerTool(midjourneyImageGenTool);
