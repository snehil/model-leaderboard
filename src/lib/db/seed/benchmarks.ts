import type { NewBenchmark } from "../schema";

// Benchmarks organized by category slug
export const benchmarks: Record<string, Omit<NewBenchmark, "categoryId">[]> = {
  llm: [
    {
      name: "MMLU-Pro",
      slug: "mmlu-pro",
      description:
        "Enhanced multi-task language understanding with 12K questions across 14 domains.",
      whatItEvaluates:
        "Tests broad academic knowledge including STEM, humanities, social sciences, and professional domains. Evaluates factual knowledge, reading comprehension, and reasoning.",
      methodology:
        "Multiple-choice questions with 10 options (vs 4 in original MMLU). Questions sourced from academic exams, textbooks, and expert-written content. Zero-shot and few-shot evaluation.",
      paperUrl: "https://arxiv.org/abs/2406.01574",
      websiteUrl: "https://huggingface.co/datasets/TIGER-Lab/MMLU-Pro",
      metricName: "accuracy",
      metricUnit: "%",
      higherIsBetter: true,
      maxScore: "100",
      isActive: true,
      isSaturated: false,
    },
    {
      name: "GPQA Diamond",
      slug: "gpqa-diamond",
      description:
        "Graduate-level science questions written by domain experts.",
      whatItEvaluates:
        "PhD-level knowledge in biology, physics, and chemistry. Tests deep understanding beyond surface-level facts.",
      methodology:
        "448 challenging multiple-choice questions created by PhD students. Even experts in adjacent fields achieve only ~65% accuracy.",
      paperUrl: "https://arxiv.org/abs/2311.12022",
      websiteUrl: "https://github.com/idavidrein/gpqa",
      metricName: "accuracy",
      metricUnit: "%",
      higherIsBetter: true,
      maxScore: "100",
      isActive: true,
      isSaturated: false,
    },
    {
      name: "HellaSwag",
      slug: "hellaswag",
      description:
        "Commonsense reasoning about everyday situations and activities.",
      whatItEvaluates:
        "Commonsense reasoning and grounded knowledge about physical world interactions and typical activity sequences.",
      methodology:
        "Given a context, select the most plausible continuation from 4 options. Uses adversarial filtering to ensure difficulty.",
      paperUrl: "https://arxiv.org/abs/1905.07830",
      websiteUrl: "https://rowanzellers.com/hellaswag/",
      metricName: "accuracy",
      metricUnit: "%",
      higherIsBetter: true,
      maxScore: "100",
      isActive: true,
      isSaturated: true,
    },
    {
      name: "TruthfulQA",
      slug: "truthfulqa",
      description: "Tests whether models generate truthful answers vs common misconceptions.",
      whatItEvaluates:
        "Resistance to generating false but plausible-sounding answers. Tests factual accuracy and avoiding hallucinations.",
      methodology:
        "817 questions spanning 38 categories including health, law, and politics. Questions designed to elicit imitative falsehoods.",
      paperUrl: "https://arxiv.org/abs/2109.07958",
      websiteUrl: "https://github.com/sylinrl/TruthfulQA",
      metricName: "accuracy",
      metricUnit: "%",
      higherIsBetter: true,
      maxScore: "100",
      isActive: true,
      isSaturated: false,
    },
    {
      name: "WinoGrande",
      slug: "winogrande",
      description: "Large-scale Winograd schema challenge for commonsense reasoning.",
      whatItEvaluates:
        "Pronoun resolution requiring commonsense reasoning. Tests understanding of context and world knowledge.",
      methodology:
        "44K problems in fill-in-the-blank format. Requires selecting correct word that makes sentence coherent.",
      paperUrl: "https://arxiv.org/abs/1907.10641",
      websiteUrl: "https://winogrande.allenai.org/",
      metricName: "accuracy",
      metricUnit: "%",
      higherIsBetter: true,
      maxScore: "100",
      isActive: true,
      isSaturated: true,
    },
  ],
  reasoning: [
    {
      name: "ARC-AGI",
      slug: "arc-agi",
      description:
        "Abstract Reasoning Corpus measuring general fluid intelligence.",
      whatItEvaluates:
        "Novel problem-solving and pattern recognition without relying on learned knowledge. Tests ability to generalize from few examples.",
      methodology:
        "Visual grid-based puzzles requiring identification of transformation rules from input-output examples. Measures core abstraction abilities.",
      paperUrl: "https://arxiv.org/abs/1911.01547",
      websiteUrl: "https://arcprize.org/",
      metricName: "accuracy",
      metricUnit: "%",
      higherIsBetter: true,
      maxScore: "100",
      isActive: true,
      isSaturated: false,
    },
    {
      name: "GSM8K",
      slug: "gsm8k",
      description: "Grade school math word problems requiring multi-step reasoning.",
      whatItEvaluates:
        "Mathematical reasoning and multi-step problem solving. Tests ability to break down problems and perform calculations.",
      methodology:
        "8.5K linguistically diverse grade school math problems. Requires 2-8 steps to solve using basic arithmetic.",
      paperUrl: "https://arxiv.org/abs/2110.14168",
      websiteUrl: "https://github.com/openai/grade-school-math",
      metricName: "accuracy",
      metricUnit: "%",
      higherIsBetter: true,
      maxScore: "100",
      isActive: true,
      isSaturated: false,
    },
    {
      name: "MATH",
      slug: "math",
      description: "Competition mathematics problems from AMC, AIME, and Olympiads.",
      whatItEvaluates:
        "Advanced mathematical reasoning including algebra, geometry, number theory, and calculus.",
      methodology:
        "12.5K problems from math competitions. Answers provided in LaTeX. Evaluated on exact match of final answer.",
      paperUrl: "https://arxiv.org/abs/2103.03874",
      websiteUrl: "https://github.com/hendrycks/math",
      metricName: "accuracy",
      metricUnit: "%",
      higherIsBetter: true,
      maxScore: "100",
      isActive: true,
      isSaturated: false,
    },
    {
      name: "BBH",
      slug: "bbh",
      description: "BIG-Bench Hard - 23 challenging tasks from BIG-Bench.",
      whatItEvaluates:
        "Multi-step reasoning, instruction following, and diverse cognitive abilities that prior models struggled with.",
      methodology:
        "Subset of BIG-Bench tasks where prior language models performed below average human rater. Includes logical deduction, tracking, and more.",
      paperUrl: "https://arxiv.org/abs/2210.09261",
      websiteUrl: "https://github.com/suzgunmirac/BIG-Bench-Hard",
      metricName: "accuracy",
      metricUnit: "%",
      higherIsBetter: true,
      maxScore: "100",
      isActive: true,
      isSaturated: false,
    },
  ],
  code: [
    {
      name: "HumanEval",
      slug: "humaneval",
      description: "Hand-written Python programming problems with unit tests.",
      whatItEvaluates:
        "Code generation ability from docstrings. Tests understanding of programming concepts and ability to write correct implementations.",
      methodology:
        "164 original programming problems with function signature and docstring. Model generates function body, evaluated by running test cases.",
      paperUrl: "https://arxiv.org/abs/2107.03374",
      websiteUrl: "https://github.com/openai/human-eval",
      metricName: "pass@1",
      metricUnit: "%",
      higherIsBetter: true,
      maxScore: "100",
      isActive: true,
      isSaturated: false,
    },
    {
      name: "SWE-bench",
      slug: "swe-bench",
      description: "Real GitHub issues requiring codebase understanding and fixes.",
      whatItEvaluates:
        "Software engineering ability including codebase navigation, bug localization, and implementing fixes across multiple files.",
      methodology:
        "2,294 real GitHub issues from 12 popular Python repos. Model must generate a patch that passes the issue's test cases.",
      paperUrl: "https://arxiv.org/abs/2310.06770",
      websiteUrl: "https://www.swebench.com/",
      metricName: "resolved",
      metricUnit: "%",
      higherIsBetter: true,
      maxScore: "100",
      isActive: true,
      isSaturated: false,
    },
    {
      name: "SWE-bench Verified",
      slug: "swe-bench-verified",
      description: "Human-verified subset of SWE-bench with quality-assured test cases.",
      whatItEvaluates:
        "Same as SWE-bench but with verified, unambiguous test cases. More reliable measure of real-world coding ability.",
      methodology:
        "500 instances from SWE-bench verified by human annotators for correctness and clarity of tests.",
      paperUrl: "https://arxiv.org/abs/2310.06770",
      websiteUrl: "https://www.swebench.com/",
      metricName: "resolved",
      metricUnit: "%",
      higherIsBetter: true,
      maxScore: "100",
      isActive: true,
      isSaturated: false,
    },
    {
      name: "MBPP",
      slug: "mbpp",
      description: "Mostly Basic Python Problems for entry-level programming.",
      whatItEvaluates:
        "Basic programming skills and code generation from natural language descriptions.",
      methodology:
        "974 crowd-sourced Python problems. Each has description, code solution, and 3 test cases.",
      paperUrl: "https://arxiv.org/abs/2108.07732",
      websiteUrl: "https://github.com/google-research/google-research/tree/master/mbpp",
      metricName: "pass@1",
      metricUnit: "%",
      higherIsBetter: true,
      maxScore: "100",
      isActive: true,
      isSaturated: false,
    },
    {
      name: "LiveCodeBench",
      slug: "livecodebench",
      description: "Continuously updated coding benchmark from competitive programming.",
      whatItEvaluates:
        "Code generation on problems that didn't exist during model training. Tests generalization, not memorization.",
      methodology:
        "Problems collected from LeetCode, AtCoder, and CodeForces after model training cutoffs. Updated monthly.",
      paperUrl: "https://arxiv.org/abs/2403.07974",
      websiteUrl: "https://livecodebench.github.io/",
      metricName: "pass@1",
      metricUnit: "%",
      higherIsBetter: true,
      maxScore: "100",
      isActive: true,
      isSaturated: false,
    },
  ],
  multimodal: [
    {
      name: "MMMU",
      slug: "mmmu",
      description: "Massive Multi-discipline Multimodal Understanding benchmark.",
      whatItEvaluates:
        "College-level knowledge requiring both image understanding and domain expertise across 30 subjects.",
      methodology:
        "11.5K questions from college exams and textbooks. Requires understanding diagrams, charts, and figures alongside text.",
      paperUrl: "https://arxiv.org/abs/2311.16502",
      websiteUrl: "https://mmmu-benchmark.github.io/",
      metricName: "accuracy",
      metricUnit: "%",
      higherIsBetter: true,
      maxScore: "100",
      isActive: true,
      isSaturated: false,
    },
    {
      name: "MathVista",
      slug: "mathvista",
      description: "Mathematical reasoning in visual contexts.",
      whatItEvaluates:
        "Ability to solve math problems presented visually in figures, charts, graphs, and geometry diagrams.",
      methodology:
        "6,141 examples combining visual perception with mathematical reasoning. Covers geometry, statistics, and scientific figures.",
      paperUrl: "https://arxiv.org/abs/2310.02255",
      websiteUrl: "https://mathvista.github.io/",
      metricName: "accuracy",
      metricUnit: "%",
      higherIsBetter: true,
      maxScore: "100",
      isActive: true,
      isSaturated: false,
    },
    {
      name: "MMBench",
      slug: "mmbench",
      description: "Comprehensive multimodal benchmark with fine-grained ability assessment.",
      whatItEvaluates:
        "20 different multimodal capabilities including object localization, OCR, spatial reasoning, and more.",
      methodology:
        "Circular evaluation protocol to reduce position bias. Questions cover perception, reasoning, and knowledge.",
      paperUrl: "https://arxiv.org/abs/2307.06281",
      websiteUrl: "https://mmbench.opencompass.org.cn/",
      metricName: "accuracy",
      metricUnit: "%",
      higherIsBetter: true,
      maxScore: "100",
      isActive: true,
      isSaturated: false,
    },
  ],
  vision: [
    {
      name: "ImageNet",
      slug: "imagenet",
      description: "Large-scale image classification benchmark.",
      whatItEvaluates:
        "Visual object recognition across 1,000 categories. Foundational benchmark for computer vision.",
      methodology:
        "1.2M training images, 50K validation images. Top-1 and Top-5 accuracy reported.",
      paperUrl: "https://arxiv.org/abs/1409.0575",
      websiteUrl: "https://www.image-net.org/",
      metricName: "top-1 accuracy",
      metricUnit: "%",
      higherIsBetter: true,
      maxScore: "100",
      isActive: true,
      isSaturated: true,
    },
    {
      name: "VQAv2",
      slug: "vqav2",
      description: "Visual Question Answering about natural images.",
      whatItEvaluates:
        "Ability to answer open-ended questions about images, requiring both visual and linguistic understanding.",
      methodology:
        "1.1M questions about 200K images. Answers evaluated against 10 human responses.",
      paperUrl: "https://arxiv.org/abs/1612.00837",
      websiteUrl: "https://visualqa.org/",
      metricName: "accuracy",
      metricUnit: "%",
      higherIsBetter: true,
      maxScore: "100",
      isActive: true,
      isSaturated: false,
    },
  ],
  audio: [
    {
      name: "LibriSpeech",
      slug: "librispeech",
      description: "Large-scale speech recognition benchmark from audiobooks.",
      whatItEvaluates:
        "Automatic speech recognition accuracy on clean and noisy English speech.",
      methodology:
        "1000 hours of read English speech. Evaluated using Word Error Rate (WER) on test-clean and test-other sets.",
      paperUrl: "https://www.danielpovey.com/files/2015_icassp_librispeech.pdf",
      websiteUrl: "https://www.openslr.org/12",
      metricName: "WER",
      metricUnit: "%",
      higherIsBetter: false,
      maxScore: "100",
      isActive: true,
      isSaturated: false,
    },
    {
      name: "Common Voice",
      slug: "common-voice",
      description: "Multilingual crowdsourced speech recognition dataset.",
      whatItEvaluates:
        "Speech recognition across diverse accents, ages, and recording conditions in 100+ languages.",
      methodology:
        "Crowdsourced recordings with community validation. Evaluated using Word Error Rate.",
      paperUrl: "https://arxiv.org/abs/1912.06670",
      websiteUrl: "https://commonvoice.mozilla.org/",
      metricName: "WER",
      metricUnit: "%",
      higherIsBetter: false,
      maxScore: "100",
      isActive: true,
      isSaturated: false,
    },
  ],
  embeddings: [
    {
      name: "MTEB",
      slug: "mteb",
      description: "Massive Text Embedding Benchmark across 8 task types.",
      whatItEvaluates:
        "Text embedding quality for retrieval, classification, clustering, reranking, and semantic similarity.",
      methodology:
        "58 datasets spanning 8 tasks and 112 languages. Overall score is average across all tasks.",
      paperUrl: "https://arxiv.org/abs/2210.07316",
      websiteUrl: "https://huggingface.co/spaces/mteb/leaderboard",
      metricName: "average score",
      metricUnit: "",
      higherIsBetter: true,
      maxScore: "100",
      isActive: true,
      isSaturated: false,
    },
  ],
};
