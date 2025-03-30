/**
 * Slash command parsing and execution hook
 */

"use client";

import { useState, useEffect, useCallback } from "react";
import { useTools } from "@/hooks/useTools";

type SlashCommand = {
  name: string;
  description: string;
  icon?: React.ReactNode;
  action: (args: string) => void;
};

export function useSlashCommands(
  inputValue: string,
  setInputValue: (value: string) => void,
) {
  const [isSlashCommandActive, setIsSlashCommandActive] = useState(false);
  const [activeCommand, setActiveCommand] = useState<string>("");
  const [filteredCommands, setFilteredCommands] = useState<SlashCommand[]>([]);
  const [selectedCommandIndex, setSelectedCommandIndex] = useState(0);
  const { tools, getToolsByType } = useTools();

  // Define available slash commands
  const slashCommands: SlashCommand[] = [
    {
      name: "image",
      description: "Generate an image",
      action: (args) => {
        setInputValue(`Generate an image of ${args}`);
      },
    },
    {
      name: "video",
      description: "Generate a video",
      action: (args) => {
        setInputValue(`Generate a video of ${args}`);
      },
    },
    {
      name: "clear",
      description: "Clear the chat history",
      action: () => {
        // This will be handled by the parent component
        setInputValue("/clear");
      },
    },
    {
      name: "help",
      description: "Show available commands",
      action: () => {
        setInputValue("/help");
      },
    },
    // Add dynamic commands based on available tools
    ...tools
      .filter(
        (tool) =>
          tool.category === "image-generation" ||
          tool.category === "video-generation",
      )
      .map((tool) => ({
        name: tool.name,
        description: tool.description,
        action: (args: string) => {
          setInputValue(`Use the ${tool.name} tool with prompt: ${args}`);
        },
      })),
  ];

  // Check if input starts with / and update slash command state
  useEffect(() => {
    if (inputValue.startsWith("/")) {
      setIsSlashCommandActive(true);
      const commandText = inputValue.slice(1).split(" ")[0];
      setActiveCommand(commandText);

      // Filter commands based on input
      const filtered = slashCommands.filter((cmd) =>
        cmd.name.toLowerCase().includes(commandText.toLowerCase()),
      );
      setFilteredCommands(filtered);
      setSelectedCommandIndex(0);
    } else {
      setIsSlashCommandActive(false);
    }
  }, [inputValue, slashCommands]);

  // Handle command selection with arrow keys
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!isSlashCommandActive) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedCommandIndex((prev) =>
          prev < filteredCommands.length - 1 ? prev + 1 : prev,
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedCommandIndex((prev) => (prev > 0 ? prev - 1 : 0));
      } else if (e.key === "Tab" || e.key === "Enter") {
        e.preventDefault();
        if (filteredCommands.length > 0) {
          const selectedCommand = filteredCommands[selectedCommandIndex];
          const restOfInput = inputValue.slice(activeCommand.length + 1).trim();
          selectedCommand.action(restOfInput);
          setIsSlashCommandActive(false);
        }
      } else if (e.key === "Escape") {
        e.preventDefault();
        setIsSlashCommandActive(false);
      }
    },
    [
      isSlashCommandActive,
      filteredCommands,
      selectedCommandIndex,
      activeCommand,
      inputValue,
      setInputValue,
    ],
  );

  // Execute a command by name
  const executeCommand = useCallback(
    (commandName: string, args: string = "") => {
      const command = slashCommands.find(
        (cmd) => cmd.name.toLowerCase() === commandName.toLowerCase(),
      );
      if (command) {
        command.action(args);
        setIsSlashCommandActive(false);
        return true;
      }
      return false;
    },
    [slashCommands],
  );

  return {
    isSlashCommandActive,
    filteredCommands,
    selectedCommandIndex,
    handleKeyDown,
    executeCommand,
  };
}
