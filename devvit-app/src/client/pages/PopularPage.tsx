import { trpc } from '../trpc/client';

interface PopularPageProps {
  onBack: () => void;
}

export const PopularPage = ({ onBack }: PopularPageProps) => {
  const { data: posts, isLoading, error, refetch } = trpc.readSub.useQuery(undefined, {
    enabled: true, // Auto-fetch on mount
  });

  return (
    <div className="flex relative flex-col justify-center items-center min-h-screen gap-6 p-6">
      <button
        onClick={onBack}
        className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
      >
        ← Back to Home
      </button>

      <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
        r/popular - Top Posts Today
      </h1>

      <button
        onClick={() => void refetch()}
        disabled={isLoading}
        className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors"
      >
        {isLoading ? 'Loading...' : 'Refresh Posts'}
      </button>

      {isLoading && (
        <div className="text-gray-600 text-center">Loading popular posts...</div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-center">
          <p className="text-red-700">Failed to load posts: {error.message}</p>
        </div>
      )}

      {posts && posts.length === 0 && (
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-center">
          <p className="text-gray-600">No posts found.</p>
        </div>
      )}

      {posts && posts.length > 0 && (
        <div className="w-full max-w-3xl space-y-4">
          <div className="text-sm text-gray-600 text-center mb-4">
            Showing {posts.length} top posts from r/popular
          </div>

          {posts.map((post, index) => (
            <div
              key={post.id}
              className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                {/* Rank Badge */}
                <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 text-white font-bold rounded-full text-lg">
                  #{index + 1}
                </div>

                <div className="flex-1 min-w-0">
                  {/* Title */}
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 leading-tight">
                    {post.title}
                  </h3>

                  {/* Metadata */}
                  <div className="flex flex-wrap items-center gap-3 mb-2 text-sm">
                    <span className="text-gray-700 font-medium">
                      r/{post.subreddit}
                    </span>
                    <span className="text-gray-500">
                      by u/{post.author}
                    </span>
                    <span className="text-gray-400 text-xs">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 mb-3">
                    <span className="flex items-center gap-1 bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                      </svg>
                      {post.score.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {post.numComments.toLocaleString()}
                    </span>
                  </div>

                  {/* Links */}
                  <div className="flex gap-3">
                    <a
                      href={`https://reddit.com${post.permalink}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium underline"
                    >
                      View Comments
                    </a>
                    {post.url !== `https://reddit.com${post.permalink}` && (
                      <a
                        href={post.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-600 hover:text-purple-800 text-sm font-medium underline"
                      >
                        View Link
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
