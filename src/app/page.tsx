import Hero from "@/components/hero";
import Navbar from "@/components/navbar";
import PricingCard from "@/components/pricing-card";
import Footer from "@/components/footer";
import { createClient } from "../../supabase/server";
import {
  ArrowUpRight,
  MessageSquare,
  Image,
  Video,
  Sparkles,
  Layers,
  Shield,
  Palette,
} from "lucide-react";

export default async function Home() {
  let user = null;
  let plans = [];
  
  // Create a try-catch block to handle potential errors
  try {
    const supabase = await createClient();
    
    try {
      const { data } = await supabase.auth.getUser();
      user = data.user;
    } catch (authError) {
      // Handle auth error silently
      console.error("Auth error:", authError);
    }

    // Use a try-catch for the function invocation as well
    try {
      const { data, error } = await supabase.functions.invoke(
        "supabase-functions-get-plans",
      );
      if (!error) {
        plans = data;
      }
    } catch (functionError) {
      // Handle function invocation error silently or log it
      console.error("Error fetching plans:", functionError);
    }
  } catch (error) {
    // Handle client creation error
    console.error("Client creation error:", error);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <Navbar />
      <Hero />

      {/* Features Section */}
      <section className="py-24 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Powerful AI Media Generation
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Transform your ideas into stunning visuals with our AI-powered
              chat interface.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <MessageSquare className="w-6 h-6" />,
                title: "Chat Interface",
                description: "Clean, intuitive ChatGPT-style UI",
              },
              {
                icon: <Image className="w-6 h-6" />,
                title: "Text-to-Image",
                description: "Generate stunning images from text prompts",
              },
              {
                icon: <Video className="w-6 h-6" />,
                title: "Image-to-Video",
                description: "Transform still images into dynamic videos",
              },
              {
                icon: <Sparkles className="w-6 h-6" />,
                title: "AI-Powered",
                description: "State-of-the-art generative AI models",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="p-6 bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-700"
              >
                <div className="text-purple-500 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How Paradox Works</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              A seamless experience from chat to creation
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="p-6 bg-gray-700 rounded-xl text-center">
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Chat with AI</h3>
              <p className="text-gray-300">
                Describe what you want to create in natural language
              </p>
            </div>
            <div className="p-6 bg-gray-700 rounded-xl text-center">
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">
                AI Processes Request
              </h3>
              <p className="text-gray-300">
                Our modular pipeline identifies and executes the right tools
              </p>
            </div>
            <div className="p-6 bg-gray-700 rounded-xl text-center">
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Get Results</h3>
              <p className="text-gray-300">
                View, save, and refine your generated media
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Advanced Features Section */}
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Advanced Capabilities</h2>
              <div className="space-y-4">
                {[
                  {
                    icon: <Layers className="w-5 h-5" />,
                    title: "Modular AI Pipeline",
                    description:
                      "Pluggable architecture for extensible media generation",
                  },
                  {
                    icon: <Shield className="w-5 h-5" />,
                    title: "User Management",
                    description:
                      "Save conversations and generated media to your account",
                  },
                  {
                    icon: <Palette className="w-5 h-5" />,
                    title: "Dark Mode First",
                    description:
                      "Clean, minimal design optimized for creative work",
                  },
                ].map((feature, index) => (
                  <div key={index} className="flex items-start">
                    <div className="mt-1 mr-4 p-2 bg-purple-600 rounded-lg">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{feature.title}</h3>
                      <p className="text-gray-300">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
              <div className="p-4 bg-gray-700 rounded-lg mb-4">
                <p className="text-gray-300 mb-2">
                  User: Create an image of a futuristic city with flying cars
                </p>
                <div className="h-48 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <p className="text-sm text-white opacity-70">
                    Generated image would appear here
                  </p>
                </div>
              </div>
              <div className="p-4 bg-gray-700 rounded-lg">
                <p className="text-gray-300 mb-2">
                  User: Turn this image into a short video
                </p>
                <div className="h-48 bg-gradient-to-br from-blue-600 to-purple-500 rounded-lg flex items-center justify-center">
                  <p className="text-sm text-white opacity-70">
                    Generated video would appear here
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 bg-gray-800" id="pricing">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Choose the perfect plan for your creative needs
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans?.map((item: any) => (
              <PricingCard key={item.id} item={item} user={user} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Transform Your Ideas?
          </h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Join our community of creators and bring your imagination to life.
          </p>
          <a
            href="/dashboard"
            className="inline-flex items-center px-6 py-3 text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Start Creating Now
            <ArrowUpRight className="ml-2 w-4 h-4" />
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
