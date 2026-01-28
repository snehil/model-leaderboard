import Link from "next/link";
import {
  Trophy,
  TrendingUp,
  Search,
  GitCompare,
  ArrowRight,
  Zap,
  RefreshCw,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const features = [
  {
    icon: Trophy,
    title: "Comprehensive Leaderboards",
    description:
      "Track model performance across LLMs, vision, code, multimodal, audio, and more.",
  },
  {
    icon: RefreshCw,
    title: "Daily Updates",
    description:
      "Automated data pipelines pull latest benchmark results from HuggingFace, Papers with Code, and official sources.",
  },
  {
    icon: GitCompare,
    title: "Model Comparison",
    description:
      "Compare up to 5 models side-by-side with radar charts and detailed benchmark breakdowns.",
  },
  {
    icon: Search,
    title: "Powerful Search",
    description:
      "Find any model or benchmark instantly with our global search. Filter by type, organization, or license.",
  },
  {
    icon: TrendingUp,
    title: "Historical Trends",
    description:
      "Track how models improve over time with historical snapshots and trend analysis.",
  },
  {
    icon: Globe,
    title: "Open & Proprietary",
    description:
      "Track both open-source models (Llama, Mistral) and proprietary ones (GPT-4, Claude, Gemini).",
  },
];

const categories = [
  { name: "Language Models", slug: "llm", count: 150 },
  { name: "Vision", slug: "vision", count: 75 },
  { name: "Code", slug: "code", count: 60 },
  { name: "Multimodal", slug: "multimodal", count: 45 },
  { name: "Audio", slug: "audio", count: 30 },
  { name: "Embeddings", slug: "embedding", count: 40 },
];

export default function Home() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-6 py-8">
        <Badge variant="secondary" className="px-4 py-1">
          <Zap className="h-3 w-3 mr-1" />
          Updated Daily
        </Badge>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          The Single Source of Truth for{" "}
          <span className="text-primary">AI Benchmarks</span>
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          Track performance of every AI model across all benchmarks. From
          GPT-4 to Llama, from MMLU to SWE-bench. All in one place, updated
          every day.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/leaderboard">
              View Leaderboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/compare">Compare Models</Link>
          </Button>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Browse by Category</h2>
          <Button variant="ghost" asChild>
            <Link href="/leaderboard">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link key={category.slug} href={`/leaderboard/${category.slug}`}>
              <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg font-medium">
                    {category.name}
                  </CardTitle>
                  <Badge variant="secondary">{category.count} models</Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    View top performing {category.name.toLowerCase()} models
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-center">
          Everything You Need to Track AI Progress
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title}>
              <CardHeader>
                <feature.icon className="h-10 w-10 text-primary mb-2" />
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center space-y-4 py-8 border-t">
        <h2 className="text-2xl font-bold">Ready to explore?</h2>
        <p className="text-muted-foreground">
          Start tracking AI model performance across every benchmark that
          matters.
        </p>
        <Button asChild size="lg">
          <Link href="/leaderboard">
            Get Started
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </section>
    </div>
  );
}
