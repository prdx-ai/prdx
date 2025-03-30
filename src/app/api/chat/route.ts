import { NextRequest, NextResponse } from "next/server";
import { createClient } from "../../../../supabase/server";
import { generateSystemPrompt } from "@/lib/systemPrompt";
import { getAllTools, executeTool } from "@/lib/tools";
import { getLLMProvider, getDefaultLLMProvider } from "@/lib/models/llm";

// Import all LLM providers to register them
import "@/lib/models/llm/openai";
import "@/lib/models/llm/anthropic";
import "@/lib/models/llm/gemini";

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
      model = getDefaultLLMProvider(), // Use the default LLM provider if not specified
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

    // Get the appropriate LLM provider
    const llmProvider = getLLMProvider(model);
    if (!llmProvider) {
      return NextResponse.json(
        { error: `LLM provider '${model}' not found or not available` },
        { status: 400 },
      );
    }

    // Generate response using the selected LLM provider
    const response = await llmProvider.generateCompletion(
      messages,
      systemPrompt,
      {
        temperature: 0.7,
      },
    );

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
