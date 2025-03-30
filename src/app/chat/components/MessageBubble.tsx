/**
 * Message bubble component for displaying individual messages
 */

"use client";

import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

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

type MessageBubbleProps = {
  message: Message;
};

export default function MessageBubble({ message }: MessageBubbleProps) {
  return (
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
  );
}
