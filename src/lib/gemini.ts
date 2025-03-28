/**
 * Gemini AI integration for text generation
 */

type Message = {
  role: string;
  content: string;
};

type CompletionOptions = {
  temperature?: number;
  maxTokens?: number;
};

type CompletionResponse = {
  text: string;
};

/**
 * Generate a completion using Google's Gemini API
 */
export async function generateCompletion(
  messages: Message[],
  systemPrompt: string,
  options: CompletionOptions = {},
): Promise<CompletionResponse> {
  try {
    // Format messages for Gemini API
    // Note: Gemini doesn't have a dedicated system message type like OpenAI
    // So we prepend it to the conversation as a "model" message
    const formattedMessages = [
      { role: "model", parts: [{ text: systemPrompt }] },
      ...messages.map((msg) => ({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }],
      })),
    ];

    // Call Gemini API
    // This is a placeholder implementation - in a real app, you would use the Gemini SDK
    // or make a direct API call to the Gemini endpoint
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": process.env.GEMINI_API_KEY || "",
        },
        body: JSON.stringify({
          contents: formattedMessages,
          generationConfig: {
            temperature: options.temperature || 0.7,
            maxOutputTokens: options.maxTokens || 1024,
          },
        }),
      },
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Gemini API error: ${JSON.stringify(error)}`);
    }

    const data = await response.json();
    const generatedText = data.candidates[0].content.parts[0].text;

    return {
      text: generatedText,
    };
  } catch (error) {
    console.error("Error generating completion with Gemini:", error);
    return {
      text: "Sorry, there was an error generating a response with Gemini.",
    };
  }
}
