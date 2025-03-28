/**
 * System prompt engine for Paradox
 * Manages context, provides guidance, and inserts recommended improvements
 */

export interface SystemPromptTemplate {
  id: string;
  name: string;
  description: string;
  prompt: string;
}

// Default system prompts
const defaultSystemPrompts: SystemPromptTemplate[] = [
  {
    id: "default",
    name: "Default Assistant",
    description: "General purpose assistant that can help with various tasks",
    prompt:
      "You are Paradox, an AI assistant that can generate images and videos based on text descriptions. You can help users create visual content through natural conversation.",
  },
  {
    id: "image-generation",
    name: "Image Generation",
    description: "Specialized in helping users generate images",
    prompt:
      "You are Paradox, an AI assistant specialized in helping users generate images. You can suggest improvements to prompts and guide users to create better visual content.",
  },
  {
    id: "video-generation",
    name: "Video Generation",
    description: "Specialized in helping users generate videos",
    prompt:
      "You are Paradox, an AI assistant specialized in helping users generate videos from images or text descriptions. You can suggest improvements to prompts and guide users to create better video content.",
  },
];

// Store for custom system prompts
let customSystemPrompts: SystemPromptTemplate[] = [];

/**
 * Get a system prompt by ID
 */
export function getSystemPrompt(id: string): SystemPromptTemplate | undefined {
  return [...defaultSystemPrompts, ...customSystemPrompts].find(
    (prompt) => prompt.id === id,
  );
}

/**
 * Get all available system prompts
 */
export function getAllSystemPrompts(): SystemPromptTemplate[] {
  return [...defaultSystemPrompts, ...customSystemPrompts];
}

/**
 * Add a custom system prompt
 */
export function addCustomSystemPrompt(prompt: SystemPromptTemplate): void {
  customSystemPrompts.push(prompt);
}

/**
 * Remove a custom system prompt
 */
export function removeCustomSystemPrompt(id: string): void {
  customSystemPrompts = customSystemPrompts.filter(
    (prompt) => prompt.id !== id,
  );
}

/**
 * Generate a complete system prompt with context
 */
export function generateSystemPrompt(
  basePromptId: string = "default",
  context: Record<string, any> = {},
): string {
  const basePrompt = getSystemPrompt(basePromptId);
  if (!basePrompt) {
    throw new Error(`System prompt with ID ${basePromptId} not found`);
  }

  let finalPrompt = basePrompt.prompt;

  // Add available tools context if tools are available
  if (context.availableTools && context.availableTools.length > 0) {
    finalPrompt += "\n\nYou have access to the following tools:";
    context.availableTools.forEach((tool: any) => {
      finalPrompt += `\n- ${tool.name}: ${tool.description}`;
    });
  }

  // Add user preferences if available
  if (context.userPreferences) {
    finalPrompt += "\n\nUser preferences:";
    Object.entries(context.userPreferences).forEach(([key, value]) => {
      finalPrompt += `\n- ${key}: ${value}`;
    });
  }

  return finalPrompt;
}
