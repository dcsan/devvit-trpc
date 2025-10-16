import { router, publicProcedure, protectedProcedure } from './trpc';

export const appRouter = router({
  getInitialData: publicProcedure.query(async ({ ctx }) => {
    console.log('tRPC getInitialData called with context:', {
      postId: ctx.postId,
      subredditName: ctx.subredditName,
      appVersion: ctx.appVersion,
      hasRedis: !!ctx.redis,
      hasReddit: !!ctx.reddit,
    });

    try {
      // Get count and username from context - no postId required
      const [count, username] = await Promise.all([
        ctx.redis.get('count'),
        ctx.reddit.getCurrentUsername(),
      ]);

      const result = {
        type: 'init' as const,
        postId: ctx.postId || null,
        count: count ? parseInt(count) : 0,
        username: username || null,
        appVersion: ctx.appVersion || null,
        subredditName: ctx.subredditName || null,
      };

      console.log('tRPC getInitialData returning:', result);
      return result;
    } catch (error) {
      console.error('tRPC getInitialData Error:', error);
      // Don't throw, just return default values if something fails
      return {
        type: 'init' as const,
        postId: ctx.postId || null,
        count: 0,
        username: null,
        appVersion: ctx.appVersion || null,
        subredditName: ctx.subredditName || null,
      };
    }
  }),

  incrementCounter: publicProcedure.mutation(async ({ ctx }) => {
    console.log('tRPC incrementCounter called');
    try {
      const count = await ctx.redis.incrBy('count', 1);
      const result = {
        type: 'increment' as const,
        postId: ctx.postId || null,
        count,
      };
      console.log('tRPC incrementCounter returning:', result);
      return result;
    } catch (error) {
      console.error('tRPC incrementCounter error:', error);
      throw new Error('Failed to increment counter');
    }
  }),

  decrementCounter: publicProcedure.mutation(async ({ ctx }) => {
    console.log('tRPC decrementCounter called');
    try {
      const count = await ctx.redis.incrBy('count', -1);
      const result = {
        type: 'decrement' as const,
        postId: ctx.postId || null,
        count,
      };
      console.log('tRPC decrementCounter returning:', result);
      return result;
    } catch (error) {
      console.error('tRPC decrementCounter error:', error);
      throw new Error('Failed to decrement counter');
    }
  }),

  resetCounter: publicProcedure.mutation(async ({ ctx }) => {
    console.log('tRPC resetCounter called');
    try {
      await ctx.redis.set('count', '0');
      const result = {
        type: 'reset' as const,
        postId: ctx.postId || null,
        count: 0,
      };
      console.log('tRPC resetCounter returning:', result);
      return result;
    } catch (error) {
      console.error('tRPC resetCounter error:', error);
      throw new Error('Failed to reset counter');
    }
  }),

  ping: publicProcedure.query(() => {
    console.log('tRPC ping called');
    return { message: 'pong' };
  }),
});

export type AppRouter = typeof appRouter;
