"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import {
  Send,
  Image as ImageIcon,
  Loader2,
  Download,
  Trash2,
  Video,
  ChevronUp,
  Sparkles,
  Home,
  PanelLeft,
  Settings,
  LayoutGrid,
  Palette,
  Wand2,
  Zap,
  MoreHorizontal,
  UserCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar } from "./ui/avatar";
import { SystemPromptTemplate, getAllSystemPrompts } from "@/lib/systemPrompt";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

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

type ChatUIProps = {
  initialMessages?: Message[];
  onSendMessage?: (message: string) => Promise<void>;
  systemPrompts?: SystemPromptTemplate[];
  selectedSystemPrompt?: string;
  onSystemPromptChange?: (promptId: string) => void;
};

type GenerationPreset = {
  id: string;
  name: string;
  description: string;
  image: string;
  type: "image" | "video";
};

const imagePresets: GenerationPreset[] = [
  {
    id: "black-and-white",
    name: "Black and white",
    description: "Generate stunning full frame landscapes.",
    image:
      "https://images.unsplash.com/photo-1573455494060-c5595004fb6c?w=800&q=80",
    type: "image",
  },
  {
    id: "medieval-warrior",
    name: "Medieval warrior",
    description: "Dark portraits.",
    image:
      "https://images.unsplash.com/photo-1560419015-7c427e8ae5ba?w=800&q=80",
    type: "image",
  },
  {
    id: "space",
    name: "Space",
    description: "Make images of spiral galaxies.",
    image:
      "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=800&q=80",
    type: "image",
  },
  {
    id: "animal-hybrids",
    name: "Animal Hybrids",
    description: "Lions with duck faces?",
    image:
      "https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=800&q=80",
    type: "image",
  },
  {
    id: "line-sketch",
    name: "Line sketch",
    description: "Minimalist sketches.",
    image:
      "https://images.unsplash.com/photo-1572883454114-1cf0031ede2a?w=800&q=80",
    type: "image",
  },
  {
    id: "phone-wallpaper",
    name: "Phone wallpaper",
    description: "Random phone backgrounds.",
    image:
      "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&q=80",
    type: "image",
  },
];

const videoPresets: GenerationPreset[] = [
  {
    id: "cinematic",
    name: "Cinematic",
    description: "Movie-like quality videos.",
    image:
      "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&q=80",
    type: "video",
  },
  {
    id: "animation",
    name: "Animation",
    description: "Animated style videos.",
    image:
      "https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2?w=800&q=80",
    type: "video",
  },
];

