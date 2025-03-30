/**
 * Google Gemini LLM API endpoint
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "../../../../supabase/server";
import { generateCompletion } from "@/lib/gemini";

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

    // Generate completion
    const response = await generateCompletion(
      messages,
      systemPrompt || "You are a helpful assistant.",
      {
        temperature: options.temperature || 0.7,
        maxTokens: options.maxTokens || 1024,
        ...options,
      },
    );

    // Save the conversation to the database
    const { error: saveError } = await supabase.from("conversations").insert({
      user_id: user.id,
      message: messages[messages.length - 1].content,
      response: response.text,
      model: "gemini",
    });

    if (saveError) {
      console.error("Error saving conversation:", saveError);
    }

    return NextResponse.json({
      text: response.text,
    });
  } catch (error) {
    console.error("Error in Gemini API:", error);
    return NextResponse.json(
      { error: "An error occurred processing your request" },
      { status: 500 },
    );
  }
}
