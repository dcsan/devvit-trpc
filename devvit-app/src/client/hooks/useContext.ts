import { trpc } from '../trpc/client';

export const useContext = () => {
  const { data, isLoading, error } = trpc.getContext.useQuery();

  return {
    postId: data?.postId ?? null,
    subredditName: data?.subredditName ?? null,
    appVersion: data?.appVersion ?? null,
    postData: data?.postData ?? null,
    isLoading,
    error,
  };
};
