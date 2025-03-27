import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cover Genius AI",
  description: "AI-powered social media cover generator",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-background font-sans antialiased">
        <main className="container mx-auto py-8">
          {children}
        </main>
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}