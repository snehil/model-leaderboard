import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { BenchmarkInfoTooltip } from "@/components/benchmark/benchmark-info-tooltip";
import { BenchmarkInfoModal } from "@/components/benchmark/benchmark-info-modal";
import type { BenchmarkWithCategory } from "@/types";

describe("BenchmarkInfoTooltip", () => {
  const mockBenchmark: BenchmarkWithCategory = {
    id: "1",
    name: "MMLU-Pro",
    slug: "mmlu-pro",
    categoryId: "cat-1",
    description: "Enhanced multi-task language understanding benchmark.",
    whatItEvaluates: "Tests broad academic knowledge.",
    methodology: "Multiple-choice questions with 10 options.",
    paperUrl: "https://arxiv.org/abs/2406.01574",
    websiteUrl: "https://example.com",
    datasetUrl: null,
    metricName: "accuracy",
    metricUnit: "%",
    higherIsBetter: true,
    maxScore: "100",
    isActive: true,
    isSaturated: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    category: {
      id: "cat-1",
      name: "Language Models",
      slug: "llm",
      description: "LLM benchmarks",
      icon: "Brain",
      displayOrder: 1,
      createdAt: new Date(),
    },
  };

  it("renders the benchmark name", () => {
    render(<BenchmarkInfoTooltip benchmark={mockBenchmark} />);

    expect(screen.getByText("MMLU-Pro")).toBeInTheDocument();
  });

  it("renders custom children when provided", () => {
    render(
      <BenchmarkInfoTooltip benchmark={mockBenchmark}>
        <span>Custom Trigger</span>
      </BenchmarkInfoTooltip>
    );

    expect(screen.getByText("Custom Trigger")).toBeInTheDocument();
  });
});

describe("BenchmarkInfoModal", () => {
  const mockBenchmark: BenchmarkWithCategory = {
    id: "1",
    name: "SWE-bench",
    slug: "swe-bench",
    categoryId: "cat-2",
    description: "Real GitHub issues requiring codebase understanding.",
    whatItEvaluates: "Software engineering ability including bug localization.",
    methodology: "2,294 real GitHub issues from 12 popular Python repos.",
    paperUrl: "https://arxiv.org/abs/2310.06770",
    websiteUrl: "https://www.swebench.com/",
    datasetUrl: "https://huggingface.co/datasets/swe-bench",
    metricName: "resolved",
    metricUnit: "%",
    higherIsBetter: true,
    maxScore: "100",
    isActive: true,
    isSaturated: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    category: {
      id: "cat-2",
      name: "Code",
      slug: "code",
      description: "Code generation benchmarks",
      icon: "Code",
      displayOrder: 3,
      createdAt: new Date(),
    },
  };

  it("renders the benchmark name as trigger", () => {
    render(<BenchmarkInfoModal benchmark={mockBenchmark} />);

    expect(screen.getByText("SWE-bench")).toBeInTheDocument();
  });

  it("renders custom children when provided", () => {
    render(
      <BenchmarkInfoModal benchmark={mockBenchmark}>
        <button>Open Modal</button>
      </BenchmarkInfoModal>
    );

    expect(screen.getByText("Open Modal")).toBeInTheDocument();
  });
});
