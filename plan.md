# Model Leaderboard - AI Benchmark Tracking Platform

## Project Overview

A comprehensive AI model benchmark tracking website that serves as the single source of truth for AI model performance across all categories (LLMs, vision, reasoning, code, audio, multimodal, etc.). Updated daily with automated data pipelines.

**Repository Name:** `model-leaderboard`
**Project Path:** `/Users/test/Code/model-leaderboard`

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 15 (App Router) + TypeScript |
| Styling | Tailwind CSS v4 |
| UI Components | shadcn/ui (Radix UI primitives) |
| Database | Neon (Serverless PostgreSQL) |
| ORM | Drizzle ORM |
| State Management | Zustand (UI) + React Query (server) |
| Charts | Recharts + Tremor |
| Search | Built-in + Algolia (optional) |
| Hosting | Vercel (free tier) |
| Data Sync | GitHub Actions (cron) |

---

## Free Tier Hosting Strategy

### Neon Database (0.5 GB free)
- **Capacity**: ~500 models, 100 benchmarks, 50K results
- **Retention**: 30 days for snapshots, 7 days for logs
- **Cleanup**: Weekly automated via GitHub Actions

### Vercel (Hobby plan)
- **Builds**: 6000 build minutes/month
- **Bandwidth**: 100 GB/month
- **Serverless**: 100 GB-hours/month

### Data Management
- Automatic cleanup of old snapshots (>30 days)
- Automatic cleanup of sync logs (>7 days)
- Storage monitoring via `/api/cleanup` endpoint

---

## Core Features

### 1. Leaderboard Views
- **Global Leaderboard**: Aggregate scores across all benchmarks
- **Category Leaderboards**: Per-category (LLM, Vision, Code, etc.)
- **Benchmark Leaderboards**: Single benchmark rankings

### 2. Model Pages
- Comprehensive model details (parameters, context length, architecture)
- All benchmark scores with visual indicators
- Historical performance charts
- Non-obtrusive external links (HuggingFace, GitHub, papers, API docs)

### 3. Benchmark Info Tooltips/Modals
- **Hover tooltip**: Quick description of what the benchmark evaluates
- **Click modal**: Detailed view with:
  - Full description
  - What it evaluates (skills/capabilities)
  - Brief methodology explanation
  - Link to official benchmark page/paper
  - Dataset information

### 4. Search & Filters
- Global search (Cmd+K command palette)
- Filter by: model type, organization, license type, parameter size
- Sort by any benchmark or aggregate score

### 5. Comparison Tool
- Compare 2-5 models side-by-side
- Radar chart visualization
- Shareable comparison URLs

### 6. Historical Tracking
- Daily snapshots of rankings
- Trend charts showing improvement over time
- Rank change indicators

---

## Database Schema

### Core Tables

```
organizations
├── id (uuid, PK)
├── name (varchar)
├── slug (varchar, unique)
├── website (text)
├── logo_url (text)
└── description (text)

models
├── id (uuid, PK)
├── name (varchar)
├── slug (varchar, unique)
├── organization_id (FK → organizations)
├── model_type (enum: llm, vision, multimodal, code, audio, embedding, reasoning, image_generation, video, spatial)
├── license_type (enum: proprietary, open_source, open_weights, research_only)
├── release_date (timestamp)
├── parameters (varchar) -- "70B", "8x7B", etc.
├── context_length (integer)
├── huggingface_url (text)
├── github_url (text)
├── paper_url (text)
├── api_url (text)
├── documentation_url (text)
├── description (text)
├── architecture (varchar)
└── metadata (jsonb)

benchmark_categories
├── id (uuid, PK)
├── name (varchar)
├── slug (varchar, unique)
├── description (text)
├── icon (varchar)
└── display_order (integer)

benchmarks
├── id (uuid, PK)
├── name (varchar)
├── slug (varchar, unique)
├── category_id (FK → benchmark_categories)
├── description (text) -- For tooltips
├── what_it_evaluates (text) -- Skills/capabilities tested
├── methodology (text) -- How it works
├── paper_url (text)
├── website_url (text)
├── dataset_url (text)
├── metric_name (varchar) -- "accuracy", "pass@1", "WER"
├── metric_unit (varchar) -- "%", "score", "ms"
├── higher_is_better (boolean)
├── max_score (decimal)
├── is_active (boolean)
└── is_saturated (boolean)

benchmark_results
├── id (uuid, PK)
├── model_id (FK → models)
├── benchmark_id (FK → benchmarks)
├── score (decimal)
├── score_normalized (decimal) -- 0-1 scale
├── evaluation_date (timestamp)
├── source_type (enum: huggingface, papers_with_code, arxiv, official, github, manual, community)
├── source_url (text)
├── evaluation_config (jsonb)
└── is_verified (boolean)

leaderboard_snapshots
├── id (uuid, PK)
├── benchmark_id (FK → benchmarks)
├── snapshot_date (timestamp)
└── rankings (jsonb) -- Array of {model_id, rank, score}
```

