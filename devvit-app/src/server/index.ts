import { createServer, getServerPort } from '@devvit/web/server';
import express from 'express';

import * as trpcExpress from '@trpc/server/adapters/express';
import { lifecycleRouter } from './lifecycleEvents';
import { createTRPCContext } from './trpc/context';
import { appRouter, type AppRouter } from './trpc/router';

// Export the router type for client inference
export type { AppRouter };

const app = express();

// Middleware for JSON body parsing
app.use(express.json());
// Middleware for URL-encoded body parsing
app.use(express.urlencoded({ extended: true }));
// Middleware for plain text body parsing
app.use(express.text());

// tRPC middleware - handles /api/trpc requests
// IMPORTANT: Devvit requires all client-side API endpoints to end with /api
app.use(
  '/api/trpc',
  (req, res, next) => {
    // CORS headers
    // res.header('Access-Control-Allow-Origin', '*');
    // res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    // res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

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

// Use lifecycle router for internal Devvit routes
app.use(lifecycleRouter);

// Get port from environment variable with fallback
const port = getServerPort();

console.log('🚀 Devvit tRPC server initializing...');
console.log(`🔗 tRPC endpoint will be available at /api/trpc`);

const server = createServer(app);
server.on('error', (err) => console.error(`server error; ${err.stack}`));
server.listen(port);

console.log(`📡 Server listening on port ${port}`);
