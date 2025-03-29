'use client';

import { Suspense, lazy } from 'react';
import ProtectedRoute from "@/components/protected-route";
import { Loader2 } from 'lucide-react';

// Lazy load the ChatUI component
const ChatUI = lazy(() => import("@/components/ChatUI"));
const DashboardNavbar = lazy(() => import("@/components/dashboard-navbar"));

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex h-full w-full items-center justify-center">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <div className="flex flex-col h-screen bg-background">
        <Suspense fallback={<LoadingFallback />}>
          <DashboardNavbar />
        </Suspense>
        <main className="flex-1 overflow-hidden">
          <div className="h-full">
            <Suspense fallback={<LoadingFallback />}>
              <ChatUI />
            </Suspense>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
