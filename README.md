# Model Leaderboard

**The single source of truth for AI model performance.**

Track and compare AI model benchmarks across LLMs, vision, code, multimodal, audio, and more. Updated daily from HuggingFace, Papers with Code, and official sources.

![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8)
![License](https://img.shields.io/badge/License-MIT-green)

## Features

- **Comprehensive Leaderboards** - Global and per-category rankings across all major benchmarks
- **Model Details** - View specifications, benchmark scores, and external links for every model
- **Benchmark Info** - Tooltips and modals explaining what each benchmark evaluates
- **Daily Updates** - Automated data pipelines pull latest results from multiple sources
- **Search & Filters** - Find models by name, type, organization, or license
- **Model Comparison** - Compare up to 5 models side-by-side with radar charts
- **Historical Trends** - Track how models improve over time

## Quick Start

### Prerequisites

- Node.js 20+
- npm or pnpm
- PostgreSQL database (we recommend [Neon](https://neon.tech))

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/model-leaderboard.git
cd model-leaderboard

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your DATABASE_URL

# Push database schema
npm run db:push

# Seed the database (optional)
curl -X POST http://localhost:3000/api/seed \
  -H "Authorization: Bearer YOUR_SYNC_SECRET"

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `SYNC_SECRET` | No | Secret for protected API routes |
| `HUGGINGFACE_TOKEN` | No | Token for HuggingFace API sync |

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── leaderboard/       # Leaderboard pages
│   ├── models/            # Model detail pages
│   └── api/               # API routes
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── layout/            # Header, Sidebar
│   ├── leaderboard/       # Leaderboard table
│   └── benchmark/         # Benchmark info components
├── lib/
│   ├── db/                # Database schema and queries
│   ├── api/               # Query functions
│   └── security/          # Rate limiting, validation
├── stores/                # Zustand state management
└── types/                 # TypeScript types
```

## Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run test         # Run tests
npm run db:generate  # Generate Drizzle migrations
npm run db:push      # Push schema to database
npm run db:studio    # Open Drizzle Studio
```

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com)
- **Database**: [Neon](https://neon.tech) (Serverless PostgreSQL) + [Drizzle ORM](https://orm.drizzle.team)
- **State**: [Zustand](https://zustand-demo.pmnd.rs) + [React Query](https://tanstack.com/query)
- **Charts**: [Recharts](https://recharts.org)

## API Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/api/seed` | POST | Seed database with initial data |
| `/api/cleanup` | POST | Run data cleanup |
| `/api/cleanup` | GET | Check storage usage |

All API routes require the `SYNC_SECRET` for authentication.

## Data Sources

The app aggregates benchmark data from:

1. **HuggingFace Open LLM Leaderboard** - LLM evaluation results
2. **Papers with Code** - ML paper benchmarks
3. **arXiv API** - Research paper metadata
4. **Official announcements** - Model release data

Data is synced daily via GitHub Actions.

## Contributing

See [DEVELOPERS.md](./DEVELOPERS.md) for development guidelines.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Benchmark data from the open research community
- UI components from [shadcn/ui](https://ui.shadcn.com)
- Icons from [Lucide](https://lucide.dev)
