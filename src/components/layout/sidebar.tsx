"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Trophy,
  Layers,
  Box,
  Building2,
  GitCompare,
  TrendingUp,
  Brain,
  Eye,
  Code2,
  Mic,
  ImageIcon,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface SidebarProps {
  onNavigate?: () => void;
}

const mainNavItems = [
  {
    title: "Leaderboard",
    href: "/leaderboard",
    icon: Trophy,
  },
  {
    title: "Models",
    href: "/models",
    icon: Box,
  },
  {
    title: "Benchmarks",
    href: "/benchmarks",
    icon: Layers,
  },
  {
    title: "Organizations",
    href: "/organizations",
    icon: Building2,
  },
  {
    title: "Compare",
    href: "/compare",
    icon: GitCompare,
  },
  {
    title: "Trends",
    href: "/trends",
    icon: TrendingUp,
  },
];

const categoryItems = [
  {
    title: "Language Models",
    href: "/leaderboard/llm",
    icon: Brain,
  },
  {
    title: "Vision",
    href: "/leaderboard/vision",
    icon: Eye,
  },
  {
    title: "Code",
    href: "/leaderboard/code",
    icon: Code2,
  },
  {
    title: "Multimodal",
    href: "/leaderboard/multimodal",
    icon: Sparkles,
  },
  {
    title: "Audio",
    href: "/leaderboard/audio",
    icon: Mic,
  },
  {
    title: "Image Generation",
    href: "/leaderboard/image-generation",
    icon: ImageIcon,
  },
];

export function Sidebar({ onNavigate }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col">
      {/* Logo for mobile */}
      <div className="flex h-14 items-center border-b px-4 md:hidden">
        <Link href="/" className="flex items-center space-x-2" onClick={onNavigate}>
          <Trophy className="h-6 w-6 text-primary" />
          <span className="font-bold">Model Leaderboard</span>
        </Link>
      </div>

      <ScrollArea className="flex-1 px-3 py-4">
        <div className="space-y-4">
          {/* Main Navigation */}
          <div className="space-y-1">
            {mainNavItems.map((item) => (
              <Button
                key={item.href}
                variant={pathname === item.href ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  pathname === item.href && "bg-secondary"
                )}
                asChild
              >
                <Link href={item.href} onClick={onNavigate}>
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.title}
                </Link>
              </Button>
            ))}
          </div>

          <Separator />

          {/* Categories */}
          <div>
            <h4 className="mb-2 px-2 text-sm font-semibold text-muted-foreground">
              Categories
            </h4>
            <div className="space-y-1">
              {categoryItems.map((item) => (
                <Button
                  key={item.href}
                  variant={pathname === item.href ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start",
                    pathname === item.href && "bg-secondary"
                  )}
                  size="sm"
                  asChild
                >
                  <Link href={item.href} onClick={onNavigate}>
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.title}
                  </Link>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="border-t p-4 space-y-2">
        <p className="text-xs text-muted-foreground text-center">
          Updated daily from multiple sources
        </p>
        <p className="text-xs text-muted-foreground text-center">
          Created by{" "}
          <a
            href="https://github.com/snehil"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium hover:text-foreground transition-colors"
          >
            Snehil Wakchaure
          </a>
        </p>
      </div>
    </div>
  );
}
