import { useState } from 'react';
import { useContext } from '../hooks/useContext';
import { trpc } from '../trpc/client';

interface AdminPageProps {
  onBack: () => void;
}

export const AdminPage = ({ onBack }: AdminPageProps) => {
  const { postData } = useContext();

  console.log('AdminPage.postData', { postData });
  const { data: initialData, refetch } = trpc.getInitialData.useQuery();

  const resetCounterMutation = trpc.resetCounter.useMutation({
    onSuccess: () => {
      void refetch();
    },
  });

  const {
    data: pingData,
    refetch: doPing,
    isFetching: isPinging,
  } = trpc.ping.useQuery(undefined, {
    enabled: false, // Don't auto-fetch on mount
  });

  const {
    data: subData,
    refetch: doReadSub,
    isFetching: isReadingSub,
  } = trpc.readSub.useQuery(undefined, {
    enabled: false, // Don't auto-fetch on mount
  });

  const createPostMutation = trpc.createAppInstallPost.useMutation({
    onSuccess: (data) => {
      console.log('Post created:', data);
    },
  });

  const handleResetCounter = () => {
    resetCounterMutation.mutate();
  };

  const handlePing = () => {
    void doPing();
  };

  const handleReadSub = () => {
    void doReadSub();
  };

  const handleCreatePost = () => {
    createPostMutation.mutate();
  };

  return (
    <div className="flex relative flex-col justify-center items-center min-h-screen gap-6 p-6">
      <button
        onClick={onBack}
        className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
      >
        ← Back to Home
      </button>

      <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">Admin Panel v2</h1>

      {/* Current Stats */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Current Stats</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Counter Value:</span>
            <span className="font-medium">{initialData?.count ?? 'Loading...'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Current User:</span>
            <span className="font-medium">{initialData?.username ?? 'Loading...'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Post ID:</span>
            <span className="font-medium text-xs">{initialData?.postId ?? 'Loading...'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">App Version:</span>
            <span className="font-medium">{initialData?.appVersion ?? 'Loading...'}</span>
          </div>
        </div>
      </div>

      {/* Admin Actions */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">Admin Actions</h2>

        <button
          onClick={handleCreatePost}
          disabled={createPostMutation.isPending}
          className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white font-medium py-3 px-4 rounded-lg transition-colors"
        >
          {createPostMutation.isPending ? 'Creating...' : 'Create App Install Post'}
        </button>

        <button
          onClick={() => void refetch()}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
        >
          Refresh Data
        </button>

        <button
          onClick={handleResetCounter}
          disabled={resetCounterMutation.isPending}
          className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-medium py-3 px-4 rounded-lg transition-colors"
        >
          {resetCounterMutation.isPending ? 'Resetting...' : 'Reset Counter to 0'}
        </button>

        <div className="space-y-2">
          <button
            onClick={handlePing}
            disabled={isPinging}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            {isPinging ? 'Pinging...' : 'Ping Server'}
          </button>
          {pingData && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-center">
              <span className="text-green-700 font-medium">Response: {pingData.message}</span>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <button
            onClick={handleReadSub}
            disabled={isReadingSub}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            {isReadingSub ? 'Reading...' : 'Read Subreddit'}
          </button>
          {subData && (
            <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
              <h4 className="text-sm font-semibold text-purple-900 mb-2">Posts:</h4>
              <ul className="space-y-1">
                {subData.map((post: string, index: number) => (
                  <li key={index} className="text-purple-700 text-sm">
                    • {post}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Debug Info */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Post Data</h3>
        <pre className="text-xs text-gray-600 overflow-auto">
          {JSON.stringify(postData, null, 2)}
        </pre>
      </div>
    </div>
  );
};
