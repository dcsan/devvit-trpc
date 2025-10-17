import { appInstallPost } from '../core/post';
import { addComment } from '../core/comment';
import { publicProcedure, router } from './trpc';
import { z } from 'zod';

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

  readSub: publicProcedure.query(async ({ ctx }) => {
    console.log('tRPC readSub called');
    try {
      const posts = await ctx.reddit
        .getTopPosts({
          subredditName: 'popular',
          timeframe: 'day',
          limit: 10,
        })
        .all();

      const postsWithVotes = posts.map((post) => ({
        id: post.id,
        title: post.title,
        author: post.authorName,
        score: post.score,
        numComments: post.numberOfComments,
        subreddit: post.subredditName,
        createdAt: post.createdAt.toISOString(),
        permalink: post.permalink,
        url: post.url,
      }));

      // Sort by score (upvotes) descending
      const sortedPosts = postsWithVotes.sort((a, b) => b.score - a.score);

      console.log('tRPC readSub returning:', {
        count: sortedPosts.length,
        posts: sortedPosts,
      });

      return sortedPosts;
    } catch (error) {
      console.error('tRPC readSub error:', error);
      throw new Error('Failed to fetch posts from r/popular');
    }
  }),

  createAppInstallPost: publicProcedure.mutation(async () => {
    console.log('tRPC createAppInstallPost called');
    try {
      const result = await appInstallPost();
      // console.log('tRPC createAppInstallPost returning:', result);
      return result;
    } catch (error) {
      console.error('tRPC createAppInstallPost error:', error);
      throw new Error('Failed to create app install post');
    }
  }),

  getContext: publicProcedure.query(({ ctx }) => {
    console.log('tRPC getContext called');
    const contextData = {
      postId: ctx.postId || null,
      subredditName: ctx.subredditName || null,
      appVersion: ctx.appVersion || null,
      postData: ctx.postData || null,
    };
    console.log('tRPC getContext returning:', contextData);
    return contextData;
  }),

  postComment: publicProcedure
    .input(
      z.object({
        text: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      console.log('tRPC postComment called with:', { text: input.text });
      try {
        const commentOptions: {
          id: string;
          text?: string;
        } = {
          id: ctx.postId!,
        };
        if (input.text) {
          commentOptions.text = input.text;
        }
        const comment = await addComment(commentOptions);
        console.log('tRPC postComment returning:', {
          id: comment.id,
          body: comment.body,
        });
        return {
          id: comment.id,
          body: comment.body,
          permalink: comment.permalink,
        };
      } catch (error) {
        console.error('tRPC postComment error:', error);
        throw new Error('Failed to post comment');
      }
    }),

  getPostComments: publicProcedure.query(async ({ ctx }) => {
    console.log('tRPC getPostComments called');
    try {
      if (!ctx.postId) {
        throw new Error('postId is required');
      }

      const post = await ctx.reddit.getPostById(ctx.postId as `t3_${string}`);
      const comments = await post.comments.all();

      const commentsWithVotes = comments.map((comment) => ({
        id: comment.id,
        body: comment.body,
        author: comment.authorName,
        score: comment.score,
        createdAt: comment.createdAt.toISOString(),
        permalink: comment.permalink,
      }));

      // Sort by score (upvotes) descending
      const sortedComments = commentsWithVotes.sort((a, b) => b.score - a.score);

      console.log('tRPC getPostComments returning:', {
        count: sortedComments.length,
        comments: sortedComments,
      });

      return sortedComments;
    } catch (error) {
      console.error('tRPC getPostComments error:', error);
      throw new Error('Failed to fetch post comments');
    }
  }),
});

export type AppRouter = typeof appRouter;
