import type { NewBenchmarkCategory } from "../schema";

export const categories: NewBenchmarkCategory[] = [
  {
    name: "Language Models",
    slug: "llm",
    description:
      "Large Language Models evaluated on text understanding, reasoning, and generation tasks.",
    icon: "Brain",
    displayOrder: 1,
  },
  {
    name: "Reasoning",
    slug: "reasoning",
    description:
      "Benchmarks testing logical reasoning, mathematical problem-solving, and abstract thinking.",
    icon: "Lightbulb",
    displayOrder: 2,
  },
  {
    name: "Code",
    slug: "code",
    description:
      "Code generation, completion, and software engineering task benchmarks.",
    icon: "Code",
    displayOrder: 3,
  },
  {
    name: "Vision",
    slug: "vision",
    description:
      "Image classification, object detection, and visual understanding benchmarks.",
    icon: "Eye",
    displayOrder: 4,
  },
  {
    name: "Multimodal",
    slug: "multimodal",
    description:
      "Benchmarks requiring understanding of both text and images together.",
    icon: "Layers",
    displayOrder: 5,
  },
  {
    name: "Audio",
    slug: "audio",
    description:
      "Speech recognition, text-to-speech, and audio understanding benchmarks.",
    icon: "Mic",
    displayOrder: 6,
  },
  {
    name: "Embeddings",
    slug: "embeddings",
    description:
      "Text embedding quality benchmarks for retrieval and similarity tasks.",
    icon: "Network",
    displayOrder: 7,
  },
];
