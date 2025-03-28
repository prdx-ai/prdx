/**
 * Anthropic integration for Paradox
 */

type AnthropicMessage = {
  role: "user" | "assistant";
  content: string;
};

type AnthropicCompletionOptions = {
  model?: string;
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  top_k?: number;
};

type AnthropicCompletionResponse = {
  text: string;
  usage?: {
    input_tokens: number;
    output_tokens: number;
  };
};

/**
 * Generate a completion using Anthropic's API
 */
export async function generateCompletion(
  messages: AnthropicMessage[],
  systemPrompt: string,
  options: AnthropicCompletionOptions = {},
): Promise<AnthropicCompletionResponse> {
  const {
    model = "claude-3-opus-20240229",
    temperature = 0.7,
    max_tokens = 1000,
    top_p = 1,
    top_k = 5,
  } = options;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": `${process.env.ANTHROPIC_API_KEY}`,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model,
        messages,
        system: systemPrompt,
        temperature,
        max_tokens,
        top_p,
        top_k,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        `Anthropic API error: ${error.error?.message || "Unknown error"}`,
      );
    }

    const data = await response.json();

    return {
      text: data.content[0].text,
      usage: {
        input_tokens: data.usage?.input_tokens,
        output_tokens: data.usage?.output_tokens,
      },
    };
  } catch (error) {
    console.error("Error generating completion with Anthropic:", error);
    throw error;
  }
}

/**
 * Generate a completion with tool calling using Anthropic's API
 */
export async function generateCompletionWithTools(
  messages: AnthropicMessage[],
  systemPrompt: string,
  tools: any[],
  options: AnthropicCompletionOptions = {},
) {
  const {
    model = "claude-3-opus-20240229",
    temperature = 0.7,
    max_tokens = 1000,
    top_p = 1,
    top_k = 5,
  } = options;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": `${process.env.ANTHROPIC_API_KEY}`,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model,
        messages,
        system: systemPrompt,
        tools,
        temperature,
        max_tokens,
        top_p,
        top_k,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        `Anthropic API error: ${error.error?.message || "Unknown error"}`,
      );
    }

    const data = await response.json();

    return {
      message: data.content,
      usage: {
        input_tokens: data.usage?.input_tokens,
        output_tokens: data.usage?.output_tokens,
      },
    };
  } catch (error) {
    console.error("Error generating completion with Anthropic tools:", error);
    throw error;
  }
}
