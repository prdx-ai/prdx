"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Sparkles,
  Home,
  MessageSquare,
  Image as ImageIcon,
  Video,
  Settings,
  UserCircle,
  Zap,
  Grid3X3,
  Clock,
  Star,
  Share2,
  Folder,
  PanelLeft,
  ChevronRight,
  ChevronLeft,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function DashboardUI() {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const router = useRouter();

  // Sample data for dashboard
  const recentProjects = [
    {
      id: 1,
      title: "Cyberpunk City",
      type: "image",
      date: "2 hours ago",
      thumbnail:
        "https://images.unsplash.com/photo-1573455494060-c5595004fb6c?w=800&q=80",
      prompt: "A futuristic cyberpunk city with neon lights and flying cars",
    },
    {
      id: 2,
      title: "Space Explorer",
      type: "video",
      date: "Yesterday",
      thumbnail:
        "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=800&q=80",
      prompt: "A spaceship exploring a distant galaxy with colorful nebulas",
    },
    {
      id: 3,
      title: "Fantasy Landscape",
      type: "image",
      date: "3 days ago",
      thumbnail:
        "https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=800&q=80",
      prompt:
        "A magical fantasy landscape with floating islands and waterfalls",
    },
    {
      id: 4,
      title: "Medieval Castle",
      type: "image",
      date: "1 week ago",
      thumbnail:
        "https://images.unsplash.com/photo-1533154683836-84ea7a0bc310?w=800&q=80",
      prompt: "A detailed medieval castle on a hill with surrounding village",
    },
  ];

  const collections = [
    { id: 1, name: "Landscapes", count: 12 },
    { id: 2, name: "Characters", count: 8 },
    { id: 3, name: "Sci-Fi", count: 15 },
    { id: 4, name: "Fantasy", count: 10 },
  ];

  const toggleSidebar = () => {
    setSidebarExpanded(!sidebarExpanded);
  };

  const filteredProjects = recentProjects.filter((project) => {
    if (activeTab !== "all" && project.type !== activeTab) return false;
    if (
      searchQuery &&
      !project.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;
    return true;
  });

  return (
    <div className="flex h-screen bg-gray-950 text-white">
      {/* Animated Sidebar */}
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
            variant="ghost"
            className={`rounded-lg justify-start hover:bg-gray-800 ${sidebarExpanded ? "px-3" : "px-0 justify-center"}`}
            asChild
          >
            <Link href="/chat">
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
            </Link>
          </Button>

          <Button
            variant="secondary"
            className={`rounded-lg justify-start bg-gray-800 ${sidebarExpanded ? "px-3" : "px-0 justify-center"}`}
          >
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
          >
            <Video className="h-5 w-5 min-w-5" />
            <motion.span
              className="ml-3"
              initial={{ opacity: 0, width: 0 }}
              animate={{
                opacity: sidebarExpanded ? 1 : 0,
                width: sidebarExpanded ? "auto" : 0,
              }}
              transition={{ duration: 0.2 }}
            >
              Videos
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

        {/* Dashboard content */}
        <div className="relative z-10 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <div>
                <h1 className="text-2xl font-bold mb-1">Dashboard</h1>
                <p className="text-gray-400">
                  Manage your creations and collections
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Search projects..."
                    className="pl-9 bg-gray-900 border-gray-700 w-[200px] md:w-[300px] text-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  className="border-gray-700 bg-gray-900/60"
                >
                  <Filter className="h-4 w-4" />
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" /> New Project
                </Button>
              </div>
            </div>

            <Tabs
              defaultValue="all"
              className="mb-8"
              onValueChange={setActiveTab}
            >
              <TabsList className="bg-gray-900/60 border border-gray-800">
                <TabsTrigger
                  value="all"
                  className="data-[state=active]:bg-gray-800"
                >
                  All
                </TabsTrigger>
                <TabsTrigger
                  value="image"
                  className="data-[state=active]:bg-gray-800"
                >
                  Images
                </TabsTrigger>
                <TabsTrigger
                  value="video"
                  className="data-[state=active]:bg-gray-800"
                >
                  Videos
                </TabsTrigger>
                <TabsTrigger
                  value="favorites"
                  className="data-[state=active]:bg-gray-800"
                >
                  Favorites
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-10">
              {filteredProjects.map((project) => (
                <Card
                  key={project.id}
                  className="bg-gray-900/60 border-gray-800 overflow-hidden hover:border-gray-700 transition-all group"
                >
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={project.thumbnail}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm rounded-full px-2 py-1 text-xs flex items-center">
                      {project.type === "image" ? (
                        <>
                          <ImageIcon className="h-3 w-3 mr-1" />
                          Image
                        </>
                      ) : (
                        <>
                          <Video className="h-3 w-3 mr-1" />
                          Video
                        </>
                      )}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-white bg-white/10 backdrop-blur-sm hover:bg-white/20"
                      >
                        <Star className="h-3 w-3 mr-1" /> Favorite
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-white bg-white/10 backdrop-blur-sm hover:bg-white/20"
                      >
                        <Share2 className="h-3 w-3 mr-1" /> Share
                      </Button>
                    </div>
                  </div>
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-lg">{project.title}</CardTitle>
                    <CardDescription className="text-gray-400 flex items-center">
                      <Clock className="h-3 w-3 mr-1" /> {project.date}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="text-sm text-gray-300 line-clamp-2">
                      {project.prompt}
                    </p>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 flex justify-between">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-gray-700 hover:bg-gray-800"
                    >
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hover:bg-gray-800"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            <div className="mb-10">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Collections</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-blue-400 hover:text-blue-300"
                >
                  View all
                </Button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {collections.map((collection) => (
                  <Card
                    key={collection.id}
                    className="bg-gray-900/60 border-gray-800 hover:border-gray-700 transition-all"
                  >
                    <CardHeader className="p-4">
                      <CardTitle className="text-lg">
                        {collection.name}
                      </CardTitle>
                      <CardDescription className="text-gray-400">
                        {collection.count} items
                      </CardDescription>
                    </CardHeader>
                    <CardFooter className="p-4 pt-0">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full border-gray-700 hover:bg-gray-800"
                      >
                        View Collection
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
