# CLAUDIO - Content Management Dashboard

## Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui (base-nova style, uses `@base-ui/react`)
- **Charts**: recharts (bar, line, area charts)
- **Icons**: lucide-react
- **Auth & DB**: Supabase (PostgreSQL + Auth + RLS)
- **Data**: Metricool API integration (with mock data fallback)
- **RSS**: rss-parser for news aggregation
- **Theme**: Dark mode globally (`.dark` class on `<html>`)

## Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout (html/body shell only)
│   ├── globals.css             # Tailwind + shadcn CSS variables
│   ├── (auth)/                 # Auth route group (no sidebar)
│   │   ├── layout.tsx          # Centered card layout
│   │   ├── login/page.tsx      # Email + Google login
│   │   └── signup/page.tsx     # Registration with email confirmation
│   ├── auth/callback/route.ts  # OAuth callback handler
│   └── (dashboard)/            # Dashboard route group (with sidebar)
│       ├── layout.tsx          # Sidebar + header + user menu
│       ├── page.tsx            # Dashboard home
│       ├── instagram/page.tsx  # Instagram Manager
│       ├── analytics/page.tsx  # Analytics
│       ├── calendar/page.tsx   # Content Calendar
│       ├── competitors/page.tsx # Competitor Tracker
│       └── news/page.tsx       # News Consolidator
├── middleware.ts               # Auth session refresh + route protection
├── components/
│   ├── app-sidebar.tsx         # Sidebar navigation
│   ├── user-menu.tsx           # Avatar dropdown with sign out
│   ├── page-header.tsx         # Reusable page title
│   ├── analytics/              # Analytics chart components
│   ├── calendar/               # Calendar grid + chips + filters
│   ├── competitors/            # Table + detail panel + add dialog
│   ├── instagram/              # Post cards + add dialog
│   ├── news/                   # Feed + cards + topic filter + sidebar
│   └── ui/                     # shadcn/ui components (auto-generated)
├── hooks/
│   └── use-mobile.ts
└── lib/
    ├── utils.ts
    ├── instagram-data.ts
    ├── calendar-data.ts
    ├── competitor-data.ts
    ├── news-data.ts
    ├── news-fetcher.ts         # Server action: RSS parsing
    ├── supabase/               # Supabase integration
    │   ├── client.ts           # Browser client (createBrowserClient)
    │   ├── server.ts           # Server client (createServerClient)
    │   ├── middleware.ts        # Session refresh + auth redirects
    │   └── types.ts            # Database types (all tables)
    └── metricool/              # Metricool API integration
        ├── types.ts
        ├── client.ts
        └── mock-data.ts

supabase/
└── migrations/
    └── 001_initial_schema.sql  # Full schema with RLS policies
```

## Component Conventions

- **shadcn/ui style**: `base-nova` — uses `render` prop pattern (NOT `asChild`).
- **Route groups**: `(auth)` for login/signup (no sidebar), `(dashboard)` for all app pages (with sidebar + user menu).
- **Client components**: Only use `"use client"` when needed. Pages are server components by default.
- **Icons**: Import from `lucide-react`. No `Instagram` icon — use `Camera`.

## Authentication

- **Supabase Auth** with email/password + Google OAuth
- **Middleware** (`src/middleware.ts`) protects all routes except `/login`, `/signup`, `/auth/callback`
- **User menu** in dashboard header shows avatar initials + sign out
- **RLS policies** on all tables ensure data isolation per user

## Database

6 tables with Row Level Security:
- `profiles` — auto-created on signup via trigger
- `instagram_posts` — user's content pipeline
- `competitors` + `competitor_accounts` — multi-platform tracking
- `calendar_items` — cross-platform content calendar
- `saved_news` — bookmarked articles

Run `supabase/migrations/001_initial_schema.sql` in the Supabase SQL Editor to set up.

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=<your-supabase-publishable-key>
```

## Navigation

Add new sections:
1. Create page under `src/app/(dashboard)/`
2. Add route to `navItems` in `app-sidebar.tsx`

## Key Decisions

- **Global dark mode**: Hardcoded `.dark` class on `<html>`
- **Route groups**: `(auth)` and `(dashboard)` separate layouts cleanly
- **No `asChild`**: base-nova uses `render` prop from `@base-ui/react`
- **Sidebar layout**: `SidebarProvider` + `SidebarInset` in dashboard layout
- **RLS**: All data tables use `auth.uid() = user_id` policies

## Metricool Integration

Currently runs with mock data. To connect:
1. Set: `METRICOOL_USER_TOKEN`, `METRICOOL_USER_ID`, `METRICOOL_BLOG_ID`
2. Base URL: `https://app.metricool.com/api`, auth via `X-Mc-Auth` header
3. Dates use `YYYYMMDD` format
