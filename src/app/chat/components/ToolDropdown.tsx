/**
 * Tool dropdown component for selecting tools
 */

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tool } from "@/lib/tools";
import { Wand2, Image, Video, Sparkles } from "lucide-react";

type ToolDropdownProps = {
  tools: Tool[];
  onSelectTool: (toolName: string) => void;
};

export default function ToolDropdown({
  tools,
  onSelectTool,
}: ToolDropdownProps) {
  const [open, setOpen] = useState(false);

  const imageTools = tools.filter(
    (tool) => tool.category === "image-generation",
  );
  const videoTools = tools.filter(
    (tool) => tool.category === "video-generation",
  );
  const otherTools = tools.filter(
    (tool) =>
      tool.category !== "image-generation" &&
      tool.category !== "video-generation",
  );

  const handleSelectTool = (toolName: string) => {
    onSelectTool(toolName);
    setOpen(false);
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Wand2 className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Select a Tool</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {imageTools.length > 0 && (
          <DropdownMenuGroup>
            <DropdownMenuLabel className="flex items-center">
              <Image className="h-4 w-4 mr-2" />
              Image Generation
            </DropdownMenuLabel>
            {imageTools.map((tool) => (
              <DropdownMenuItem
                key={tool.name}
                onClick={() => handleSelectTool(tool.name)}
              >
                {tool.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        )}

        {videoTools.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuLabel className="flex items-center">
                <Video className="h-4 w-4 mr-2" />
                Video Generation
              </DropdownMenuLabel>
              {videoTools.map((tool) => (
                <DropdownMenuItem
                  key={tool.name}
                  onClick={() => handleSelectTool(tool.name)}
                >
                  {tool.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </>
        )}

        {otherTools.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuLabel className="flex items-center">
                <Sparkles className="h-4 w-4 mr-2" />
                Other Tools
              </DropdownMenuLabel>
              {otherTools.map((tool) => (
                <DropdownMenuItem
                  key={tool.name}
                  onClick={() => handleSelectTool(tool.name)}
                >
                  {tool.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
