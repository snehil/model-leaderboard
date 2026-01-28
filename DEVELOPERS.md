# Developer Guide

This guide covers development setup, architecture decisions, and best practices for contributing to Model Leaderboard.

## Table of Contents

- [Development Setup](#development-setup)
- [Architecture](#architecture)
- [Coding Standards](#coding-standards)
- [Database](#database)
- [Testing](#testing)
- [Adding New Features](#adding-new-features)
- [Deployment](#deployment)

## Development Setup

### Prerequisites

- Node.js 20 or later
- npm, pnpm, or yarn
- PostgreSQL database (local or [Neon](https://neon.tech))
- Git

### Local Development

```bash
# Clone and install
git clone https://github.com/your-username/model-leaderboard.git
cd model-leaderboard
npm install

# Create environment file
cp .env.example .env.local

# Edit .env.local with your database URL
# DATABASE_URL=postgresql://user:pass@host/db

# Set up database
npm run db:push

# Start dev server
npm run dev
```

### VS Code Extensions

Recommended extensions for the best experience:

- ESLint
- Tailwind CSS IntelliSense
- Prettier
- TypeScript Importer

## Architecture

### Directory Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (app)/             # Grouped routes with shared layout
│   ├── api/               # API route handlers
│   └── layout.tsx         # Root layout
├── components/
│   ├── ui/                # Base UI components (shadcn/ui)
│   ├── layout/            # Header, Sidebar, navigation
│   ├── leaderboard/       # Leaderboard-specific components
│   ├── benchmark/         # Benchmark info tooltip/modal
│   └── model/             # Model cards and details
├── lib/
│   ├── db/                # Database client, schema, seed
│   ├── api/               # Server-side query functions
│   ├── security/          # Rate limiting, validation, auth
│   └── utils.ts           # Utility functions
├── stores/                # Zustand stores for client state
├── hooks/                 # Custom React hooks
└── types/                 # TypeScript type definitions
```

### Key Design Decisions

#### Server vs Client Components

- **Server Components** (default): Data fetching, database queries, static content
- **Client Components**: Interactive elements, state management, browser APIs

```tsx
// Server Component (default)
async function ModelList() {
  const models = await getModels(); // Server-side query
  return <ul>{models.map(...)}</ul>;
}

// Client Component
"use client";
function FilterDropdown() {
  const [open, setOpen] = useState(false);
  return <Dropdown open={open} />;
}
```

#### Data Fetching

- Use server-side queries in `src/lib/api/queries.ts`
- Wrap data-dependent components in Suspense
- Use `dynamic = 'force-dynamic'` for pages with database queries

```tsx
export const dynamic = "force-dynamic";

export default async function Page() {
  return (
    <Suspense fallback={<Skeleton />}>
      <DataComponent />
    </Suspense>
  );
}
```

#### State Management

- **Server state**: React Query (automatic in Server Components)
- **UI state**: Zustand with localStorage persistence

```tsx
// Zustand store for filters
export const useFilterStore = create(
  persist(
    (set) => ({
      selectedTypes: [],
      setTypes: (types) => set({ selectedTypes: types }),
    }),
    { name: "filters" }
  )
);
```

## Coding Standards

### TypeScript

- Enable strict mode
- Define types in `src/types/index.ts`
- Use Zod for runtime validation

```tsx
// Good
interface ModelProps {
  model: ModelWithOrganization;
  showBenchmarks?: boolean;
}

// Avoid
function Component(props: any) {...}
```

### Components

- One component per file
- Co-locate styles with components
- Use composition over inheritance

```tsx
// components/model/model-card.tsx
export function ModelCard({ model }: { model: Model }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{model.name}</CardTitle>
      </CardHeader>
    </Card>
  );
}
```

### Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `ModelCard.tsx` |
| Hooks | camelCase with `use` | `useFilters.ts` |
| Utils | camelCase | `formatScore.ts` |
| Types | PascalCase | `ModelWithOrganization` |
| Routes | kebab-case | `/leaderboard/[category]` |

## Database

### Schema

The database schema is defined in `src/lib/db/schema.ts`:

- `organizations` - Model providers (OpenAI, Anthropic, etc.)
- `models` - AI models with metadata
- `benchmark_categories` - Categories (LLM, Vision, etc.)
- `benchmarks` - Individual benchmarks with descriptions
- `benchmark_results` - Model scores on benchmarks

### Migrations

```bash
# Generate migration from schema changes
npm run db:generate

# Apply migrations
npm run db:migrate

# Push schema directly (dev only)
npm run db:push

# Open Drizzle Studio
npm run db:studio
```

### Query Functions

Add new queries to `src/lib/api/queries.ts`:

```typescript
export async function getModelsByCategory(category: string) {
  return db
    .select()
    .from(models)
    .where(eq(models.modelType, category))
    .orderBy(asc(models.name));
}
```

## Testing

### Setup

```bash
# Install test dependencies (if not already installed)
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom

# Run tests
npm run test

# Run with coverage
npm run test:coverage
```

### Writing Tests

```tsx
// __tests__/components/model-card.test.tsx
import { render, screen } from "@testing-library/react";
import { ModelCard } from "@/components/model/model-card";

describe("ModelCard", () => {
  it("renders model name", () => {
    const model = { name: "GPT-4", slug: "gpt-4" };
    render(<ModelCard model={model} />);
    expect(screen.getByText("GPT-4")).toBeInTheDocument();
  });
});
```

### Test Organization

```
__tests__/
├── components/       # Component tests
├── lib/             # Utility and query tests
└── e2e/             # End-to-end tests (Playwright)
```

## Adding New Features

### Adding a New Benchmark

1. Add to seed data in `src/lib/db/seed/benchmarks.ts`
2. Run `POST /api/seed` to update database
3. Results will appear automatically in leaderboards

### Adding a New Page

1. Create route in `src/app/[route]/page.tsx`
2. Add `export const dynamic = 'force-dynamic'` if using database
3. Use Suspense for loading states
4. Update navigation in `src/components/layout/sidebar.tsx`

### Adding a New Component

1. Create in appropriate directory under `src/components/`
2. Export from index file
3. Add tests in `__tests__/components/`

## Deployment

### Vercel (Recommended)

1. Connect repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main

### Docker

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
CMD ["npm", "start"]
```

### Environment Variables

Required for production:

- `DATABASE_URL` - PostgreSQL connection string
- `SYNC_SECRET` - API authentication secret

Optional:

- `HUGGINGFACE_TOKEN` - For HuggingFace sync
- `NODE_ENV` - Set to `production`

## Security

### API Route Protection

All sensitive API routes use the `withSecurity()` wrapper:

```typescript
import { withSecurity } from "@/lib/security";

export const POST = withSecurity(handlePost, {
  rateLimit: true,
  requireAuth: true
});
```

### Input Validation

Use Zod schemas for all user input:

```typescript
import { z } from "zod";

const querySchema = z.object({
  category: z.string().regex(/^[a-z0-9-]+$/),
  limit: z.number().min(1).max(100).optional(),
});
```

### Rate Limiting

- Default: 60 requests/minute per IP
- Sensitive endpoints: 10 requests/minute
- Configurable in `src/lib/security/rate-limit.ts`

## Troubleshooting

### Common Issues

**Build fails with DATABASE_URL error**
- Add `export const dynamic = 'force-dynamic'` to pages with database queries

**TypeScript errors in components**
- Run `npm run lint` to identify issues
- Check that all types are exported from `src/types/index.ts`

**Styles not applying**
- Ensure Tailwind classes are in the safelist if dynamically generated
- Check for conflicting styles with browser dev tools

### Getting Help

- Open an issue on GitHub
- Check existing issues for solutions
- Review the [Next.js documentation](https://nextjs.org/docs)
