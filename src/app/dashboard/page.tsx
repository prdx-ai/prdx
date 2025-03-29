'use client';

import ProtectedRoute from "@/components/protected-route";
import ChatUI from "@/components/ChatUI";
import DashboardNavbar from "@/components/dashboard-navbar";

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