export default function ChatUI({
  initialMessages = [],
  onSendMessage,
  systemPrompts = getAllSystemPrompts(),
  selectedSystemPrompt = "default",
  onSystemPromptChange,
}: ChatUIProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState("openai");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (preset?: GenerationPreset) => {
    if (!input.trim() && !preset) return;

    let messageContent = input;
    if (preset) {
      messageContent = `Generate a ${preset.type} in the style of ${preset.name}: ${input || preset.description}`;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: messageContent,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Send message to API
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: messageContent,
          history: messages,
          systemPromptId: preset
            ? preset.type === "image"
              ? "image-generation"
              : "video-generation"
            : selectedSystemPrompt,
          model: selectedModel,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      const data = await response.json();

      const assistantMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: data.text || "",
        timestamp: new Date(),
        media: data.media,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      // Add error message
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "assistant",
          content: "Sorry, there was an error processing your request.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  const handlePresetClick = (preset: GenerationPreset) => {
    handleSendMessage(preset);
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
          <LayoutGrid className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Wand2 className="h-5 w-5" />
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
        <div className="flex items-center justify-center border-b py-3 px-4">
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
            <Button variant="ghost" className="text-sm font-normal" size="sm">
              Generate
            </Button>
            <Button variant="ghost" className="text-sm font-normal" size="sm">
              Edit
            </Button>
            <Button variant="ghost" className="text-sm font-normal" size="sm">
              Enhance
            </Button>
            <Button variant="ghost" className="text-sm font-normal" size="sm">
              Train
            </Button>
            <Button variant="ghost" className="text-sm font-normal" size="sm">
              Assets
            </Button>
          </div>
          <div className="absolute right-4 flex space-x-2">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full h-8 w-8"
            >
              <div className="h-full w-full rounded-full bg-orange-400"></div>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full h-8 w-8"
            >
              <div className="h-full w-full rounded-full bg-purple-500"></div>
            </Button>
          </div>
        </div>

        {/* Messages container */}
        <div className="flex-1 overflow-y-auto py-4 px-4 md:px-8 lg:px-16 xl:px-32 space-y-6">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <ImageIcon className="h-12 w-12 mb-4 opacity-50" />
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
              <div
                className={cn(
                  "rounded-lg p-4 w-full",
                  message.role === "user"
                    ? "bg-primary/10 text-foreground"
                    : "bg-card border",
                )}
              >
                <div className="flex items-start gap-2 mb-2">
                  <Avatar className="h-6 w-6">
                    {message.role === "user" ? (
                      <div className="bg-primary text-primary-foreground flex items-center justify-center h-full w-full text-xs">
                        U
                      </div>
                    ) : (
                      <div className="bg-secondary text-secondary-foreground flex items-center justify-center h-full w-full text-xs">
                        AI
                      </div>
                    )}
                  </Avatar>
                  <span className="text-xs opacity-70">
                    {message.timestamp.toLocaleTimeString()}
                  </span>
                </div>
                <div className="whitespace-pre-wrap">{message.content}</div>

                {/* Media content */}
                {message.media && message.media.length > 0 && (
                  <div className="mt-3 space-y-3">
                    {message.media.map((item, index) => (
                      <div key={index} className="rounded-md overflow-hidden">
                        {item.type === "image" ? (
                          <div className="relative">
                            <img
                              src={item.url}
                              alt={item.prompt || "Generated image"}
                              className="w-full h-auto rounded-md"
                            />
                            <div className="absolute top-2 right-2 flex gap-1">
                              <Button
                                size="icon"
                                variant="secondary"
                                className="h-8 w-8 opacity-80 hover:opacity-100"
                                onClick={() => window.open(item.url, "_blank")}
                                title="Open in new tab"
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="relative">
                            <video
                              src={item.url}
                              controls
                              className="w-full h-auto rounded-md"
                            />
                            <div className="absolute top-2 right-2 flex gap-1">
                              <Button
                                size="icon"
                                variant="secondary"
                                className="h-8 w-8 opacity-80 hover:opacity-100"
                                onClick={() => window.open(item.url, "_blank")}
                                title="Open in new tab"
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        )}
                        {item.prompt && (
                          <div className="text-xs mt-1 text-muted-foreground">
                            {item.prompt}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex max-w-3xl mx-auto">
              <div className="w-full rounded-lg p-4 bg-card border">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Generating response...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div className="p-4 border-t bg-background">
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Give me a cool illustration for my San Francisco party!"
                className="min-h-[60px] resize-none pr-24 py-4 rounded-xl border-gray-200"
                disabled={isLoading}
              />
              <div className="absolute right-2 bottom-2 flex items-center gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-lg"
                    >
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
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-lg"
                    >
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
                          onClick={() => setSelectedModel("openai")}
                        >
                          OpenAI
                        </Button>
                        <Button
                          variant={
                            selectedModel === "anthropic"
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          className="w-full justify-start"
                          onClick={() => setSelectedModel("anthropic")}
                        >
                          Anthropic
                        </Button>
                        <Button
                          variant={
                            selectedModel === "gemini" ? "default" : "outline"
                          }
                          size="sm"
                          className="w-full justify-start"
                          onClick={() => setSelectedModel("gemini")}
                        >
                          Gemini
                        </Button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
                <Button
                  onClick={() => handleSendMessage()}
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
            <div className="flex justify-end mt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={clearChat}
                className="text-xs text-muted-foreground"
              >
                <Trash2 className="h-3 w-3 mr-1" /> Clear chat
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
