# Users Table

A paginated, sortable, filterable users table with inline editing, built with Next.js 16 App Router and tRPC.

## Features

- **Paginated table** — displays Name, Email (inline-editable), Age, and Phone sourced from [DummyJSON](https://dummyjson.com/users)
- **Column sorting** — click any column header to toggle ascending/descending order
- **Debounced search** — filters by name or email with a 350 ms debounce
- **Inline email editing** — click an email cell to edit in place; save with Enter or blur, cancel with Escape
- **Optimistic updates** — edits apply instantly in the UI and roll back automatically on failure
- **Simulated failures** — 30 % of save requests intentionally fail on the server to demonstrate error recovery via toast notification
- **Shareable URLs** — all table state (page, sort, filter) lives in the URL and survives refresh and browser navigation
- **Dark mode** — light / dark / system theme toggle with no flash on load

## Stack

| Concern                 | Library                 |
| ----------------------- | ----------------------- |
| Framework               | Next.js 16 (App Router) |
| Type-safe API           | tRPC v11                |
| Data fetching & caching | TanStack Query v5       |
| Validation              | Zod v4                  |
| URL state               | nuqs v2                 |
| Styling                 | Tailwind CSS v4         |
| UI primitives           | shadcn/ui               |
| Notifications           | Sonner                  |
| Theme                   | next-themes             |

## Getting started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Architecture

The project follows [Feature-Sliced Design](https://feature-sliced.design/) (FSD). Layers are ordered from most app-specific (top) to most reusable (bottom); a layer may only import from layers below it.

```
src/
├── app/           # Next.js App Router — layout, page, route handlers, global providers
│   ├── providers/ # App-level providers (ThemeProvider)
│   └── _trpc/    # tRPC client provider
├── widgets/       # Self-contained UI blocks composed from features and entities
│   ├── users-view/
│   └── users-table/
├── features/      # User interactions and business scenarios
│   ├── user-inline-edit/
│   ├── users-filter/
│   └── users-sort/
├── entities/      # Business objects — types, schemas, display components
│   └── user/
├── shared/        # Generic, domain-agnostic utilities
│   ├── api/       # tRPC client, TanStack Query setup
│   ├── lib/       # URL parsers, hooks (useDebounce), pure utils
│   └── ui/        # Primitive components (Button, Input, Table, ThemeToggle, …)
└── server/        # tRPC router and procedures (backend, outside FSD layers)
```

## Key design decisions

**Server component for the initial render**
`app/page.tsx` is an async Server Component. It reads `searchParams`, calls the tRPC server-side caller directly (no HTTP round-trip), and passes the result down to `UsersView`. The client receives fully-hydrated data — no loading skeleton on first paint.

**URL as the single source of truth**
All table state (page, sort field, sort direction, filter) lives in the URL via nuqs parsers. `createSearchParamsCache` parses the URL server-side for the prefetch; `useQueryStates` syncs the same parsers on the client. Shareable links, back/forward navigation, and SSR all work with no extra code.

**tRPC for end-to-end type safety**
All data access flows through a tRPC procedure. The Zod input schema on each procedure is the single definition of what the client may send — no duplicated validation, and TypeScript types flow through automatically via `RouterInputs` / `RouterOutputs`.

**Optimistic updates with automatic rollback**
`useInlineEdit` uses `onMutate` to patch the UI immediately and stash the previous value. `onError` rolls back to the stashed value and fires a `sonner` toast. The 30 % simulated failure rate makes this path easy to observe during review.

**In-process sort for filtered results**
The DummyJSON `/users/search` endpoint does not accept sort parameters. When both a filter and a sort are active, the tRPC procedure fetches the filtered page and sorts the results in Node.js. This is correct for DummyJSON's dataset (≤ 208 users) but would require server-side sort support for larger datasets.

## Known limitations

- **No persistence** — `users.update` echoes the input back unchanged (DummyJSON is read-only). A page refresh restores the original data.
- **No authentication** — the tRPC context is empty. Adding auth would mean threading a session into `createContext` and checking it in each procedure.
- **Client-side sort on filtered pages** — sorting filtered results happens in the Node.js procedure, not in the data source. This is a known trade-off of using a read-only external API.
