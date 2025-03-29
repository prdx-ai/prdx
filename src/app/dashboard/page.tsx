import { createClient } from "../../../supabase/server";
import { redirect } from "next/navigation";
import ChatUI from "@/components/ChatUI";
import DashboardNavbar from "@/components/dashboard-navbar";
import { SubscriptionCheck } from "@/components/subscription-check";
import ProtectedRoute from "@/components/protected-route";

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <div className="flex flex-col h-screen bg-background">
        <DashboardNavbar />
        <main className="flex-1 overflow-hidden">
          <div className="h-full">
            <ChatUI />
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
