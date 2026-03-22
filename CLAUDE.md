# Project: Jerrywu001's Blog (js-bridge.com)

Personal front-end development blog of jerrywu001, covering JavaScript, Node.js, Vue, React, CSS, Linux, and more.

**Live site**: https://www.js-bridge.com/
**Stack**: Nuxt 4 + Vue 3 + TypeScript + Tailwind CSS + PostgreSQL + Supabase Auth + Prisma + ImageKit

---

## Project Type

Full-stack Nuxt 4 application (SSR/SSG hybrid). The site is a blog CMS with:
- Markdown-based post authoring with rich components (code highlighting, Mermaid diagrams, KaTeX math, Sandpack React demos, YouTube embeds, etc.)
- User authentication (GitHub, Google, Azure OAuth via Supabase)
- Post management (create, edit, publish, tags, topics)
- Social features (likes, comments, favorites, read tracking)
- Image hosting via ImageKit CDN

---

## Essential Commands

```bash
# Development (uses .env.local)
npm run dev          # Start dev server on http://localhost:3000
# Note: dev script runs `prisma generate` first, then nuxt dev --dotenv .env.local

# Production build
npm run build        # Runs prisma generate + nuxt build

# Static generation (for deployment)
npm run generate      # Runs prisma generate + nuxt generate

# Database operations (all use dotenv-cli with .env.local)
npm run db-client    # prisma generate (required after schema changes)
npm run db-push       # Push schema to database (no migrations)
npm run db-migrate    # Create and apply migration
npm run db-deploy    # Apply migrations in production
npm run db-pull      # Pull schema from database

# Linting
npm run lint          # eslint on all .ts/.tsx/.vue files
```

**Important**: All database scripts use `dotenv-cli` to load `.env.local`. Environment variables are required locally. See `.env.local` for the full list.

---

## Environment Variables

The project requires a `.env.local` file. Key variables:

```env
# Supabase Auth
NUXT_SUPABASE_PROJECT=<supabase-project-id>
NUXT_SUPABASE_CLIENT_KEY=<supabase-anon-key>
NUXT_SUPABASE_SERVER_KEY=<supabase-service-role-key>

# PostgreSQL (via Supabase pooler)
POSTGREL_URL=postgres://postgres.<project>:<password>@aws-*-pooler.supabase.com:5432/postgres

# ImageKit CDN
IMAGEKIT_PUBLIC=<public-key>
IMAGEKIT_SECRET=<private-key>

# App
BASE_URL=http://localhost:3000
HOST=localhost
HTTPS=false
```

---

## Directory Structure

```
.
├── assets/                 # Static assets
├── components/             # Vue components
├── composables/            # Nuxt composables (useAuth, useLogin, useLogout, useSyncUser, usePostCache)
├── layouts/                # Page layouts (auth, default, home, postedit)
├── md-components/          # Custom markdown components (ButtonLink, CodeGroup, Embed, SandBox, Youtube, etc.)
├── pages/                  # File-based routing
├── plugins/                # Nuxt plugins (vue3-toastify)
├── public/                # Static public assets
├── server/                 # Nuxt server routes (Nitro)
│   ├── api/                # Server API endpoints
│   │   ├── bilibili/       # Bilibili API (CORS-enabled)
│   │   ├── ip.ts          # IP lookup
│   │   ├── post/          # Post CRUD (save, search, transform, recently, [id]/*)
│   │   ├── tag/           # Tag operations (all, create)
│   │   ├── upload/        # Image upload (md-image to ImageKit)
│   │   └── user/          # User operations (sync, [id])
│   └── .tsconfig.json     # Server tsconfig (extends .nuxt/tsconfig.server.json)
├── types/                  # TypeScript types
│   ├── index.ts            # Core types (IBlog, SiteUser, Role, Tag, IElement, etc.)
│   └── database.types.ts   # Supabase DB types (stub: `export type Database = any`)
├── utils/                  # Utility functions
│   ├── utils.ts           # Client/server utils (formatSiteUser, isCDNAvatar, uuid, mermaid init, etc.)
│   ├── server.ts          # Server-only utils (prisma singleton, ImageKit upload, avatar sync)
│   ├── imgSwipe.ts        # Image swipe utility
│   ├── toc.ts             # Table of contents utility
│   └── markdown/          # Markdown processing pipeline
│       ├── index.ts       # getTransformedVNode (entry point)
│       ├── remark.ts      # unified pipeline (remark-parse -> remark-gfm -> remark-math -> prism -> rehype-*)
│       └── parse2json.ts  # Converts HAST to IElement JSON
├── prisma/                # Prisma schema and SQL
│   ├── schema.prisma      # Full schema (PostgreSQL)
│   └── sql/               # Raw SQL files
├── docs/                  # Project documentation (code styles, guides, etc.)
├── .nuxt/                 # Nuxt build cache (gitignored)
├── .output/               # Nuxt production output (gitignored)
├── nuxt.config.ts         # Nuxt configuration
├── tailwind.config.ts     # Tailwind configuration
├── eslint.config.js       # ESLint flat config
├── tsconfig.json         # TypeScript config (extends .nuxt/tsconfig.json)
└── package.json
```

