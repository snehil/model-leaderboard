# Model Leaderboard

AI Model Benchmark Tracking Platform - The single source of truth for AI model performance.

## Project Overview

This is a Next.js 15 application that tracks AI model benchmarks across all categories (LLMs, vision, code, multimodal, audio, etc.). It aggregates data from multiple sources and provides a comprehensive leaderboard with search, filtering, and comparison features.

## Tech Stack

- **Framework**: Next.js 15 (App Router) + TypeScript
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **Database**: Neon (Serverless PostgreSQL) + Drizzle ORM
- **State Management**: Zustand (UI state) + React Query (server state)
- **Charts**: Recharts
- **Testing**: Vitest + Testing Library
- **Hosting**: Vercel
- **Data Sync**: GitHub Actions (daily cron)

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── leaderboard/       # Leaderboard routes
│   │   ├── page.tsx       # Main leaderboard (overall rankings)
│   │   └── [category]/    # Category-specific leaderboards
│   ├── models/            # Model routes
│   │   ├── page.tsx       # Models list
│   │   └── [slug]/        # Model detail page
│   └── api/               # API routes (seed, cleanup, sync)
├── components/
│   ├── ui/                # shadcn/ui primitives
│   ├── layout/            # Header, Sidebar
│   ├── leaderboard/       # LeaderboardTable component
│   ├── benchmark/         # BenchmarkInfoTooltip, BenchmarkInfoModal
│   ├── model/             # Model cards and details
│   └── compare/           # Comparison tool
├── lib/
│   ├── db/                # Drizzle schema, client, seed data
│   │   ├── schema.ts      # Database schema
│   │   ├── index.ts       # Database client
│   │   └── seed/          # Seed data files
│   ├── api/               # Server-side query functions
│   │   └── queries.ts     # All database queries
│   ├── security/          # Rate limiting, validation, API wrappers
│   └── sync/              # Data sync services
├── stores/                # Zustand stores (filter-store.ts)
├── hooks/                 # React hooks
└── types/                 # TypeScript types (index.ts)
```

## Key Files

- `src/lib/db/schema.ts` - Database schema (models, benchmarks, results)
- `src/lib/api/queries.ts` - All database query functions
- `src/components/leaderboard/leaderboard-table.tsx` - Main leaderboard table
- `src/components/benchmark/benchmark-info-modal.tsx` - Benchmark description modal
- `src/components/benchmark/benchmark-info-tooltip.tsx` - Benchmark hover tooltip
- `src/stores/filter-store.ts` - Filter state management
- `src/components/ui/last-updated.tsx` - Timestamp component for data freshness

## Pages

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | `page.tsx` | Home page with hero and category cards |
| `/leaderboard` | `leaderboard/page.tsx` | Overall rankings + category navigation |
| `/leaderboard/[category]` | `leaderboard/[category]/page.tsx` | Category-specific rankings |
| `/models` | `models/page.tsx` | Browse all models by organization |
| `/models/[slug]` | `models/[slug]/page.tsx` | Model detail with specs and scores |

## Database

Uses Neon (serverless PostgreSQL) with Drizzle ORM. Key tables:
- `organizations` - Model providers (OpenAI, Anthropic, etc.)
- `models` - AI models with metadata and links
- `benchmark_categories` - Categories (LLM, Vision, Code, etc.)
- `benchmarks` - Individual benchmarks with descriptions and methodology
- `benchmark_results` - Model scores on benchmarks

### Free Tier Strategy (Neon 0.5 GB limit)

**Capacity estimates:**
- ~100 organizations, ~500 models, ~100 benchmarks
- ~50,000 results (500 models x 100 benchmarks)
- ~3,000 snapshots (100 benchmarks x 30 days)

**Data retention:**
- Snapshots: 30 days (older auto-deleted)
- Sync logs: 7 days (older auto-deleted)
- Weekly cleanup via GitHub Actions

**Cleanup API:**
- `POST /api/cleanup` - Run full cleanup
- `GET /api/cleanup` - Check storage usage

## Commands

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run lint         # Run ESLint
npm run test         # Run tests
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

## Data Sources

The app pulls benchmark data from:
1. HuggingFace Open LLM Leaderboard
2. Papers with Code API
3. arXiv API
4. Official model announcements

Data is synced daily via GitHub Actions.

## Key Features

1. **Leaderboards** - Global and per-category rankings with tabs for each benchmark
2. **Model Pages** - Detailed model info with all benchmark scores grouped by category
3. **Benchmark Info** - Hover tooltips and click modals explaining what each benchmark evaluates
4. **Last Updated** - Timestamp showing when data was last refreshed
5. **Search** - Global search with Cmd+K command palette (TODO)
6. **Filters** - Filter by model type, organization, license
7. **Comparison** - Compare 2-5 models side-by-side (TODO)
8. **Historical Trends** - Track improvement over time (TODO)

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

### LastUpdated
Shows timestamp of when data was last refreshed (renders server time).

## Security (OWASP Compliant)

### OWASP Top 10 Protections

| Vulnerability | Protection |
|--------------|------------|
| Injection | Parameterized queries (Drizzle ORM), Zod validation |
| Broken Auth | Secure token comparison, constant-time checks |
| Sensitive Data | HTTPS only, security headers, no stack traces |
| XXE | JSON only, no XML parsing |
| Broken Access | Auth middleware, rate limiting |
| Security Misconfig | Strict CSP, security headers in next.config.ts |
| XSS | React escaping, CSP, input sanitization |
| Insecure Deser | Zod validation on all inputs |
| Vulnerable Components | Regular `npm audit` |
| Insufficient Logging | Console logging (enhance for production) |

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
- `src/middleware.ts` - Global request filtering

## Development Notes

- Use Server Components by default, Client Components only when needed
- Add `export const dynamic = 'force-dynamic'` to pages with database queries
- All benchmark info (description, methodology, links) stored in database
- Filter state persisted in localStorage via Zustand
- External links (HuggingFace, GitHub, papers) displayed non-obtrusively
- All API routes should use `withSecurity()` wrapper
- Never expose stack traces in production errors
- Use Suspense boundaries with Skeleton components for loading states
