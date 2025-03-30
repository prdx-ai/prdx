/**
 * Main chat page
 */

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useChat } from "./hooks/useChat";
import { useTools } from "@/hooks/useTools";
import MessageList from "./components/MessageList";
import ChatInput from "./components/ChatInput";
import ToolDropdown from "./components/ToolDropdown";
import {
  Trash2,
  Home,
  Sparkles,
  Palette,
  Zap,
  UserCircle,
  Settings,
} from "lucide-react";

// Image generation presets
const imagePresets = [
  {
    id: "black-and-white",
    name: "Black and white",
    description: "Generate stunning full frame landscapes.",
    image:
      "https://images.unsplash.com/photo-1573455494060-c5595004fb6c?w=800&q=80",
    type: "image" as const,
  },
  {
    id: "medieval-warrior",
    name: "Medieval warrior",
    description: "Dark portraits.",
    image:
      "https://images.unsplash.com/photo-1560419015-7c427e8ae5ba?w=800&q=80",
    type: "image" as const,
  },
  {
    id: "space",
    name: "Space",
    description: "Make images of spiral galaxies.",
    image:
      "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=800&q=80",
    type: "image" as const,
  },
  {
    id: "animal-hybrids",
    name: "Animal Hybrids",
    description: "Lions with duck faces?",
    image:
      "https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=800&q=80",
    type: "image" as const,
  },
  {
    id: "line-sketch",
    name: "Line sketch",
    description: "Minimalist sketches.",
    image:
      "https://images.unsplash.com/photo-1572883454114-1cf0031ede2a?w=800&q=80",
    type: "image" as const,
  },
  {
    id: "phone-wallpaper",
    name: "Phone wallpaper",
    description: "Random phone backgrounds.",
    image:
      "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&q=80",
    type: "image" as const,
  },
];

// Video generation presets
const videoPresets = [
  {
    id: "cinematic",
    name: "Cinematic",
    description: "Movie-like quality videos.",
    image:
      "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&q=80",
    type: "video" as const,
  },
  {
    id: "animation",
    name: "Animation",
    description: "Animated style videos.",
    image:
      "https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2?w=800&q=80",
    type: "video" as const,
  },
];

export default function ChatPage() {
  const { tools } = useTools();
  const {
    messages,
    isLoading,
    sendMessage,
    clearChat,
    selectedModel,
    changeModel,
  } = useChat();

  const handleSendMessage = async (message: string, preset?: any) => {
    let messageContent = message;
    let systemPromptId = "default";

    if (preset) {
      messageContent = `Generate a ${preset.type} in the style of ${preset.name}: ${message || preset.description}`;
      systemPromptId =
        preset.type === "image" ? "image-generation" : "video-generation";
    }

    await sendMessage(messageContent, { systemPromptId });
  };

  const handleToolSelect = (toolName: string) => {
    // Set up a prompt for the selected tool
    const toolPrompt = `I'd like to use the ${toolName} tool. What inputs do I need to provide?`;
    sendMessage(toolPrompt);
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="hidden md:flex flex-col w-16 border-r bg-card items-center py-4 space-y-4">
        <Button variant="ghost" size="icon" className="rounded-full">
          <Home className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full bg-secondary"
        >
          <Sparkles className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Palette className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Zap className="h-5 w-5" />
        </Button>
        <div className="flex-1"></div>
        <Button variant="ghost" size="icon" className="rounded-full">
          <UserCircle className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Settings className="h-5 w-5" />
        </Button>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top navigation */}
        <div className="flex items-center justify-between border-b py-3 px-4">
          <div className="flex space-x-2">
            <Button variant="ghost" className="text-sm font-normal" size="sm">
              Home
            </Button>
            <Button
              variant="secondary"
              className="text-sm font-normal"
              size="sm"
            >
              Chat
            </Button>
            <Button variant="ghost" className="text-sm font-normal" size="sm">
              Gallery
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <ToolDropdown tools={tools} onSelectTool={handleToolSelect} />
            <Button
              variant="ghost"
              size="sm"
              onClick={clearChat}
              className="text-xs text-muted-foreground"
            >
              <Trash2 className="h-3 w-3 mr-1" /> Clear
            </Button>
          </div>
        </div>

        {/* Messages container */}
        <MessageList messages={messages} isLoading={isLoading} />

        {/* Input area */}
        <ChatInput
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          onClearChat={clearChat}
          imagePresets={imagePresets}
          videoPresets={videoPresets}
          selectedModel={selectedModel}
          onModelChange={changeModel}
        />
      </div>
    </div>
  );
}