---

## Architecture & Data Flow

### Authentication Flow

1. User clicks OAuth login (GitHub/Google/Azure) on `/login` page
2. Supabase OAuth redirects back with auth code
3. `useLogin` composable captures user session via `useSupabaseUser()`
4. On successful auth, `/api/user/sync` is called server-side:
   - Creates/updates PostgreSQL `User` record via Prisma
   - Uploads Supabase avatar (if social login) to ImageKit CDN
   - Updates Supabase user metadata with ImageKit URL
5. `useSyncUser` stores user in Nuxt `useState('site-user')`
6. `useAuth` guards protected routes, redirecting to `/login` if unauthenticated

### State Management

Nuxt `useState()` (SSR-safe reactive state, shared across components):

| State Key | Type | Purpose |
|---|---|---|
| `site-user` | `SiteUser` | Current authenticated user |
| `use-cache` | `IBlog[]` | Cached post list |
| `use-tag-list` | `Tag[]` | Cached tag list |
| `use-post-map` | `Record<string, IBlog>` | Post ID -> post map |
| `use-scroll-top` | `number` | Home page scroll position |
| `login-data` | `T` | OAuth login response data |
| `auth-error` | `string \| null` | Auth error message |

### Database Schema (Prisma - PostgreSQL)

Key models: **User**, **Post**, **Topic**, **Tag**, **Subscriber**, **Read**, **Like**, **Favorite**, **Comment**

- `User` - authorId in Post, has many Posts, Likes, Comments, Favorites, Topics, Subscribers
- `Post` - postId (UUID, unique), title (unique), content (Json[]), tags, topic, author, reads, likes, favorites, comments
- `Topic` - a category/series that groups Posts
- `Tag` - many-to-many with Post via implicit join table
- `Read/Like/Favorite/Comment` - user-post interaction records with occurrenceAt timestamp
- `Subscriber` - topic or user subscription tracking

---

## Important Notes

1. **Node.js >= 17** is required (per README)
2. **pnpm** is the package manager (do not use npm/yarn; lockfile is pnpm-lock.yaml)
3. **Two Prisma schemas were deleted** (schema-mysql.prisma, schema-postgresql.prisma) -- only `prisma/schema.prisma` (PostgreSQL) remains active
4. **Supabase DB types** in `types/database.types.ts` is a stub (`export type Database = any`) -- Supabase type generation is not wired up
5. **User sync** (`/api/user/sync`) is critical: it bridges Supabase Auth with the PostgreSQL blog database
6. **ImageKit** is used for all image CDN needs (avatars, post covers). Supabase Storage is NOT used.
7. **Sentry** module is commented out in `nuxt.config.ts` (was previously configured)
8. The `public/content` directory is gitignored -- static content is generated at build time
9. Color mode: class-based dark mode (`dark:` Tailwind prefixes), configured via `@nuxtjs/color-mode`
10. Route rules: `/api/bilibili/**` has CORS enabled

---

## gstack

Use `/browse` for web browsing. **Never use `mcp__chrome-devtools__*` tools.**

**Available**: `/office-hours` · `/plan-ceo-review` · `/plan-eng-review` · `/plan-design-review` · `/design-consultation` · `/review` · `/ship` · `/land-and-deploy` · `/canary` · `/benchmark` · `/browse` · `/qa` · `/qa-only` · `/design-review` · `/setup-browser-cookies` · `/setup-deploy` · `/retro` · `/investigate` · `/document-release` · `/codex` · `/careful` · `/freeze` · `/guard` · `/unfreeze` · `/gstack-upgrade`
