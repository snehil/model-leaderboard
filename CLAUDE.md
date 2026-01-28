# Model Leaderboard

AI Model Benchmark Tracking Platform - The single source of truth for AI model performance.

## Project Overview

This is a Next.js 16 application that tracks AI model benchmarks across all categories (LLMs, vision, code, multimodal, audio, etc.). It aggregates data from multiple sources and provides a comprehensive leaderboard with search, filtering, and comparison features.

**Live Site:** https://model-leaderboard.vercel.app
**Status Page:** https://snehil.github.io/model-leaderboard
**Repository:** https://github.com/snehil/model-leaderboard

## Tech Stack

- **Framework**: Next.js 16 (App Router) + TypeScript
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **Database**: Neon (Serverless PostgreSQL) + Drizzle ORM
- **State Management**: Zustand (UI state)
- **Charts**: Recharts
- **Testing**: Vitest + Testing Library
- **Hosting**: Vercel
- **Data Sync**: GitHub Actions (daily cron)

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── leaderboard/       # Leaderboard (global + category)
│   ├── models/            # Model list and detail pages
│   ├── benchmarks/        # Benchmark browsing
│   ├── organizations/     # Organization directory
│   ├── compare/           # Model comparison tool
│   ├── trends/            # Analytics and insights
│   └── api/               # API routes (seed, cleanup, health)
├── components/
│   ├── ui/                # shadcn/ui primitives
│   ├── layout/            # Header, Sidebar
│   ├── leaderboard/       # Leaderboard table component
│   └── benchmark/         # Benchmark info tooltip/modal
├── lib/
│   ├── db/                # Drizzle schema, client, seed data
│   ├── api/               # Query functions
│   └── security/          # Rate limiting, validation
├── stores/                # Zustand stores
├── hooks/                 # Custom React hooks
└── types/                 # TypeScript types
```

## Key Files

- `src/lib/db/schema.ts` - Database schema (models, benchmarks, results)
- `src/lib/api/queries.ts` - Database query functions
- `src/components/leaderboard/leaderboard-table.tsx` - Main leaderboard component
- `src/components/benchmark/benchmark-info-modal.tsx` - Benchmark description modal
- `src/stores/filter-store.ts` - Filter state management
- `src/proxy.ts` - Security proxy (request filtering)

## Pages

| Route | Description |
|-------|-------------|
| `/` | Homepage with hero and category cards |
| `/leaderboard` | Overall model rankings |
| `/leaderboard/[category]` | Category-specific rankings (llm, code, vision, etc.) |
| `/models` | Browse all tracked models |
| `/models/[slug]` | Individual model detail page |
| `/benchmarks` | All benchmarks grouped by category |
| `/organizations` | Organization directory |
| `/compare` | Model comparison tool |
| `/trends` | Analytics and ecosystem insights |

## Database

Uses Neon (serverless PostgreSQL) with Drizzle ORM. Key tables:
- `organizations` - Model providers (OpenAI, Anthropic, etc.)
- `models` - AI models with metadata and links
- `benchmark_categories` - Categories (LLM, Vision, Code, etc.)
- `benchmarks` - Individual benchmarks with descriptions and methodology
- `benchmark_results` - Model scores on benchmarks

### Seeding the Database

```bash
# Local development (recommended)
npx tsx src/lib/db/seed/run-seed.ts

# Via API (requires SYNC_SECRET)
curl -X POST http://localhost:3000/api/seed \
  -H "Authorization: Bearer YOUR_SYNC_SECRET"
```

### Free Tier Strategy (Neon 0.5 GB limit)

**Capacity estimates:**
- ~100 organizations, ~500 models, ~100 benchmarks
- ~50,000 results (500 models x 100 benchmarks)
- ~3,000 snapshots (100 benchmarks x 30 days)

**Data retention:**
- Snapshots: 30 days (older auto-deleted)
- Sync logs: 7 days (older auto-deleted)
- Weekly cleanup via GitHub Actions

## Commands

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run test         # Run tests
npm run lint         # Run ESLint
npm run db:generate  # Generate Drizzle migrations
npm run db:push      # Push schema to database
npm run db:studio    # Open Drizzle Studio
```

## Environment Variables

Required:
- `DATABASE_URL` - Neon PostgreSQL connection string

Optional:
- `SYNC_SECRET` - Secret for sync API endpoints
- `HUGGINGFACE_TOKEN` - HuggingFace API token for data sync

## API Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/api/seed` | POST | Seed database with initial data |
| `/api/cleanup` | POST | Run data cleanup |
| `/api/cleanup` | GET | Check storage usage |
| `/api/health` | GET | Database health check |

## Key Features

1. **Leaderboards** - Global and per-category rankings with benchmark tabs
2. **Model Pages** - Detailed model info with all benchmark scores
3. **Benchmark Info** - Hover tooltips and click modals explaining benchmarks
4. **Trends** - Ecosystem analytics, model distribution, benchmark saturation
5. **Organizations** - Browse AI organizations and their models
6. **Comparison** - Compare models side-by-side (radar charts coming soon)

## Data Sources

The app pulls benchmark data from:
1. HuggingFace Open LLM Leaderboard
2. Papers with Code API
3. arXiv API
4. Official model announcements

Data is synced daily via GitHub Actions.

## Components

### LeaderboardTable
Displays ranked models with:
- Rank badges (gold/silver/bronze for top 3)
- Model name linked to detail page
- Organization name linked to org page
- Model type and license badges
- Score with appropriate formatting

### BenchmarkInfoTooltip
Shows on hover:
- Benchmark name and category
- Short description
- Metric name and unit
- "Click for details" hint

### BenchmarkInfoModal
Shows on click:
- Full description
- What it evaluates
- Methodology
- Scoring details
- Links to paper, website, dataset

## Security (OWASP Compliant)

### Security Headers (next.config.ts)
- `X-Frame-Options: DENY` - Prevents clickjacking
- `X-Content-Type-Options: nosniff` - Prevents MIME sniffing
- `Content-Security-Policy` - Strict CSP
- `Strict-Transport-Security` - HSTS enabled
- `Referrer-Policy` - Strict referrer

### Rate Limiting
- Default: 60 requests/minute per IP
- Sensitive endpoints (/api/sync, /api/cleanup): 10 requests/minute
- Returns 429 with Retry-After header

### Input Validation
- All inputs validated with Zod schemas
- Slugs: `^[a-z0-9]+(?:-[a-z0-9]+)*$`
- UUIDs: RFC 4122 format
- Strings: Length limited, sanitized

### Security Files
- `src/lib/security/rate-limit.ts` - Rate limiting
- `src/lib/security/validation.ts` - Zod schemas
- `src/lib/security/api.ts` - API security middleware
- `src/proxy.ts` - Global request filtering

## Development Notes

- Use Server Components by default, Client Components only when needed
- Add `export const dynamic = 'force-dynamic'` to pages with database queries
- Use Suspense boundaries with Skeleton components for loading states
- All benchmark info (description, methodology, links) stored in database
- Filter state persisted in localStorage via Zustand
- External links displayed non-obtrusively
- All API routes should use `withSecurity()` wrapper
- Never expose stack traces in production errors
