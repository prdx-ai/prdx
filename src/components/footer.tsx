import Link from "next/link";
import { Twitter, Linkedin, Github } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 border-t border-gray-800">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Product Column */}
          <div>
            <h3 className="font-semibold text-white mb-4">Product</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#features"
                  className="text-gray-300 hover:text-purple-400"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="#pricing"
                  className="text-gray-300 hover:text-purple-400"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="text-gray-300 hover:text-purple-400"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-300 hover:text-purple-400">
                  API
                </Link>
              </li>
            </ul>
          </div>

          {/* Tools Column */}
          <div>
            <h3 className="font-semibold text-white mb-4">Tools</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-gray-300 hover:text-purple-400">
                  Text-to-Image
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-300 hover:text-purple-400">
                  Image-to-Video
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-300 hover:text-purple-400">
                  Style Transfer
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-300 hover:text-purple-400">
                  AI Chat
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources Column */}
          <div>
            <h3 className="font-semibold text-white mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-gray-300 hover:text-purple-400">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-300 hover:text-purple-400">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-300 hover:text-purple-400">
                  Community
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-300 hover:text-purple-400">
                  Tutorials
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h3 className="font-semibold text-white mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-gray-300 hover:text-purple-400">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-300 hover:text-purple-400">
                  Terms
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-300 hover:text-purple-400">
                  Security
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-300 hover:text-purple-400">
                  Cookies
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-gray-800">
          <div className="text-gray-400 mb-4 md:mb-0">
            © {currentYear} Paradox AI. All rights reserved.
          </div>

          <div className="flex space-x-6">
            <a href="#" className="text-gray-500 hover:text-purple-400">
              <span className="sr-only">Twitter</span>
              <Twitter className="h-6 w-6" />
            </a>
            <a href="#" className="text-gray-500 hover:text-purple-400">
              <span className="sr-only">LinkedIn</span>
              <Linkedin className="h-6 w-6" />
            </a>
            <a href="#" className="text-gray-500 hover:text-purple-400">
              <span className="sr-only">GitHub</span>
              <Github className="h-6 w-6" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
