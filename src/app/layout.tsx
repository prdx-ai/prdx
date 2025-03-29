import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AuthProvider } from '@/components/auth-provider';
import ServiceWorkerRegister from '@/components/service-worker-register';

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "Prdx - Imagine and create",
  description: "An imagination and creation tool for the modern age",
  keywords: "AI, imagination, creation, productivity, tools",
  authors: [{ name: "Prdx Team" }],
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://tryprdx.com",
    title: "Prdx - Imagine and create",
    description: "An imagination and creation tool for the modern age",
    siteName: "Prdx",
  },
  twitter: {
    card: "summary_large_image",
    title: "Prdx - Imagine and create",
    description: "An imagination and creation tool for the modern age",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full">
        <AuthProvider>
          <ServiceWorkerRegister />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
