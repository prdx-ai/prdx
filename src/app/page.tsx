"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Hero from "@/components/hero";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default function Home() {
  const [inputValue, setInputValue] = useState("");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const router = useRouter();

  useEffect(() => {
    // Apply the dark mode class to the document root
    document.documentElement.classList.add("dark");
  }, []);

  const handleInputSubmit = () => {
    if (!inputValue.trim()) return;

    // Show transition animation
    setIsTransitioning(true);

    // Store the input in localStorage for the chat page
    localStorage.setItem("initialPrompt", inputValue);

    // Navigate to dashboard after short delay for animation
    setTimeout(() => {
      router.push("/dashboard");
    }, 800);
  };

  // Sample prompts for suggestions
  const samplePrompts = [
    "Futuristic cityscape",
    "Cyberpunk character",
    "Fantasy landscape",
    "Space station",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <Navbar />
      <Hero />

      {/* KREA-style hero with centered prompt */}
      <div className="flex flex-col items-center justify-center min-h-screen p-4 relative">
        {/* Background blur and gradient effects */}
        <div className="absolute inset-0 bg-black opacity-90 z-0"></div>
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10 z-0"></div>

        {/* Subtle glow effects */}
        <div className="absolute top-1/4 left-1/4 w-1/2 h-1/4 bg-blue-500/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-1/2 h-1/4 bg-purple-500/10 rounded-full blur-[100px]"></div>

        {/* Content container */}
        <div className="z-10 w-full max-w-4xl mx-auto flex flex-col items-center">
          {/* Logo/Brand Tag */}
          <motion.div
            className="mb-8 bg-white/5 backdrop-blur-sm border border-white/10 px-4 py-1 rounded-md"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-white uppercase text-sm tracking-widest">
              POWERED BY AI
            </span>
          </motion.div>

          {/* Main Title */}
          <div className="text-center mb-12">
            <motion.h1
              className="text-2xl md:text-4xl lg:text-5xl font-bold mb-4 theme-transition"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Paradox uses advanced AI to generate stunning
              <span className="theme-transition bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient-x">
                {" "}
                images and videos
              </span>
            </motion.h1>
            <motion.p
              className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Start a conversation and bring your imagination to life with our
              intelligent tools.
            </motion.p>
          </div>

          {/* Main Input Box */}
          <motion.div
            className="w-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="relative">
              {/* Input field styled like KREA's */}
              <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-800 rounded-lg overflow-hidden">
                <textarea
                  className="w-full h-24 bg-transparent text-white p-4 resize-none focus:outline-none text-lg placeholder-gray-500"
                  placeholder="Describe what you want to create..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleInputSubmit();
                    }
                  }}
                  ref={inputRef}
                ></textarea>

                {/* Action buttons */}
                <div className="flex flex-wrap items-center justify-between px-4 py-2 border-t border-gray-800">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500">
                      Start creating with AI
                    </span>
                  </div>

                  <Button
                    onClick={handleInputSubmit}
                    disabled={isTransitioning || !inputValue.trim()}
                    className={`px-4 py-1.5 rounded-md flex items-center space-x-1 transition-colors ${isTransitioning || !inputValue.trim() ? "bg-blue-700/50 text-blue-200/50 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-500 text-white"}`}
                  >
                    {isTransitioning ? (
                      <span className="animate-spin mr-2">⟳</span>
                    ) : (
                      <ArrowRight className="h-4 w-4 mr-1" />
                    )}
                    <span>Generate</span>
                  </Button>
                </div>
              </div>
            </div>

            {/* Sample prompts chips */}
            <div className="mt-3 flex flex-wrap justify-center gap-2">
              {samplePrompts.map((prompt, i) => (
                <motion.button
                  key={i}
                  className="text-xs px-3 py-1.5 bg-white/5 hover:bg-white/10 text-gray-300 rounded-full transition-all duration-200 hover:scale-105 active:scale-95"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 + i * 0.1 }}
                  onClick={() =>
                    setInputValue(
                      `Create a ${prompt.toLowerCase()} with stunning details`,
                    )
                  }
                >
                  {prompt}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />

      {/* Futuristic transitioning overlay */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            className="fixed inset-0 bg-gray-950 z-50 flex items-center justify-center overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Background effects */}
            <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-cyan-500/30 to-purple-600/20 animate-gradient-x" />
            </div>

            {/* Light beams */}
            <div className="absolute top-0 left-1/2 w-px h-screen bg-gradient-to-b from-blue-500 to-transparent opacity-50 animate-pulse" />
            <div className="absolute top-1/2 left-0 h-px w-screen bg-gradient-to-r from-transparent to-purple-500 opacity-50 animate-pulse" />

            {/* Central element */}
            <div className="relative z-10">
              <div className="relative animate-spin-slow">
                <div className="absolute -inset-16 rounded-full border border-blue-500/30 opacity-50" />
                <div className="absolute -inset-12 rounded-full border border-cyan-500/40 opacity-50" />
                <div className="absolute -inset-8 rounded-full border border-purple-500/30 opacity-50" />
              </div>

              <div className="relative bg-black/30 backdrop-blur-md p-6 rounded-2xl border border-white/10 flex flex-col items-center justify-center gap-4 animate-fade-in">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 via-cyan-500 to-purple-500 flex items-center justify-center animate-pulse">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>

                <h3 className="text-xl text-white font-medium animate-fade-in">
                  Initializing Your Creation
                </h3>

                <div className="flex space-x-2 mt-2 animate-fade-in">
                  <span className="h-2 w-2 bg-blue-500 rounded-full animate-pulse"></span>
                  <span className="h-2 w-2 bg-blue-500 rounded-full animate-pulse delay-150"></span>
                  <span className="h-2 w-2 bg-blue-500 rounded-full animate-pulse delay-300"></span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
