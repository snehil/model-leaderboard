import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Header } from "@/components/layout";
import { Sidebar } from "@/components/layout";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Model Leaderboard - AI Benchmark Tracking",
    template: "%s | Model Leaderboard",
  },
  description:
    "The single source of truth for AI model performance. Track benchmarks across LLMs, vision, code, multimodal, and more. Updated daily.",
  keywords: [
    "AI benchmarks",
    "LLM leaderboard",
    "model comparison",
    "machine learning",
    "GPT",
    "Claude",
    "Gemini",
    "Llama",
    "MMLU",
    "HumanEval",
  ],
  authors: [{ name: "Model Leaderboard" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://model-leaderboard.vercel.app",
    siteName: "Model Leaderboard",
    title: "Model Leaderboard - AI Benchmark Tracking",
    description:
      "The single source of truth for AI model performance. Track benchmarks across LLMs, vision, code, multimodal, and more.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Model Leaderboard - AI Benchmark Tracking",
    description:
      "The single source of truth for AI model performance. Track benchmarks across LLMs, vision, code, multimodal, and more.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background`}
      >
        <div className="relative flex min-h-screen flex-col">
          <Header />
          <div className="flex-1 flex">
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 md:pt-14 border-r bg-background">
              <Sidebar />
            </aside>
            {/* Main Content */}
            <main className="flex-1 md:pl-64">
              <div className="container py-6">{children}</div>
            </main>
          </div>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
