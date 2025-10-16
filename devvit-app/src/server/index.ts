import express from 'express';
import { createServer, context, getServerPort } from '@devvit/web/server';
import { createPost } from './core/post';

import * as trpcExpress from '@trpc/server/adapters/express';
import { appRouter, type AppRouter } from './trpc/router';
import { createTRPCContext } from './trpc/context';

// Export the router type for client inference
export type { AppRouter };

const app = express();

// Middleware for JSON body parsing
app.use(express.json());
// Middleware for URL-encoded body parsing
app.use(express.urlencoded({ extended: true }));
// Middleware for plain text body parsing
app.use(express.text());

const router = express.Router();

router.post('/internal/on-app-install', async (_req, res): Promise<void> => {
  console.log('🚀 App installed! Creating initial post...');
  console.log(`Subreddit: ${context.subredditName}`);
  try {
    const post = await createPost();

    console.log(`✅ Installation complete! Post created with id: ${post.id}`);
    res.json({
      status: 'success',
      message: `Post created in subreddit ${context.subredditName} with id ${post.id}`,
    });
  } catch (error) {
    console.error(`❌ Error creating post during installation: ${error}`);
    res.status(400).json({
      status: 'error',
      message: 'Failed to create post',
    });
  }
});

router.post('/internal/menu/post-create', async (_req, res): Promise<void> => {
  try {
    const post = await createPost();

    res.json({
      navigateTo: `https://reddit.com/r/${context.subredditName}/comments/${post.id}`,
    });
  } catch (error) {
    console.error(`Error creating post: ${error}`);
    res.status(400).json({
      status: 'error',
      message: 'Failed to create post',
    });
  }
});

// tRPC middleware - handles /api/trpc requests
// IMPORTANT: Devvit requires all client-side API endpoints to end with /api
app.use(
  '/api/trpc',
  (req, res, next) => {
    // CORS headers
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
      res.sendStatus(200);
      return;
    }

    // Debug logging
    console.log(`tRPC Request: ${req.method} ${req.url}`);
    next();
  },
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext: createTRPCContext,
    onError: ({ path, error }) => {
      console.error(`tRPC Error on ${path}:`, error);
    },
  })
);

// Use router middleware for internal Devvit routes
app.use(router);

// Get port from environment variable with fallback
const port = getServerPort();

console.log('🚀 Devvit tRPC server initializing...');
console.log(`🔗 tRPC endpoint will be available at /api/trpc`);

const server = createServer(app);
server.on('error', (err) => console.error(`server error; ${err.stack}`));
server.listen(port);

console.log(`📡 Server listening on port ${port}`);
