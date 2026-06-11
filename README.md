# Users Table — Onex Test Task

A paginated, sortable, filterable users table with inline editing built with Next.js 16 App Router.

## Setup

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Features

- **Paginated table** — Name, Email (editable), Age, Phone from [DummyJSON](https://dummyjson.com/users)
- **Sorting** — click any column header (Name, Age) to toggle asc/desc
- **Debounced search** — filters by name or email, 350 ms debounce
- **URL as source of truth** — `?page=2&sortBy=age&sortDir=desc&filter=john` is fully shareable and survives refresh/back-forward
- **Server-side prefetch** — the initial render hits DummyJSON on the server; the client gets hydrated data with no loading flash
- **Inline email edit** — click any email cell, edit, press Enter or blur to save; Escape cancels; 30 % of saves are intentionally failed by the server to demonstrate optimistic rollback + error recovery

## Stack

| Concern | Library |
|---|---|
| Framework | Next.js 16 (App Router) |
| Type-safe API | tRPC v11 |
| Data fetching & caching | TanStack Query v5 |
| Validation | Zod v4 |
| URL state | nuqs v2 |
| Styling | Tailwind CSS v4 |

## Architecture

The project follows [Feature-Sliced Design](https://feature-sliced.design/) (FSD):

```
src/
  app/          → Next.js App Router (layout, page, providers, tRPC route)
  pages/        → Route-level compositions (UsersPage client shell)
  widgets/      → Self-contained UI blocks (UsersTable, UsersPagination, …)
  features/     → User interactions (filter, sort, inline-edit)
  entities/     → Business objects (User schema & types)
  shared/       → Primitives (cn, search-param parsers, tRPC client setup)
  server/       → tRPC router & procedures (backend, outside FSD layers)
```

### Key decisions

**Server component for the initial page**
`app/page.tsx` is an async Server Component that reads `searchParams`, calls the tRPC server-side caller directly (no HTTP round-trip), and wraps the tree in `<HydrateClient>`. The client shell (`UsersPage`) finds the data already in the TanStack Query cache, so the first render never shows a skeleton.

**nuqs for URL state**
Rather than `useState` or `useSearchParams` + manual string parsing, every piece of table state lives in the URL via nuqs parsers. `createSearchParamsCache` parses server-side for the prefetch; `useQueryStates` syncs the same parsers on the client. Back/forward history, sharing, and SSR all work without any extra code.

**tRPC over raw fetch**
All data access goes through a tRPC procedure. The Zod input schema on the procedure is the single definition for what the client is allowed to send — no duplicated validation, and the TypeScript types flow through automatically via `RouterInputs` / `RouterOutputs`.

**Optimistic updates with rollback**
`useInlineEdit` uses TanStack Query's `onMutate` / `onError` pattern: the cache is patched immediately on save, and rolled back if the server returns an error. A 30 % simulated failure rate makes the rollback path easy to trigger during review.

**DummyJSON sorting/search gap**
The DummyJSON `/users/search` endpoint does not accept sort parameters. When a filter is active, the tRPC procedure sorts the results in-process after fetching. This is documented in the procedure with a comment.

### Tradeoffs

- **No real persistence** — the `users.update` procedure returns the input unchanged (DummyJSON is read-only). Optimistic updates and rollback are fully wired up, but a page refresh shows the original data from DummyJSON.
- **No auth** — the tRPC context is empty `{}`. Adding auth would mean threading a session into `createContext` and checking it in procedures.
- **Client-sort on search** — sorting search results in Node.js is fast for DummyJSON's dataset (208 users max), but would need server-side support for larger datasets.
