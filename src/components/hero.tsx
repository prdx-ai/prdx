import Link from "next/link";
import { ArrowUpRight, Check, MessageSquare, Image, Video } from "lucide-react";

export default function Hero() {
  return (
    <div className="relative overflow-hidden bg-gray-900">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-gray-900 to-blue-900/20 opacity-80" />

      <div className="relative pt-24 pb-32 sm:pt-32 sm:pb-40">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl sm:text-6xl font-bold text-white mb-8 tracking-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                Paradox
              </span>{" "}
              - Chat to{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                Create
              </span>
            </h1>

            <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
              Transform your ideas into stunning images and videos through our
              AI-powered chat interface. Just describe what you want, and watch
              it come to life.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/dashboard"
                className="inline-flex items-center px-8 py-4 text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors text-lg font-medium"
              >
                Start Creating
                <ArrowUpRight className="ml-2 w-5 h-5" />
              </Link>

              <Link
                href="#pricing"
                className="inline-flex items-center px-8 py-4 text-gray-200 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors text-lg font-medium"
              >
                View Pricing
              </Link>
            </div>

            <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <div className="flex items-center gap-3 bg-gray-800 p-4 rounded-lg border border-gray-700">
                <MessageSquare className="w-8 h-8 text-purple-500" />
                <span className="text-gray-200">Chat-based interface</span>
              </div>
              <div className="flex items-center gap-3 bg-gray-800 p-4 rounded-lg border border-gray-700">
                <Image className="w-8 h-8 text-blue-500" />
                <span className="text-gray-200">Text-to-image generation</span>
              </div>
              <div className="flex items-center gap-3 bg-gray-800 p-4 rounded-lg border border-gray-700">
                <Video className="w-8 h-8 text-purple-500" />
                <span className="text-gray-200">Image-to-video creation</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
