import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

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
      <body className="min-h-screen bg-background font-sans antialiased flex flex-col">
        <Header />
        <main className="container mx-auto py-8 flex-grow">
          {children}
        </main>
        <Footer />
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}