/**
 * Base interface for all tools in the Paradox system
 */

export interface ToolInput {
  name: string;
  type: string;
  description: string;
  required: boolean;
}

export interface ToolOutput {
  type: string;
  data: any;
}

export interface Tool {
  name: string;
  description: string;
  category: string;
  inputs: ToolInput[];
  run: (inputs: Record<string, any>) => Promise<ToolOutput>;
}

// Registry to store all available tools
const toolRegistry = new Map<string, Tool>();

/**
 * Register a new tool in the system
 */
export function registerTool(tool: Tool) {
  toolRegistry.set(tool.name, tool);
}

/**
 * Get a tool by name
 */
export function getTool(name: string): Tool | undefined {
  return toolRegistry.get(name);
}

/**
 * Get all registered tools
 */
export function getAllTools(): Tool[] {
  return Array.from(toolRegistry.values());
}

/**
 * Get all tools by category
 */
export function getToolsByCategory(category: string): Tool[] {
  return getAllTools().filter((tool) => tool.category === category);
}

/**
 * Execute a tool by name with the given inputs
 */
export async function executeTool(
  name: string,
  inputs: Record<string, any>,
): Promise<ToolOutput> {
  const tool = getTool(name);
  if (!tool) {
    throw new Error(`Tool ${name} not found`);
  }

  // Validate inputs
  const missingInputs = tool.inputs
    .filter((input) => input.required && !(input.name in inputs))
    .map((input) => input.name);

  if (missingInputs.length > 0) {
    throw new Error(`Missing required inputs: ${missingInputs.join(", ")}`);
  }

  return await tool.run(inputs);
}
