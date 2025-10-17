import { useState } from 'react';
import { trpc } from '../trpc/client';

interface PostsPageProps {
  onBack: () => void;
}

export const PostsPage = ({ onBack }: PostsPageProps) => {
  const { data: comments, isLoading, error, refetch } = trpc.getPostComments.useQuery();

  const [commentText, setCommentText] = useState('');
  const postCommentMutation = trpc.postComment.useMutation({
    onSuccess: (data) => {
      console.log('Comment posted:', data);
      setCommentText(''); // Clear textarea on success
      void refetch(); // Refresh the comments list
    },
  });

  const handlePostComment = () => {
    if (commentText.trim()) {
      postCommentMutation.mutate({ text: commentText });
    }
  };

  return (
    <div className="flex relative flex-col justify-center items-center min-h-screen gap-6 p-6">
      <button
        onClick={onBack}
        className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
      >
        ← Back to Home
      </button>

      <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
        Post Comments (Sorted by Upvotes)
      </h1>

      {/* Post Comment Section */}
      <div className="w-full max-w-2xl mb-6 p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Post a Comment</h3>
        <textarea
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Enter your comment..."
          className="w-full p-3 border border-gray-300 rounded-lg text-sm resize-vertical min-h-[80px] focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
        <div className="flex gap-2 mt-3">
          <button
            onClick={handlePostComment}
            disabled={postCommentMutation.isPending || !commentText.trim()}
            className="flex-1 bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            {postCommentMutation.isPending ? 'Posting...' : 'Post Comment'}
          </button>
          <button
            onClick={() => void refetch()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Refresh
          </button>
        </div>
        {postCommentMutation.isSuccess && postCommentMutation.data && (
          <div className="mt-3 p-3 bg-teal-50 border border-teal-200 rounded-lg">
            <h4 className="text-sm font-semibold text-teal-900 mb-1">Comment Posted!</h4>
            <p className="text-teal-700 text-sm">{postCommentMutation.data.body}</p>
            <a
              href={`https://reddit.com${postCommentMutation.data.permalink}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-600 text-xs underline mt-1 inline-block"
            >
              View on Reddit
            </a>
          </div>
        )}
        {postCommentMutation.isError && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">Failed to post comment</p>
          </div>
        )}
      </div>

      {isLoading && (
        <div className="text-gray-600 text-center">Loading comments...</div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-center">
          <p className="text-red-700">Failed to load comments: {error.message}</p>
        </div>
      )}

      {comments && comments.length === 0 && (
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-center">
          <p className="text-gray-600">No comments found on this post.</p>
        </div>
      )}

      {comments && comments.length > 0 && (
        <div className="w-full max-w-2xl space-y-4">
          <div className="text-sm text-gray-600 text-center mb-4">
            Total comments: {comments.length}
          </div>

          {comments.map((comment, index) => (
            <div
              key={comment.id}
              className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                {/* Rank Badge */}
                <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 text-white font-bold rounded-full text-sm">
                  #{index + 1}
                </div>

                <div className="flex-1">
                  {/* Author and Score */}
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-semibold text-gray-900">
                      u/{comment.author}
                    </span>
                    <span className="flex items-center gap-1 bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-medium">
                      <svg
                        className="w-3 h-3"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                      </svg>
                      {comment.score}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Comment Body */}
                  <p className="text-gray-700 text-sm mb-2 whitespace-pre-wrap">
                    {comment.body}
                  </p>

                  {/* Permalink */}
                  <a
                    href={`https://reddit.com${comment.permalink}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-xs underline"
                  >
                    View on Reddit
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
