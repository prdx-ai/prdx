import { NextRequest, NextResponse } from "next/server";
import { createClient } from "../../../../supabase/server";
import { generateCompletion as generateOpenAICompletion } from "@/lib/openai";
import { generateCompletion as generateAnthropicCompletion } from "@/lib/anthropic";
import { generateCompletion as generateGeminiCompletion } from "@/lib/gemini";
import { generateSystemPrompt } from "@/lib/systemPrompt";
import { getAllTools, executeTool } from "@/lib/tools";

// Use a cache for system prompts and tools
let cachedSystemPrompts: any = null;
let cachedTools: any = null;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, model, temperature, max_tokens, pipeline } = body;

    // Initialize tools and system prompts only once
    if (!cachedTools) {
      cachedTools = getAllTools();
    }

    // Determine which AI provider to use based on the model
    let completion;
    const modelLower = model.toLowerCase();

    // Prepare system prompt with cached values when possible
    const systemPrompt = generateSystemPrompt("default", {
      availableTools: cachedTools,
    });

    // Use the appropriate AI provider based on model name
    if (modelLower.includes("gpt")) {
      completion = await generateOpenAICompletion(messages, {
        model,
        temperature,
        max_tokens,
        systemPrompt,
      });
    } else if (modelLower.includes("claude")) {
      completion = await generateAnthropicCompletion(messages, systemPrompt, {
        model,
        temperature,
        max_tokens,
      });
    } else if (modelLower.includes("gemini")) {
      completion = await generateGeminiCompletion(messages, systemPrompt, {
        model,
        temperature,
        max_tokens,
      });
    } else {
      // Default to OpenAI
      completion = await generateOpenAICompletion(messages, {
        model: "gpt-4o",
        temperature,
        max_tokens,
        systemPrompt,
      });
    }

    return NextResponse.json(completion);
  } catch (error: any) {
    console.error("Error in chat API:", error);
    return NextResponse.json(
      { error: error.message || "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
