/**
 * Chat input component with slash command support
 */

"use client";

import { useState, useRef, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send, ChevronUp, Settings, Loader2 } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSlashCommands } from "../hooks/useSlashCommands";

type GenerationPreset = {
  id: string;
  name: string;
  description: string;
  image: string;
  type: "image" | "video";
};

type ChatInputProps = {
  onSendMessage: (message: string, preset?: GenerationPreset) => Promise<void>;
  isLoading: boolean;
  onClearChat: () => void;
  imagePresets: GenerationPreset[];
  videoPresets: GenerationPreset[];
  selectedModel: string;
  onModelChange: (model: string) => void;
};

export default function ChatInput({
  onSendMessage,
  isLoading,
  onClearChat,
  imagePresets,
  videoPresets,
  selectedModel,
  onModelChange,
}: ChatInputProps) {
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const {
    isSlashCommandActive,
    filteredCommands,
    selectedCommandIndex,
    handleKeyDown,
    executeCommand,
  } = useSlashCommands(input, setInput);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    // Check for slash commands
    if (input.startsWith("/")) {
      const [command, ...args] = input.slice(1).split(" ");

      if (command === "clear") {
        onClearChat();
        setInput("");
        return;
      }
    }

    await onSendMessage(input);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (isSlashCommandActive) {
      // Let the slash command hook handle keyboard navigation
      handleKeyDown(e);
      return;
    }

    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handlePresetClick = async (preset: GenerationPreset) => {
    await onSendMessage(input || preset.description, preset);
    setInput("");
  };

  return (
    <div className="p-4 border-t bg-background">
      <div className="max-w-3xl mx-auto">
        <div className="relative">
          {/* Slash command menu */}
          {isSlashCommandActive && filteredCommands.length > 0 && (
            <div className="absolute bottom-full mb-2 w-full bg-card border rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
              {filteredCommands.map((command, index) => (
                <div
                  key={command.name}
                  className={`p-2 hover:bg-accent cursor-pointer ${index === selectedCommandIndex ? "bg-accent" : ""}`}
                  onClick={() => {
                    executeCommand(command.name);
                  }}
                >
                  <div className="font-medium">{command.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {command.description}
                  </div>
                </div>
              ))}
            </div>
          )}

          <Textarea
            ref={inputRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Give me a cool illustration for my San Francisco party!"
            className="min-h-[60px] resize-none pr-24 py-4 rounded-xl border-gray-200"
            disabled={isLoading}
          />
          <div className="absolute right-2 bottom-2 flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-lg">
                  <ChevronUp className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[400px] p-0" align="end">
                <Tabs defaultValue="image">
                  <TabsList className="w-full">
                    <TabsTrigger value="image" className="flex-1">
                      Image Generation
                    </TabsTrigger>
                    <TabsTrigger value="video" className="flex-1">
                      Video Generation
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="image" className="p-4">
                    <div className="grid grid-cols-2 gap-4">
                      {imagePresets.map((preset) => (
                        <div
                          key={preset.id}
                          className="border rounded-lg overflow-hidden cursor-pointer hover:border-primary transition-colors"
                          onClick={() => handlePresetClick(preset)}
                        >
                          <div className="h-32 overflow-hidden">
                            <img
                              src={preset.image}
                              alt={preset.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="p-3">
                            <h3 className="font-medium">{preset.name}</h3>
                            <p className="text-xs text-muted-foreground">
                              {preset.description}
                            </p>
                          </div>
                          <div className="p-2 bg-muted flex justify-end">
                            <Button size="sm" variant="secondary">
                              Try
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  <TabsContent value="video" className="p-4">
                    <div className="grid grid-cols-2 gap-4">
                      {videoPresets.map((preset) => (
                        <div
                          key={preset.id}
                          className="border rounded-lg overflow-hidden cursor-pointer hover:border-primary transition-colors"
                          onClick={() => handlePresetClick(preset)}
                        >
                          <div className="h-32 overflow-hidden">
                            <img
                              src={preset.image}
                              alt={preset.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="p-3">
                            <h3 className="font-medium">{preset.name}</h3>
                            <p className="text-xs text-muted-foreground">
                              {preset.description}
                            </p>
                          </div>
                          <div className="p-2 bg-muted flex justify-end">
                            <Button size="sm" variant="secondary">
                              Try
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </PopoverContent>
            </Popover>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-lg">
                  <Settings className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px]" align="end">
                <div className="space-y-2">
                  <h4 className="font-medium">Model Selection</h4>
                  <div className="space-y-1">
                    <Button
                      variant={
                        selectedModel === "openai" ? "default" : "outline"
                      }
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => onModelChange("openai")}
                    >
                      OpenAI
                    </Button>
                    <Button
                      variant={
                        selectedModel === "anthropic" ? "default" : "outline"
                      }
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => onModelChange("anthropic")}
                    >
                      Anthropic
                    </Button>
                    <Button
                      variant={
                        selectedModel === "gemini" ? "default" : "outline"
                      }
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => onModelChange("gemini")}
                    >
                      Gemini
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              size="icon"
              className="rounded-lg"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
