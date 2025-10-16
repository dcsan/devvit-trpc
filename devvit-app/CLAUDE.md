# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Devvit tRPC application** - a collaborative counter game that runs within Reddit posts. It demonstrates full end-to-end type safety using tRPC v11, React 19, and Reddit's Devvit platform. The app features a global shared counter backed by Redis, optimistic UI updates, and a mobile-first interface.

## Development Commands

### Core Workflow
- `npm run dev` - Start development server with live reload (runs client, server, and Devvit playtest concurrently)
- `npm run build` - Build both client and server for production
- `npm run check` - Run type checking, linting, and formatting (runs type-check, lint:fix, and prettier)
- `npm run deploy` - Build and upload new version to Reddit
- `npm run login` - Authenticate CLI with Reddit

### Individual Commands
- `npm run build:client` - Build client only (React app)
- `npm run build:server` - Build server only (Express + tRPC)
- `npm run dev:client` - Watch mode for client builds
- `npm run dev:server` - Watch mode for server builds
- `npm run dev:devvit` - Run Devvit playtest only
- `npm run type-check` - TypeScript type checking across all packages
- `npm run lint` - Check for ESLint issues
- `npm run lint:fix` - Auto-fix ESLint issues
- `npm run prettier` - Format code with Prettier

### Just Commands (alternative)
If `just` is installed, you can use shorter commands:
- `just dev`, `just build`, `just deploy`, `just check`, `just lint`, `just prettier`, etc.

## Architecture

### Three-Layer Structure

1. **Client (`src/client/`)** - React 19 webview running in Reddit posts
   - Full-screen React app rendered inside Reddit's iframe
   - Uses tRPC React Query hooks for type-safe API calls
   - Cannot use websockets (use Devvit realtime service instead)
   - Only web-compatible NPM dependencies allowed
   - Communicates with server via tRPC at `/trpc` endpoint

2. **Server (`src/server/`)** - Serverless Express backend
   - Serverless Node.js environment (like AWS Lambda)
   - **No access to**: `fs`, `http`, `https`, `net` modules, websockets, HTTP streaming
   - **Use `fetch` instead of `http`/`https`**
   - Redis available via `import { redis } from '@devvit/web/server'`
   - Read-only filesystem - cannot write files
   - Do not use SQLite or stateful in-memory processes
   - Hosts tRPC router with Express adapter

3. **Shared (`src/shared/`)** - Common types and utilities
   - Types shared between client, server, and Devvit app
   - tRPC automatically infers types, so minimal manual type definitions needed

### tRPC Integration

**Key Files:**
- `src/server/trpc/router.ts` - Define procedures (queries/mutations)
- `src/server/trpc/context.ts` - Create tRPC context with Devvit services (redis, reddit, postId, etc.)
- `src/server/trpc/trpc.ts` - Initialize tRPC instance with middleware
- `src/client/trpc/client.ts` - tRPC client configuration
- `src/server/index.ts` - Express server with tRPC middleware at `/trpc`

**How tRPC Works Here:**
1. Server exports `AppRouter` type from `src/server/index.ts`
2. Client imports the type (not the implementation) for full type inference
3. Client calls `trpc.procedureName.useQuery()` or `trpc.procedureName.useMutation()`
4. Types are automatically inferred end-to-end - no manual API contracts needed
5. All procedures receive Devvit context (redis, reddit, postId, subredditName, appVersion)

**Adding New Procedures:**
1. Add to `appRouter` in `src/server/trpc/router.ts`
2. Use `publicProcedure` or `protectedProcedure`
3. Client automatically gets typed hooks via type inference
4. No need to manually update client types

### Devvit Platform Integration

**Context Access:**
- `context.postId` - Current Reddit post ID
- `context.subredditName` - Current subreddit
- `context.appVersion` - App version from package.json
- `redis` - Redis database (global across all posts)
- `reddit` - Reddit API client (get username, posts, etc.)

**Internal Endpoints (in `src/server/index.ts`):**
- `/internal/on-app-install` - Triggered when app is installed to a subreddit
- `/internal/menu/post-create` - Menu action to create new post with the app

**Configuration (`devvit.json`):**
- Defines build outputs, menu items, triggers, and dev subreddit
- Client builds to `dist/client/index.html`
- Server builds to `dist/server/index.cjs`

## Build System

### Vite Configuration
- **Client**: Standard React + Vite setup with Tailwind CSS
- **Server**: SSR build targeting Node 22, outputs CommonJS bundle
  - Injects build metadata (timestamp, git commit hash) at compile time
  - Tree shaking and minification enabled
  - External node built-in modules

### Concurrent Development
The `npm run dev` command runs three processes in parallel:
1. Client Vite build in watch mode
2. Server Vite build in watch mode
3. Devvit playtest server for live preview

## Code Style Guidelines

**From .cursor/rules:**

1. **TypeScript**
   - Prefer type aliases over interfaces
   - All codebase tooling (TypeScript, Vite, Tailwind, ESLint, Prettier) is configured correctly
   - If there's a bug, check your code first before blaming configuration

2. **Client-Specific**
   - Must use web-compatible NPM dependencies only
   - Cannot use websockets (consult Devvit docs for realtime alternatives)
   - Follow React hooks rules

3. **Server-Specific**
   - Use `fetch` instead of `http`/`https`
   - Cannot write to filesystem (read-only)
   - No websockets or HTTP streaming
   - Redis is the primary data store
   - Serverless architecture - no long-running processes

## Common Patterns

### Adding a New tRPC Procedure

```typescript
// In src/server/trpc/router.ts
export const appRouter = router({
  myNewQuery: publicProcedure.query(async ({ ctx }) => {
    const data = await ctx.redis.get('some-key');
    return { data };
  }),

  myNewMutation: publicProcedure.mutation(async ({ ctx }) => {
    await ctx.redis.set('some-key', 'value');
    return { success: true };
  }),
});
```

### Using tRPC in Client

```typescript
// In a React component
import { trpc } from './trpc/client';

function MyComponent() {
  const { data } = trpc.myNewQuery.useQuery();
  const mutation = trpc.myNewMutation.useMutation();

  return <button onClick={() => mutation.mutate()}>Click</button>;
}
```

### Redis Operations

```typescript
// Common Redis operations in tRPC procedures
await ctx.redis.get('key');
await ctx.redis.set('key', 'value');
await ctx.redis.incrBy('counter', 1);
await ctx.redis.del('key');
```

## Prerequisites

- Node.js 22.2.0 or higher (specified in README)
- Reddit account connected to Reddit Developers
- Devvit CLI (installed globally or via npm)

## Important Notes

- **No websockets**: For real-time features, consult Devvit documentation about their realtime service
- **Global Redis**: Redis state is shared across ALL posts in the subreddit, not per-post (unless you namespace keys by postId)
- **Optimistic updates**: UI updates immediately on mutations, then syncs with server (see `useCounterTRPC` hook)
- **Type safety**: tRPC eliminates the need for manual API type definitions - types flow automatically from server to client
- **Serverless constraints**: Server runs in a Lambda-like environment with restricted module access
- **Mobile-first**: Interface is optimized for mobile Reddit users with large touch targets
