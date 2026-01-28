import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { LeaderboardTable } from "@/components/leaderboard/leaderboard-table";
import type { LeaderboardEntry } from "@/types";

// Mock Next.js Link
vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

describe("LeaderboardTable", () => {
  const mockEntries: LeaderboardEntry[] = [
    {
      rank: 1,
      model: {
        id: "1",
        name: "GPT-4o",
        slug: "gpt-4o",
        modelType: "multimodal",
        licenseType: "proprietary",
        organizationId: "org-1",
        organization: {
          id: "org-1",
          name: "OpenAI",
          slug: "openai",
          website: null,
          logoUrl: null,
          description: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        parameters: null,
        contextLength: 128000,
        releaseDate: null,
        huggingfaceUrl: null,
        githubUrl: null,
        paperUrl: null,
        apiUrl: null,
        documentationUrl: null,
        description: null,
        architecture: null,
        trainingDataCutoff: null,
        isActive: true,
        metadata: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      score: 92.5,
      scoreNormalized: 0.925,
      evaluationDate: null,
      sourceType: "official",
    },
    {
      rank: 2,
      model: {
        id: "2",
        name: "Claude 3.5 Sonnet",
        slug: "claude-3-5-sonnet",
        modelType: "multimodal",
        licenseType: "proprietary",
        organizationId: "org-2",
        organization: {
          id: "org-2",
          name: "Anthropic",
          slug: "anthropic",
          website: null,
          logoUrl: null,
          description: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        parameters: null,
        contextLength: 200000,
        releaseDate: null,
        huggingfaceUrl: null,
        githubUrl: null,
        paperUrl: null,
        apiUrl: null,
        documentationUrl: null,
        description: null,
        architecture: null,
        trainingDataCutoff: null,
        isActive: true,
        metadata: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      score: 91.2,
      scoreNormalized: 0.912,
      evaluationDate: null,
      sourceType: "official",
    },
  ];

  it("renders the leaderboard table with entries", () => {
    render(<LeaderboardTable entries={mockEntries} />);

    expect(screen.getByText("GPT-4o")).toBeInTheDocument();
    expect(screen.getByText("Claude 3.5 Sonnet")).toBeInTheDocument();
    expect(screen.getByText("OpenAI")).toBeInTheDocument();
    expect(screen.getByText("Anthropic")).toBeInTheDocument();
  });

  it("displays rank badges correctly", () => {
    render(<LeaderboardTable entries={mockEntries} />);

    // Check for rank badges
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("shows empty state when no entries", () => {
    render(<LeaderboardTable entries={[]} />);

    expect(screen.getByText("No results found.")).toBeInTheDocument();
    expect(
      screen.getByText("Try adjusting your filters or check back later.")
    ).toBeInTheDocument();
  });

  it("displays model types as badges", () => {
    render(<LeaderboardTable entries={mockEntries} />);

    const typeBadges = screen.getAllByText("multimodal");
    expect(typeBadges.length).toBe(2);
  });

  it("displays license types as badges", () => {
    render(<LeaderboardTable entries={mockEntries} />);

    const licenseBadges = screen.getAllByText("proprietary");
    expect(licenseBadges.length).toBe(2);
  });

  it("formats scores correctly", () => {
    render(<LeaderboardTable entries={mockEntries} />);

    expect(screen.getByText("92.5%")).toBeInTheDocument();
    expect(screen.getByText("91.2%")).toBeInTheDocument();
  });

  it("creates links to model detail pages", () => {
    render(<LeaderboardTable entries={mockEntries} />);

    const gptLink = screen.getByRole("link", { name: /GPT-4o/i });
    expect(gptLink).toHaveAttribute("href", "/models/gpt-4o");

    const claudeLink = screen.getByRole("link", { name: /Claude 3.5 Sonnet/i });
    expect(claudeLink).toHaveAttribute("href", "/models/claude-3-5-sonnet");
  });

  it("creates links to organization pages", () => {
    render(<LeaderboardTable entries={mockEntries} />);

    const openaiLink = screen.getByRole("link", { name: "OpenAI" });
    expect(openaiLink).toHaveAttribute("href", "/organizations/openai");

    const anthropicLink = screen.getByRole("link", { name: "Anthropic" });
    expect(anthropicLink).toHaveAttribute("href", "/organizations/anthropic");
  });
});
