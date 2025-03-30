/**
 * Anthropic (Claude) LLM API endpoint
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "../../../../supabase/server";
import { generateCompletion } from "@/lib/anthropic";

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

    // Anthropic expects messages without the system role
    const anthropicMessages = messages.filter(
      (msg: any) => msg.role !== "system",
    );

    // Generate completion
    const response = await generateCompletion(
      anthropicMessages,
      systemPrompt || "You are a helpful assistant.",
      {
        temperature: options.temperature || 0.7,
        model: options.model || "claude-3-opus-20240229",
        ...options,
      },
    );

    // Save the conversation to the database
    const { error: saveError } = await supabase.from("conversations").insert({
      user_id: user.id,
      message: messages[messages.length - 1].content,
      response: response.text,
      model: "anthropic",
    });

    if (saveError) {
      console.error("Error saving conversation:", saveError);
    }

    return NextResponse.json({
      text: response.text,
      usage: response.usage,
    });
  } catch (error) {
    console.error("Error in Anthropic API:", error);
    return NextResponse.json(
      { error: "An error occurred processing your request" },
      { status: 500 },
    );
  }
}
