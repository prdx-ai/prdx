import { NextRequest, NextResponse } from "next/server";
import { createClient } from "../../../../supabase/server";
import { generateCompletion as generateOpenAICompletion } from "@/lib/openai";
import { generateCompletion as generateAnthropicCompletion } from "@/lib/anthropic";
import { generateCompletion as generateGeminiCompletion } from "@/lib/gemini";
import { generateSystemPrompt } from "@/lib/systemPrompt";
import { getAllTools, executeTool } from "@/lib/tools";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {
      message,
      history,
      systemPromptId = "default",
      model = "openai", // Default to OpenAI if not specified
    } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 },
      );
    }

    // Prepare context for system prompt
    const availableTools = getAllTools();
    const context = {
      availableTools,
      userPreferences: {
        userId: user.id,
        email: user.email,
      },
    };

    // Generate system prompt
    const systemPrompt = generateSystemPrompt(systemPromptId, context);

    // Prepare messages for AI
    const messages = history.map((msg: any) => ({
      role: msg.role,
      content: msg.content,
    }));

    // Add the new user message
    messages.push({
      role: "user",
      content: message,
    });

    // Determine which AI service to use based on model parameter and system prompt
    let response;

    // For image or video generation, prefer Anthropic if available
    const isMediaGeneration =
      systemPromptId === "image-generation" ||
      systemPromptId === "video-generation";
    const useAnthropicForMedia =
      process.env.ANTHROPIC_API_KEY && isMediaGeneration;

    if (model === "anthropic" || useAnthropicForMedia) {
      // Use Anthropic
      response = await generateAnthropicCompletion(
        messages.filter((msg: any) => msg.role !== "system"),
        systemPrompt,
        { temperature: 0.7 },
      );
    } else if (model === "gemini" && process.env.GEMINI_API_KEY) {
      // Use Gemini
      response = await generateGeminiCompletion(messages, systemPrompt, {
        temperature: 0.7,
      });
    } else {
      // Default to OpenAI
      const openAIMessages = [
        { role: "system", content: systemPrompt },
        ...messages,
      ];
      response = await generateOpenAICompletion(openAIMessages, {
        temperature: 0.7,
      });
    }

    // Check for tool invocation patterns in the response
    const toolPattern = /use the ([\w-]+) tool with (.+)/i;
    const match = response.text.match(toolPattern);

    let media = [];

    if (match) {
      const [_, toolName, inputsText] = match;
      try {
        // Parse the inputs from the text
        const inputsPattern = /([\w-]+)\s*:\s*([^,]+)(?:,|$)/g;
        const inputs: Record<string, any> = {};
        let inputMatch;

        while ((inputMatch = inputsPattern.exec(inputsText)) !== null) {
          const [__, key, value] = inputMatch;
          inputs[key.trim()] = value.trim().replace(/['"`]/g, "");
        }

        // Execute the tool
        const toolOutput = await executeTool(toolName, inputs);

        // Add the tool output to the response
        if (toolOutput.type === "image" || toolOutput.type === "video") {
          media.push({
            type: toolOutput.type,
            url: toolOutput.data.url,
            prompt: toolOutput.data.prompt,
          });
        }
      } catch (error) {
        console.error("Error executing tool:", error);
      }
    }

    // Save the conversation to the database
    const { error: saveError } = await supabase.from("conversations").insert({
      user_id: user.id,
      message: message,
      response: response.text,
      media: media.length > 0 ? media : null,
      system_prompt_id: systemPromptId,
      model: model,
    });

    if (saveError) {
      console.error("Error saving conversation:", saveError);
    }

    return NextResponse.json({
      text: response.text,
      media,
    });
  } catch (error) {
    console.error("Error in chat API:", error);
    return NextResponse.json(
      { error: "An error occurred processing your request" },
      { status: 500 },
    );
  }
}