---

## Key Benchmarks to Track

### Language/LLM
- MMLU-Pro, GPQA Diamond, Humanity's Last Exam
- HellaSwag, WinoGrande, TruthfulQA, BBH

### Reasoning
- ARC-AGI-2, GSM8K-Platinum, MATH 500, AIME, FrontierMath

### Code
- SWE-bench, SWE-bench Verified, HumanEval+, MBPP, LiveCodeBench

### Vision
- ImageNet, COCO, VQAv2, OK-VQA, GQA

### Multimodal
- MMMU, MMMU-Pro, MathVista, Video-MME, MMBench

### Audio (STT/TTS)
- LibriSpeech, Common Voice, Open ASR Leaderboard

### Embeddings
- MTEB, BEIR

---

## Data Pipeline

### Sources (Daily Automated)
1. **HuggingFace Open LLM Leaderboard** - Free API
2. **Papers with Code API** - Free REST API
3. **arXiv API** - Free OAI-PMH protocol
4. **LMArena/Chatbot Arena** - Public data scraping

### Sync Strategy
- **GitHub Actions** triggers daily at 2 AM UTC
- Calls Vercel Edge Functions for each source
- Data normalized and validated before insertion
- Daily snapshots created for historical tracking

### X/Twitter
- Skip direct API (too expensive: $5k/month for Pro)
- Use RSS feeds and AI news aggregators instead
- Manual curation for major announcements

---

## Project Structure

```
model-leaderboard/
├── .github/
│   └── workflows/
│       ├── sync-data.yml        # Daily data sync
│       └── ci.yml               # Tests and linting
├── src/
│   ├── app/
│   │   ├── (marketing)/
│   │   │   └── page.tsx         # Landing page
│   │   ├── (app)/
│   │   │   ├── leaderboard/
│   │   │   │   ├── page.tsx     # Global leaderboard
│   │   │   │   └── [category]/page.tsx
│   │   │   ├── benchmarks/
│   │   │   │   ├── page.tsx     # All benchmarks
│   │   │   │   └── [slug]/page.tsx
│   │   │   ├── models/
│   │   │   │   ├── page.tsx     # All models
│   │   │   │   └── [slug]/page.tsx
│   │   │   ├── compare/page.tsx
│   │   │   ├── organizations/
│   │   │   └── trends/page.tsx
│   │   └── api/
│   │       ├── sync/[source]/route.ts
│   │       └── search/route.ts
│   ├── components/
│   │   ├── ui/                  # shadcn/ui primitives
│   │   ├── leaderboard/
│   │   │   ├── leaderboard-table.tsx
│   │   │   ├── leaderboard-filters.tsx
│   │   │   └── score-cell.tsx
│   │   ├── benchmark/
│   │   │   ├── benchmark-info-tooltip.tsx  # Hover tooltip
│   │   │   ├── benchmark-info-modal.tsx    # Click modal
│   │   │   └── benchmark-card.tsx
│   │   ├── model/
│   │   │   ├── model-card.tsx
│   │   │   ├── model-links.tsx
│   │   │   └── model-history-chart.tsx
│   │   ├── compare/
│   │   └── search/
│   │       └── global-search.tsx  # Cmd+K palette
│   ├── lib/
│   │   ├── db/
│   │   │   ├── index.ts         # Drizzle client
│   │   │   ├── schema.ts        # Database schema
│   │   │   └── migrations/
│   │   ├── sync/
│   │   │   ├── sources/
│   │   │   │   ├── huggingface.ts
│   │   │   │   ├── papers-with-code.ts
│   │   │   │   └── arxiv.ts
│   │   │   └── normalizer.ts
│   │   └── api/
│   ├── hooks/
│   ├── stores/
│   │   └── filter-store.ts
│   └── types/
├── drizzle/
├── public/
├── .env.example
├── next.config.ts
├── tailwind.config.ts
├── plan.md                      # This plan (copy for persistence)
└── package.json
```

---

## UI Components: Benchmark Info Feature

### Tooltip (Hover)
```tsx
// components/benchmark/benchmark-info-tooltip.tsx
<TooltipProvider>
  <Tooltip>
    <TooltipTrigger>
      <InfoIcon className="h-4 w-4 text-muted-foreground" />
    </TooltipTrigger>
    <TooltipContent className="max-w-xs">
      <p className="font-medium">{benchmark.name}</p>
      <p className="text-sm text-muted-foreground">{benchmark.description}</p>
      <p className="text-xs mt-1">Click for details</p>
    </TooltipContent>
  </Tooltip>
</TooltipProvider>
```

