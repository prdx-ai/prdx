/**
 * OpenAI integration for Paradox
 */

type OpenAIMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

type OpenAICompletionOptions = {
  model?: string;
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
};

type OpenAICompletionResponse = {
  text: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
};

/**
 * Generate a completion using OpenAI's API
 */
export async function generateCompletion(
  messages: OpenAIMessage[],
  options: OpenAICompletionOptions = {},
): Promise<OpenAICompletionResponse> {
  const {
    model = "gpt-4o",
    temperature = 0.7,
    max_tokens = 1000,
    top_p = 1,
    frequency_penalty = 0,
    presence_penalty = 0,
  } = options;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature,
        max_tokens,
        top_p,
        frequency_penalty,
        presence_penalty,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        `OpenAI API error: ${error.error?.message || "Unknown error"}`,
      );
    }

    const data = await response.json();

    return {
      text: data.choices[0].message.content,
      usage: data.usage,
    };
  } catch (error) {
    console.error("Error generating completion with OpenAI:", error);
    throw error;
  }
}

/**
 * Generate a completion with tool calling using OpenAI's API
 */
export async function generateCompletionWithTools(
  messages: OpenAIMessage[],
  tools: any[],
  options: OpenAICompletionOptions = {},
) {
  const {
    model = "gpt-4o",
    temperature = 0.7,
    max_tokens = 1000,
    top_p = 1,
    frequency_penalty = 0,
    presence_penalty = 0,
  } = options;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model,
        messages,
        tools,
        tool_choice: "auto",
        temperature,
        max_tokens,
        top_p,
        frequency_penalty,
        presence_penalty,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        `OpenAI API error: ${error.error?.message || "Unknown error"}`,
      );
    }

    const data = await response.json();
    const message = data.choices[0].message;

    return {
      message,
      usage: data.usage,
    };
  } catch (error) {
    console.error("Error generating completion with OpenAI tools:", error);
    throw error;
  }
}
