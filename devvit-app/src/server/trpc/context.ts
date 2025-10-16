import { CreateExpressContextOptions } from '@trpc/server/adapters/express';
import { context, redis, reddit } from '@devvit/web/server';

export type TRPCContext = {
  postId: string | undefined;
  redis: typeof redis;
  reddit: typeof reddit;
  subredditName: string | undefined;
  appVersion: string | undefined;
  postData: any | undefined;
};

export const createTRPCContext = async (
  opts: CreateExpressContextOptions
): Promise<TRPCContext> => {
  // Try to get context from the request first, fallback to global context
  const devvitContext = (opts.req as any).context || context;

  console.log('tRPC Context Creation:', {
    hasReqContext: !!(opts.req as any).context,
    postId: devvitContext.postId,
    subredditName: devvitContext.subredditName,
    appVersion: devvitContext.appVersion,
  });

  return {
    postId: devvitContext.postId,
    redis,
    reddit,
    subredditName: devvitContext.subredditName,
    appVersion: devvitContext.appVersion,
    postData: devvitContext.postData,
  };
};
