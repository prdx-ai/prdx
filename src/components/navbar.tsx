"use client";

import Link from "next/link";
import { createClient } from "../supabase/client";
import { Button } from "./ui/button";
import { Sparkles, UserCircle } from "lucide-react";
import UserProfile from "./user-profile";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };

    fetchUser();

    // Add scroll event listener for navbar animation
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 w-full py-3 z-50 transition-all duration-300 ${isScrolled ? "bg-gray-900/80 backdrop-blur-md shadow-md" : "bg-transparent"}`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" prefetch className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mr-2">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <span className="text-xl font-bold text-white">Paradox</span>
        </Link>
        <div className="flex gap-4 items-center">
          {user ? (
            <>
              <Link
                href="/chat"
                className="px-4 py-2 text-sm font-medium text-white hover:text-blue-200 transition-colors"
              >
                Chat
              </Link>
              <Link
                href="/dashboard"
                className="px-4 py-2 text-sm font-medium text-white hover:text-blue-200 transition-colors"
              >
                Dashboard
              </Link>
              <UserProfile />
            </>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="px-4 py-2 text-sm font-medium text-white hover:text-blue-200 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
