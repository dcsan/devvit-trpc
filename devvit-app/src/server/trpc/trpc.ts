import { initTRPC, TRPCError } from '@trpc/server';
import type { TRPCContext } from './context';

const t = initTRPC.context<TRPCContext>().create();

export const router = t.router;
export const publicProcedure = t.procedure;

// Middleware to ensure postId exists
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.postId) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'postId is required but missing from context',
    });
  }
  return next({
    ctx: {
      ...ctx,
      postId: ctx.postId, // TypeScript now knows postId is defined
    },
  });
});
