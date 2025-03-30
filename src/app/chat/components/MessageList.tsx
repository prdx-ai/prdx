/**
 * Message list component for rendering chat messages
 */

"use client";

import { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import MessageBubble from "./MessageBubble";
import { Image } from "lucide-react";

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

type MessageListProps = {
  messages: Message[];
  isLoading: boolean;
};

export default function MessageList({ messages, isLoading }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto py-4 px-4 md:px-8 lg:px-16 xl:px-32 space-y-6">
      {messages.length === 0 && (
        <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
          <Image className="h-12 w-12 mb-4 opacity-50" />
          <p className="text-center max-w-md">
            Start a conversation to generate images and videos using AI. Try
            asking for an image of a sunset over mountains or a futuristic
            cityscape.
          </p>
        </div>
      )}

      {messages.map((message) => (
        <div
          key={message.id}
          className={cn(
            "flex max-w-3xl mx-auto",
            message.role === "user" ? "justify-end" : "justify-start",
          )}
        >
          <MessageBubble message={message} />
        </div>
      ))}

      {isLoading && (
        <div className="flex max-w-3xl mx-auto">
          <div className="w-full rounded-lg p-4 bg-card border">
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded-full bg-primary animate-pulse"></div>
              <div className="h-4 w-4 rounded-full bg-primary animate-pulse delay-150"></div>
              <div className="h-4 w-4 rounded-full bg-primary animate-pulse delay-300"></div>
              <span className="ml-2">Generating response...</span>
            </div>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
}
