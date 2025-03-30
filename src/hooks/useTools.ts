/**
 * Global tool management and selection hook
 */

"use client";

import { useState, useEffect } from "react";
import { Tool, getAllTools, getToolsByCategory } from "@/lib/tools";

export function useTools() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load all available tools
    const loadTools = () => {
      try {
        setLoading(true);
        const availableTools = getAllTools();
        setTools(availableTools);
      } catch (error) {
        console.error("Error loading tools:", error);
      } finally {
        setLoading(false);
      }
    };

    loadTools();
  }, []);

  const getToolsByType = (category: string) => {
    return getToolsByCategory(category);
  };

  const selectTool = (toolName: string) => {
    const tool = tools.find((t) => t.name === toolName);
    setSelectedTool(tool || null);
    return tool;
  };

  const executeTool = async (toolName: string, inputs: Record<string, any>) => {
    try {
      const tool = tools.find((t) => t.name === toolName);
      if (!tool) {
        throw new Error(`Tool ${toolName} not found`);
      }

      return await tool.run(inputs);
    } catch (error) {
      console.error(`Error executing tool ${toolName}:`, error);
      throw error;
    }
  };

  return {
    tools,
    selectedTool,
    loading,
    getToolsByType,
    selectTool,
    executeTool,
  };
}
