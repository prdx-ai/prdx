"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
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
  Share2,
  Lock,
  Unlock,
  MessageSquare,
  Image as ImageIcon,
  Video,
  Layers,
  Shield,
  ArrowUpRight,
  Grid3X3,
  ChevronRight,
  ChevronLeft,
  Folder,
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

// Features data for the feature section
const featuresData = [
  {
    title: "Text to Image",
    description:
      "Describe any scene, character, or concept, and our AI will generate a corresponding image.",
    icon: <ImageIcon className="h-5 w-5" />,
    color: "blue",
  },
  {
    title: "Image to Video",
    description:
      "Transform your generated images into short animated clips with our video pipeline.",
    icon: <Video className="h-5 w-5" />,
    color: "purple",
  },
  {
    title: "Multiple Models",
    description:
      "Choose from a variety of AI models to get the perfect style for your creative needs.",
    icon: <Layers className="h-5 w-5" />,
    color: "green",
  },
  {
    title: "Social Sharing",
    description:
      "Share your creations with the community and get inspired by others' work.",
    icon: <Share2 className="h-5 w-5" />,
    color: "red",
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
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [isPrivate, setIsPrivate] = useState(true);
  const [showFeatures, setShowFeatures] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const router = useRouter();

  // Check for initial prompt from landing page
  useEffect(() => {
    const initialPrompt = localStorage.getItem("initialPrompt");
    if (initialPrompt) {
      // Send the initial prompt
      sendMessage(initialPrompt);
      // Clear it from localStorage to prevent sending it again on refresh
      localStorage.removeItem("initialPrompt");
    }

    // Apply dark mode class for consistent styling
    document.documentElement.classList.add("dark");

    // Focus the input field on load
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [sendMessage]);

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

  const togglePrivacy = () => {
    setIsPrivate(!isPrivate);
    // Here you would implement the actual privacy change logic
  };

  const shareConversation = () => {
    // Implement sharing functionality
    const shareUrl = `${window.location.origin}/shared/${Date.now()}`;
    navigator.clipboard.writeText(shareUrl);
    alert("Share link copied to clipboard!");
  };

  const toggleSidebar = () => {
    setSidebarExpanded(!sidebarExpanded);
  };

  return (
    <div className="flex h-screen bg-gray-950 text-white">
      {/* Enhanced Sidebar with smooth animation */}
      <motion.div
        className={`flex flex-col border-r border-gray-800 bg-gray-900 items-center py-4 relative`}
        initial={{ width: 72 }}
        animate={{ width: sidebarExpanded ? 240 : 72 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="absolute top-6 -right-3 z-10">
          <Button
            variant="outline"
            size="icon"
            className="h-6 w-6 rounded-full bg-gray-800 border border-gray-700 hover:bg-gray-700"
            onClick={toggleSidebar}
          >
            {sidebarExpanded ? (
              <ChevronLeft className="h-3 w-3 text-gray-400" />
            ) : (
              <ChevronRight className="h-3 w-3 text-gray-400" />
            )}
          </Button>
        </div>

        <Link href="/" className="mb-6 flex items-center justify-center">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <motion.span
            className="ml-3 font-bold text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: sidebarExpanded ? 1 : 0 }}
            transition={{ duration: 0.2 }}
          >
            Paradox AI
          </motion.span>
        </Link>

        <div className="flex flex-col space-y-2 w-full px-3">
          <Button
            variant="ghost"
            className={`rounded-lg justify-start hover:bg-gray-800 ${sidebarExpanded ? "px-3" : "px-0 justify-center"}`}
            asChild
          >
            <Link href="/">
              <Home className="h-5 w-5 min-w-5" />
              <motion.span
                className="ml-3"
                initial={{ opacity: 0, width: 0 }}
                animate={{
                  opacity: sidebarExpanded ? 1 : 0,
                  width: sidebarExpanded ? "auto" : 0,
                }}
                transition={{ duration: 0.2 }}
              >
                Home
              </motion.span>
            </Link>
          </Button>

          <Button
            variant="secondary"
            className={`rounded-lg justify-start bg-gray-800 ${sidebarExpanded ? "px-3" : "px-0 justify-center"}`}
          >
            <MessageSquare className="h-5 w-5 min-w-5" />
            <motion.span
              className="ml-3"
              initial={{ opacity: 0, width: 0 }}
              animate={{
                opacity: sidebarExpanded ? 1 : 0,
                width: sidebarExpanded ? "auto" : 0,
              }}
              transition={{ duration: 0.2 }}
            >
              Chat
            </motion.span>
          </Button>

          <Button
            variant="ghost"
            className={`rounded-lg justify-start hover:bg-gray-800 ${sidebarExpanded ? "px-3" : "px-0 justify-center"}`}
            asChild
          >
            <Link href="/dashboard">
              <Grid3X3 className="h-5 w-5 min-w-5" />
              <motion.span
                className="ml-3"
                initial={{ opacity: 0, width: 0 }}
                animate={{
                  opacity: sidebarExpanded ? 1 : 0,
                  width: sidebarExpanded ? "auto" : 0,
                }}
                transition={{ duration: 0.2 }}
              >
                Dashboard
              </motion.span>
            </Link>
          </Button>

          <Button
            variant="ghost"
            className={`rounded-lg justify-start hover:bg-gray-800 ${sidebarExpanded ? "px-3" : "px-0 justify-center"}`}
          >
            <ImageIcon className="h-5 w-5 min-w-5" />
            <motion.span
              className="ml-3"
              initial={{ opacity: 0, width: 0 }}
              animate={{
                opacity: sidebarExpanded ? 1 : 0,
                width: sidebarExpanded ? "auto" : 0,
              }}
              transition={{ duration: 0.2 }}
            >
              Gallery
            </motion.span>
          </Button>

          <Button
            variant="ghost"
            className={`rounded-lg justify-start hover:bg-gray-800 ${sidebarExpanded ? "px-3" : "px-0 justify-center"}`}
            onClick={() => setShowFeatures(!showFeatures)}
          >
            <Zap className="h-5 w-5 min-w-5" />
            <motion.span
              className="ml-3"
              initial={{ opacity: 0, width: 0 }}
              animate={{
                opacity: sidebarExpanded ? 1 : 0,
                width: sidebarExpanded ? "auto" : 0,
              }}
              transition={{ duration: 0.2 }}
            >
              Features
            </motion.span>
          </Button>

          <Button
            variant="ghost"
            className={`rounded-lg justify-start hover:bg-gray-800 ${sidebarExpanded ? "px-3" : "px-0 justify-center"}`}
          >
            <Folder className="h-5 w-5 min-w-5" />
            <motion.span
              className="ml-3"
              initial={{ opacity: 0, width: 0 }}
              animate={{
                opacity: sidebarExpanded ? 1 : 0,
                width: sidebarExpanded ? "auto" : 0,
              }}
              transition={{ duration: 0.2 }}
            >
              Collections
            </motion.span>
          </Button>
        </div>

        <div className="flex-1"></div>

        <div className="flex flex-col space-y-2 w-full px-3 mt-4">
          <Button
            variant="ghost"
            className={`rounded-lg justify-start hover:bg-gray-800 ${sidebarExpanded ? "px-3" : "px-0 justify-center"}`}
          >
            <UserCircle className="h-5 w-5 min-w-5" />
            <motion.span
              className="ml-3"
              initial={{ opacity: 0, width: 0 }}
              animate={{
                opacity: sidebarExpanded ? 1 : 0,
                width: sidebarExpanded ? "auto" : 0,
              }}
              transition={{ duration: 0.2 }}
            >
              Profile
            </motion.span>
          </Button>

          <Button
            variant="ghost"
            className={`rounded-lg justify-start hover:bg-gray-800 ${sidebarExpanded ? "px-3" : "px-0 justify-center"}`}
          >
            <Settings className="h-5 w-5 min-w-5" />
            <motion.span
              className="ml-3"
              initial={{ opacity: 0, width: 0 }}
              animate={{
                opacity: sidebarExpanded ? 1 : 0,
                width: sidebarExpanded ? "auto" : 0,
              }}
              transition={{ duration: 0.2 }}
            >
              Settings
            </motion.span>
          </Button>
        </div>
      </motion.div>

      {/* Main content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Background effects */}
        <div className="absolute inset-0 bg-black opacity-90 z-0"></div>
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10 z-0"></div>

        {/* Subtle glow effects */}
        <div className="absolute top-1/4 left-1/4 w-1/2 h-1/4 bg-blue-500/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-1/2 h-1/4 bg-purple-500/10 rounded-full blur-[100px]"></div>

        {/* Chat Input at the top */}
        <div className="relative z-10 p-4 border-b border-gray-800 bg-gray-900/60 backdrop-blur-sm">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-2">
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  className="text-sm font-normal"
                  size="sm"
                  asChild
                >
                  <Link href="/">Home</Link>
                </Button>
                <Button
                  variant="secondary"
                  className="text-sm font-normal"
                  size="sm"
                >
                  Chat
                </Button>
                <Button
                  variant="ghost"
                  className="text-sm font-normal"
                  size="sm"
                  asChild
                >
                  <Link href="/dashboard">Dashboard</Link>
                </Button>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={togglePrivacy}
                  className="text-xs flex items-center gap-1 border-gray-700 bg-gray-800/50"
                >
                  {isPrivate ? (
                    <>
                      <Lock className="h-3 w-3" /> Private
                    </>
                  ) : (
                    <>
                      <Unlock className="h-3 w-3" /> Public
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={shareConversation}
                  className="text-xs flex items-center gap-1 border-gray-700 bg-gray-800/50"
                >
                  <Share2 className="h-3 w-3" /> Share
                </Button>
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

            <ChatInput
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
              onClearChat={clearChat}
              imagePresets={imagePresets}
              videoPresets={videoPresets}
              selectedModel={selectedModel}
              onModelChange={changeModel}
              inputRef={inputRef}
            />
          </div>
        </div>

        {/* Messages container */}
        <div className="flex-1 relative z-10">
          <MessageList messages={messages} isLoading={isLoading} />
        </div>

        {/* Features overlay - conditionally rendered */}
        {showFeatures && (
          <div className="absolute inset-0 bg-gray-950/90 z-20 backdrop-blur-sm flex items-center justify-center p-6 animate-fade-in">
            <div className="max-w-4xl w-full bg-gray-900/80 rounded-xl border border-gray-800 p-8 shadow-xl">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Powerful Creation Tools
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFeatures(false)}
                >
                  Close
                </Button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {featuresData.map((feature, index) => (
                  <div key={index} className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl opacity-0 group-hover:opacity-70 blur transition duration-500"></div>

                    <div className="relative h-full bg-gray-900/80 backdrop-blur-sm p-6 rounded-xl border border-gray-800 group-hover:border-blue-500/50 transition-all duration-300">
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gray-800 border border-gray-700 group-hover:border-blue-500/50 transition-colors duration-300">
                          {feature.icon}
                        </div>
                      </div>

                      <h3 className="text-lg font-semibold mb-2 text-white group-hover:text-blue-200 transition-colors duration-300">
                        {feature.title}
                      </h3>
                      <p className="text-gray-400 group-hover:text-gray-200 transition-colors duration-300 text-sm">
                        {feature.description}
                      </p>

                      <div className="mt-4 pt-3 border-t border-gray-800 group-hover:border-blue-900/30 transition-colors duration-300">
                        <div className="flex items-center justify-between text-sm text-gray-500 group-hover:text-blue-300 transition-colors duration-300">
                          <span>Try it now</span>
                          <ArrowUpRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-300" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
