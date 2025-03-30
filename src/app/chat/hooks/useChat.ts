/**
 * Chat state and message flow management hook
 */

"use client";

import { useState, useEffect, useRef } from "react";
import { useUser } from "@/hooks/useUser";
import { getAllSystemPrompts } from "@/lib/systemPrompt";

type Message = {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
  media?: {
    type: "image" | "video";
    url: string;
    prompt?: string;
  }[];
};

type ChatOptions = {
  initialMessages?: Message[];
  systemPromptId?: string;
  model?: string;
  saveHistory?: boolean;
};

export function useChat(options: ChatOptions = {}) {
  const {
    initialMessages = [],
    systemPromptId = "default",
    model = "openai",
    saveHistory = true,
  } = options;

  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [selectedSystemPrompt, setSelectedSystemPrompt] =
    useState(systemPromptId);
  const [selectedModel, setSelectedModel] = useState(model);
  const { user } = useUser();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (content: string, options: any = {}) => {
    if (!content.trim()) return;

    // Create user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date(),
    };

    // Add user message to state
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      // Prepare request to API
      const promptId = options.systemPromptId || selectedSystemPrompt;
      const modelId = options.model || selectedModel;

      // Send message to API
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: content,
          history: messages,
          systemPromptId: promptId,
          model: modelId,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();

      // Create assistant message
      const assistantMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: data.text || "",
        timestamp: new Date(),
        media: data.media,
      };

      // Add assistant message to state
      setMessages((prev) => [...prev, assistantMessage]);

      return assistantMessage;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(new Error(errorMessage));
      console.error("Error sending message:", err);

      // Add error message
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "assistant",
          content: `Sorry, there was an error: ${errorMessage}`,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    setError(null);
  };

  const changeSystemPrompt = (promptId: string) => {
    setSelectedSystemPrompt(promptId);
  };

  const changeModel = (modelId: string) => {
    setSelectedModel(modelId);
  };

  return {
    messages,
    isLoading,
    error,
    selectedSystemPrompt,
    selectedModel,
    sendMessage,
    clearChat,
    changeSystemPrompt,
    changeModel,
    messagesEndRef,
    systemPrompts: getAllSystemPrompts(),
  };
}