### Modal (Click)
```tsx
// components/benchmark/benchmark-info-modal.tsx
<Dialog>
  <DialogTrigger asChild>
    <Button variant="ghost" size="icon">
      <InfoIcon className="h-4 w-4" />
    </Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>{benchmark.name}</DialogTitle>
      <DialogDescription>{benchmark.description}</DialogDescription>
    </DialogHeader>
    <div className="space-y-4">
      <Section title="What it Evaluates">
        {benchmark.whatItEvaluates}
      </Section>
      <Section title="Methodology">
        {benchmark.methodology}
      </Section>
      <Section title="Metric">
        {benchmark.metricName} ({benchmark.metricUnit})
        {benchmark.higherIsBetter ? "↑ Higher is better" : "↓ Lower is better"}
      </Section>
      <div className="flex gap-2">
        <ExternalLink href={benchmark.paperUrl}>Paper</ExternalLink>
        <ExternalLink href={benchmark.websiteUrl}>Website</ExternalLink>
        <ExternalLink href={benchmark.datasetUrl}>Dataset</ExternalLink>
      </div>
    </div>
  </DialogContent>
</Dialog>
```

---

## Implementation Phases

### Phase 1: Project Setup (Foundation)
- [ ] Create `model-leaderboard` folder and initialize Next.js project
- [ ] Configure TypeScript, Tailwind CSS, ESLint
- [ ] Set up Neon database and Drizzle ORM
- [ ] Create database schema and run migrations
- [ ] Install and configure shadcn/ui components
- [ ] Set up basic layout (header, sidebar, footer)

### Phase 2: Core Data Layer
- [ ] Seed initial benchmark categories and benchmarks
- [ ] Seed initial organizations (OpenAI, Anthropic, Google, Meta, etc.)
- [ ] Create API routes for models, benchmarks, results
- [ ] Build data fetching hooks with React Query

### Phase 3: Leaderboard Feature
- [ ] Build leaderboard table component with TanStack Table
- [ ] Implement sorting (by any column)
- [ ] Implement filtering (model type, org, license)
- [ ] Add pagination
- [ ] Build benchmark info tooltip and modal components
- [ ] Create category-specific leaderboard pages

### Phase 4: Model & Benchmark Pages
- [ ] Build model detail page with all scores
- [ ] Build benchmark detail page with leaderboard
- [ ] Add external links component (non-obtrusive)
- [ ] Implement historical charts

### Phase 5: Search & Compare
- [ ] Build global search with Cmd+K command palette
- [ ] Implement comparison tool (2-5 models)
- [ ] Add radar chart for visual comparison
- [ ] Generate shareable URLs

### Phase 6: Data Pipeline
- [ ] Build HuggingFace sync service
- [ ] Build Papers with Code sync service
- [ ] Build arXiv sync service
- [ ] Set up GitHub Actions for daily sync
- [ ] Create sync monitoring/logging

### Phase 7: Polish & Launch
- [ ] Mobile responsive design
- [ ] SEO optimization (meta tags, sitemap, structured data)
- [ ] Performance optimization (caching, ISR)
- [ ] Error handling and loading states
- [ ] Deploy to Vercel

---

## Verification Plan

### Manual Testing
1. Browse leaderboard and verify sorting/filtering works
2. Click on benchmark info icons, verify tooltip and modal display correct info
3. View model detail pages, verify all data and links
4. Test comparison tool with multiple models
5. Test search functionality (Cmd+K)
6. Verify mobile responsiveness

### Automated Testing
1. Run `npm run build` - ensure no build errors
2. Run `npm run lint` - ensure no linting errors
3. Run `npm run test` - unit tests for data normalization
4. Test sync endpoints manually or with curl

### Data Verification
1. Trigger manual sync from GitHub Actions
2. Verify new data appears in database
3. Check sync logs for errors
4. Verify daily snapshots are created

---

## Environment Variables

```bash
# Database
DATABASE_URL="postgresql://..."

# Sync
SYNC_SECRET="your-secret-key"
HUGGINGFACE_TOKEN="hf_..."

# Optional: Search
NEXT_PUBLIC_ALGOLIA_APP_ID="..."
ALGOLIA_ADMIN_KEY="..."
```

---

## Critical Files to Create

1. `src/lib/db/schema.ts` - Database schema (foundation)
2. `src/components/leaderboard/leaderboard-table.tsx` - Main feature
3. `src/components/benchmark/benchmark-info-modal.tsx` - Benchmark descriptions
4. `src/lib/sync/sources/huggingface.ts` - Primary data source
5. `.github/workflows/sync-data.yml` - Automated updates
