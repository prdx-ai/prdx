/**
 * OpenAI LLM API endpoint
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "../../../../supabase/server";
import { generateCompletion } from "@/lib/openai";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { messages, systemPrompt, options = {} } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Messages array is required" },
        { status: 400 },
      );
    }

    // Prepare messages for OpenAI
    const openAIMessages = [
      {
        role: "system",
        content: systemPrompt || "You are a helpful assistant.",
      },
      ...messages,
    ];

    // Generate completion
    const response = await generateCompletion(openAIMessages, {
      temperature: options.temperature || 0.7,
      model: options.model || "gpt-4o",
      ...options,
    });

    // Save the conversation to the database
    const { error: saveError } = await supabase.from("conversations").insert({
      user_id: user.id,
      message: messages[messages.length - 1].content,
      response: response.text,
      model: "openai",
    });

    if (saveError) {
      console.error("Error saving conversation:", saveError);
    }

    return NextResponse.json({
      text: response.text,
      usage: response.usage,
    });
  } catch (error) {
    console.error("Error in OpenAI API:", error);
    return NextResponse.json(
      { error: "An error occurred processing your request" },
      { status: 500 },
    );
  }
}
