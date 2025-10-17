import { CommentSubmissionOptions, context, reddit } from '@devvit/web/server';
import { CommentOptions } from '../../shared/types/comment';

/**
 * add comment to the current app widget
 * @param opts
 * @returns
 */
export const addComment = async (opts: CommentOptions) => {
  const { postId, appVersion } = context;
  const runAs = opts.runAs || 'USER';

  if (!postId) {
    throw new Error('postId is required but missing from context');
  }

  const commentData: CommentOptions = {
    id: postId,
    text: opts.text || 'placeholder for version ' + appVersion,
    runAs,
  } as CommentSubmissionOptions;

  try {
    const comment = await reddit.submitComment(commentData);

    console.log('addComment success', {
      commentData,
      commentId: comment.id,
      text: comment.body,
      permalink: comment.permalink,
    });

    return comment;
  } catch (error) {
    console.error(`Error adding comment to post ${postId}:`, error);
    throw error;
  }
};
