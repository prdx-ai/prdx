/**
 * Chat input component with slash command support
 */

"use client";

import { useState, useRef, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Send,
  ChevronUp,
  Settings,
  Loader2,
  Image as ImageIcon,
  Video,
  Layers,
  Sliders,
  Maximize,
  Palette,
  Clock,
  Sparkles,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSlashCommands } from "../hooks/useSlashCommands";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  inputRef?: React.RefObject<HTMLTextAreaElement>;
};

export default function ChatInput({
  onSendMessage,
  isLoading,
  onClearChat,
  imagePresets,
  videoPresets,
  selectedModel,
  onModelChange,
  inputRef: externalInputRef,
}: ChatInputProps) {
  const [input, setInput] = useState("");
  const localInputRef = useRef<HTMLTextAreaElement>(null);
  const inputRef = externalInputRef || localInputRef;
  const [samplePrompts] = useState([
    "Futuristic cityscape",
    "Cyberpunk character",
    "Fantasy landscape",
    "Space station",
  ]);

  // Advanced settings
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(1000);
  const [topP, setTopP] = useState(0.9);
  const [aspectRatio, setAspectRatio] = useState("1:1");
  const [quality, setQuality] = useState("standard");
  const [style, setStyle] = useState("vivid");

  // Image models
  const imageModels = [
    { id: "dall-e-3", name: "DALL-E 3", provider: "OpenAI" },
    { id: "midjourney", name: "Midjourney", provider: "Midjourney" },
    {
      id: "stable-diffusion-xl",
      name: "Stable Diffusion XL",
      provider: "Stability AI",
    },
    { id: "imagen", name: "Imagen", provider: "Google" },
  ];

  // Video models
  const videoModels = [
    { id: "sora", name: "Sora", provider: "OpenAI" },
    { id: "gen-2", name: "Gen-2", provider: "Runway" },
    { id: "pika", name: "Pika", provider: "Pika Labs" },
    { id: "flux", name: "Flux", provider: "Flux" },
  ];

  const {
    isSlashCommandActive,
    filteredCommands,
    selectedCommandIndex,
    handleKeyDown,
    executeCommand,
  } = useSlashCommands(input, setInput);

  // Focus input on mount if not provided externally
  useEffect(() => {
    if (!externalInputRef) {
      inputRef.current?.focus();
    }
  }, [externalInputRef, inputRef]);

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

  const handleKeyboardEvent = (e: React.KeyboardEvent) => {
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

  const handleSamplePromptClick = (prompt: string) => {
    setInput(`Create a ${prompt.toLowerCase()} with stunning details`);
    inputRef.current?.focus();
  };

  return (
    <div className="w-full">
      <div className="relative">
        {/* Slash command menu */}
        {isSlashCommandActive && filteredCommands.length > 0 && (
          <div className="absolute top-full mt-2 w-full bg-gray-800 border border-gray-700 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
            {filteredCommands.map((command, index) => (
              <div
                key={command.name}
                className={`p-2 hover:bg-gray-700 cursor-pointer ${index === selectedCommandIndex ? "bg-gray-700" : ""}`}
                onClick={() => {
                  executeCommand(command.name);
                }}
              >
                <div className="font-medium text-white">{command.name}</div>
                <div className="text-xs text-gray-400">
                  {command.description}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Input field styled like KREA's */}
        <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-800 rounded-lg overflow-hidden">
          <Textarea
            ref={inputRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyboardEvent}
            placeholder="Describe what you want to create..."
            className="w-full min-h-[60px] bg-transparent text-white p-4 resize-none focus:outline-none text-base placeholder-gray-500 border-0"
            disabled={isLoading}
          />

          {/* Model selector and action buttons */}
          <div className="flex flex-wrap items-center justify-between px-4 py-2 border-t border-gray-800">
            {/* Left side - Model selector */}
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-500">Model</span>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 flex items-center space-x-1 bg-transparent border border-gray-700 rounded px-2 py-1 text-sm hover:bg-gray-800 transition-colors"
                  >
                    <span className="text-white">
                      {selectedModel === "openai"
                        ? "OpenAI"
                        : selectedModel === "anthropic"
                          ? "Anthropic"
                          : "Gemini"}
                    </span>
                    <ChevronUp className="h-3 w-3 text-gray-400" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-[200px] bg-gray-800 border border-gray-700 p-0"
                  align="start"
                >
                  <div className="p-1">
                    <Button
                      variant={selectedModel === "openai" ? "default" : "ghost"}
                      size="sm"
                      className="w-full justify-start text-white hover:bg-gray-700"
                      onClick={() => onModelChange("openai")}
                    >
                      OpenAI
                    </Button>
                    <Button
                      variant={
                        selectedModel === "anthropic" ? "default" : "ghost"
                      }
                      size="sm"
                      className="w-full justify-start text-white hover:bg-gray-700"
                      onClick={() => onModelChange("anthropic")}
                    >
                      Anthropic
                    </Button>
                    <Button
                      variant={selectedModel === "gemini" ? "default" : "ghost"}
                      size="sm"
                      className="w-full justify-start text-white hover:bg-gray-700"
                      onClick={() => onModelChange("gemini")}
                    >
                      Gemini
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            {/* Right side - Action buttons */}
            <div className="flex items-center mt-2 sm:mt-0 space-x-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-lg bg-transparent border border-gray-700 hover:bg-gray-800"
                  >
                    <ImageIcon className="h-4 w-4 text-gray-400" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-[400px] p-0 bg-gray-800 border border-gray-700"
                  align="end"
                >
                  <Tabs defaultValue="image">
                    <TabsList className="w-full bg-gray-900">
                      <TabsTrigger
                        value="image"
                        className="flex-1 text-gray-300 data-[state=active]:bg-gray-800 data-[state=active]:text-white"
                      >
                        Image Generation
                      </TabsTrigger>
                      <TabsTrigger
                        value="models"
                        className="flex-1 text-gray-300 data-[state=active]:bg-gray-800 data-[state=active]:text-white"
                      >
                        Models
                      </TabsTrigger>
                      <TabsTrigger
                        value="settings"
                        className="flex-1 text-gray-300 data-[state=active]:bg-gray-800 data-[state=active]:text-white"
                      >
                        Settings
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="image" className="p-4">
                      <div className="grid grid-cols-2 gap-4">
                        {imagePresets.map((preset) => (
                          <div
                            key={preset.id}
                            className="border border-gray-700 rounded-lg overflow-hidden cursor-pointer hover:border-blue-500 transition-colors"
                            onClick={() => handlePresetClick(preset)}
                          >
                            <div className="h-32 overflow-hidden">
                              <img
                                src={preset.image}
                                alt={preset.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="p-3 bg-gray-900">
                              <h3 className="font-medium text-white">
                                {preset.name}
                              </h3>
                              <p className="text-xs text-gray-400">
                                {preset.description}
                              </p>
                            </div>
                            <div className="p-2 bg-gray-800 flex justify-end">
                              <Button
                                size="sm"
                                variant="secondary"
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                              >
                                Try
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                    <TabsContent value="models" className="p-4">
                      <h3 className="text-sm font-medium text-white mb-3">
                        Image Generation Models
                      </h3>
                      <div className="space-y-2 mb-4">
                        {imageModels.map((model) => (
                          <div
                            key={model.id}
                            className="flex items-center justify-between p-2 bg-gray-900 rounded-md hover:bg-gray-800 cursor-pointer"
                          >
                            <div>
                              <div className="font-medium text-white">
                                {model.name}
                              </div>
                              <div className="text-xs text-gray-400">
                                {model.provider}
                              </div>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-gray-700 hover:bg-gray-700"
                            >
                              Select
                            </Button>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                    <TabsContent value="settings" className="p-4">
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-2">
                            <label className="text-sm font-medium text-white">
                              Aspect Ratio
                            </label>
                            <span className="text-xs text-gray-400">
                              {aspectRatio}
                            </span>
                          </div>
                          <Select
                            value={aspectRatio}
                            onValueChange={setAspectRatio}
                          >
                            <SelectTrigger className="w-full bg-gray-900 border-gray-700">
                              <SelectValue placeholder="Select aspect ratio" />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-800 border-gray-700">
                              <SelectItem value="1:1">Square (1:1)</SelectItem>
                              <SelectItem value="16:9">
                                Landscape (16:9)
                              </SelectItem>
                              <SelectItem value="9:16">
                                Portrait (9:16)
                              </SelectItem>
                              <SelectItem value="4:3">
                                Standard (4:3)
                              </SelectItem>
                              <SelectItem value="3:2">Photo (3:2)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <div className="flex justify-between mb-2">
                            <label className="text-sm font-medium text-white">
                              Quality
                            </label>
                            <span className="text-xs text-gray-400">
                              {quality}
                            </span>
                          </div>
                          <Select value={quality} onValueChange={setQuality}>
                            <SelectTrigger className="w-full bg-gray-900 border-gray-700">
                              <SelectValue placeholder="Select quality" />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-800 border-gray-700">
                              <SelectItem value="standard">Standard</SelectItem>
                              <SelectItem value="hd">HD</SelectItem>
                              <SelectItem value="ultra-hd">Ultra HD</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <div className="flex justify-between mb-2">
                            <label className="text-sm font-medium text-white">
                              Style
                            </label>
                            <span className="text-xs text-gray-400">
                              {style}
                            </span>
                          </div>
                          <Select value={style} onValueChange={setStyle}>
                            <SelectTrigger className="w-full bg-gray-900 border-gray-700">
                              <SelectValue placeholder="Select style" />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-800 border-gray-700">
                              <SelectItem value="vivid">Vivid</SelectItem>
                              <SelectItem value="natural">Natural</SelectItem>
                              <SelectItem value="cinematic">
                                Cinematic
                              </SelectItem>
                              <SelectItem value="anime">Anime</SelectItem>
                              <SelectItem value="digital-art">
                                Digital Art
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-lg bg-transparent border border-gray-700 hover:bg-gray-800"
                  >
                    <Video className="h-4 w-4 text-gray-400" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-[400px] p-0 bg-gray-800 border border-gray-700"
                  align="end"
                >
                  <Tabs defaultValue="video">
                    <TabsList className="w-full bg-gray-900">
                      <TabsTrigger
                        value="video"
                        className="flex-1 text-gray-300 data-[state=active]:bg-gray-800 data-[state=active]:text-white"
                      >
                        Video Generation
                      </TabsTrigger>
                      <TabsTrigger
                        value="models"
                        className="flex-1 text-gray-300 data-[state=active]:bg-gray-800 data-[state=active]:text-white"
                      >
                        Models
                      </TabsTrigger>
                      <TabsTrigger
                        value="settings"
                        className="flex-1 text-gray-300 data-[state=active]:bg-gray-800 data-[state=active]:text-white"
                      >
                        Settings
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="video" className="p-4">
                      <div className="grid grid-cols-2 gap-4">
                        {videoPresets.map((preset) => (
                          <div
                            key={preset.id}
                            className="border border-gray-700 rounded-lg overflow-hidden cursor-pointer hover:border-purple-500 transition-colors"
                            onClick={() => handlePresetClick(preset)}
                          >
                            <div className="h-32 overflow-hidden">
                              <img
                                src={preset.image}
                                alt={preset.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="p-3 bg-gray-900">
                              <h3 className="font-medium text-white">
                                {preset.name}
                              </h3>
                              <p className="text-xs text-gray-400">
                                {preset.description}
                              </p>
                            </div>
                            <div className="p-2 bg-gray-800 flex justify-end">
                              <Button
                                size="sm"
                                variant="secondary"
                                className="bg-purple-600 hover:bg-purple-700 text-white"
                              >
                                Try
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                    <TabsContent value="models" className="p-4">
                      <h3 className="text-sm font-medium text-white mb-3">
                        Video Generation Models
                      </h3>
                      <div className="space-y-2 mb-4">
                        {videoModels.map((model) => (
                          <div
                            key={model.id}
                            className="flex items-center justify-between p-2 bg-gray-900 rounded-md hover:bg-gray-800 cursor-pointer"
                          >
                            <div>
                              <div className="font-medium text-white">
                                {model.name}
                              </div>
                              <div className="text-xs text-gray-400">
                                {model.provider}
                              </div>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-gray-700 hover:bg-gray-700"
                            >
                              Select
                            </Button>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                    <TabsContent value="settings" className="p-4">
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-2">
                            <label className="text-sm font-medium text-white">
                              Duration
                            </label>
                            <span className="text-xs text-gray-400">
                              5 seconds
                            </span>
                          </div>
                          <Slider
                            defaultValue={[5]}
                            max={30}
                            min={1}
                            step={1}
                            className="w-full"
                          />
                        </div>

                        <div>
                          <div className="flex justify-between mb-2">
                            <label className="text-sm font-medium text-white">
                              Frame Rate
                            </label>
                            <span className="text-xs text-gray-400">
                              24 fps
                            </span>
                          </div>
                          <Select defaultValue="24">
                            <SelectTrigger className="w-full bg-gray-900 border-gray-700">
                              <SelectValue placeholder="Select frame rate" />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-800 border-gray-700">
                              <SelectItem value="24">24 fps (Film)</SelectItem>
                              <SelectItem value="30">
                                30 fps (Standard)
                              </SelectItem>
                              <SelectItem value="60">
                                60 fps (Smooth)
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <div className="flex justify-between mb-2">
                            <label className="text-sm font-medium text-white">
                              Resolution
                            </label>
                            <span className="text-xs text-gray-400">1080p</span>
                          </div>
                          <Select defaultValue="1080p">
                            <SelectTrigger className="w-full bg-gray-900 border-gray-700">
                              <SelectValue placeholder="Select resolution" />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-800 border-gray-700">
                              <SelectItem value="720p">720p</SelectItem>
                              <SelectItem value="1080p">1080p</SelectItem>
                              <SelectItem value="4k">4K</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-lg bg-transparent border border-gray-700 hover:bg-gray-800"
                  >
                    <Settings className="h-4 w-4 text-gray-400" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-[300px] bg-gray-800 border border-gray-700"
                  align="end"
                >
                  <div className="space-y-4 p-4">
                    <h4 className="font-medium text-white text-sm mb-3">
                      Advanced Settings
                    </h4>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <label className="text-sm text-gray-300">
                          Temperature
                        </label>
                        <span className="text-xs text-gray-400">
                          {temperature.toFixed(1)}
                        </span>
                      </div>
                      <Slider
                        value={[temperature]}
                        min={0}
                        max={1}
                        step={0.1}
                        onValueChange={(value) => setTemperature(value[0])}
                        className="w-full"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Controls randomness: lower values are more
                        deterministic.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <label className="text-sm text-gray-300">
                          Max Tokens
                        </label>
                        <span className="text-xs text-gray-400">
                          {maxTokens}
                        </span>
                      </div>
                      <Slider
                        value={[maxTokens]}
                        min={100}
                        max={2000}
                        step={100}
                        onValueChange={(value) => setMaxTokens(value[0])}
                        className="w-full"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Maximum length of generated text.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <label className="text-sm text-gray-300">Top P</label>
                        <span className="text-xs text-gray-400">
                          {topP.toFixed(1)}
                        </span>
                      </div>
                      <Slider
                        value={[topP]}
                        min={0.1}
                        max={1}
                        step={0.1}
                        onValueChange={(value) => setTopP(value[0])}
                        className="w-full"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Controls diversity via nucleus sampling.
                      </p>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              <Button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className={`h-8 px-4 py-1.5 rounded-md flex items-center space-x-1 transition-colors ${isLoading || !input.trim() ? "bg-blue-700/50 text-blue-200/50 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-500 text-white"}`}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-1" />
                ) : (
                  <Send className="h-4 w-4 mr-1" />
                )}
                <span>Generate</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Sample prompts chips */}
        <div className="mt-3 flex flex-wrap gap-2">
          {samplePrompts.map((prompt, i) => (
            <button
              key={i}
              className="text-xs px-3 py-1.5 bg-white/5 hover:bg-white/10 text-gray-300 rounded-full transition-all duration-200 hover:scale-105 active:scale-95"
              onClick={() => handleSamplePromptClick(prompt)}
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
