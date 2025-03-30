/**
 * OpenAI DALL-E image generation API endpoint
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "../../../../../supabase/server";

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
      prompt,
      size = "1024x1024",
      quality = "standard",
      style = "vivid",
    } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 },
      );
    }

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
    const imageUrl = data.data[0].url;
    const revisedPrompt = data.data[0].revised_prompt || prompt;

    // Save the generated image to the database
    const { error: saveError } = await supabase.from("media").insert({
      user_id: user.id,
      prompt: prompt,
      revised_prompt: revisedPrompt,
      url: imageUrl,
      type: "image",
      service: "openai",
      metadata: { size, quality, style },
    });

    if (saveError) {
      console.error("Error saving image:", saveError);
    }

    return NextResponse.json({
      url: imageUrl,
      prompt: revisedPrompt,
      type: "image",
    });
  } catch (error) {
    console.error("Error in OpenAI image generation API:", error);
    return NextResponse.json(
      { error: "An error occurred processing your request" },
      { status: 500 },
    );
  }
}
