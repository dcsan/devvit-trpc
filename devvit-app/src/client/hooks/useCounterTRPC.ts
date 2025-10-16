import { trpc } from '../trpc/client';

export const useCounterTRPC = () => {
  // Query for initial data
  const { data: initialData, isLoading, error } = trpc.getInitialData.useQuery();

  if (error) {
    console.error('Client: Error loading initial data:', error);
  }

  // Get utils using the proper tRPC v11 pattern
  const utils = trpc.useUtils();

  // Mutations for counter operations with optimistic updates
  const incrementMutation = trpc.incrementCounter.useMutation({
    onMutate: async () => {
      // Cancel any outgoing refetches
      await utils.getInitialData.cancel();

      // Snapshot the previous value
      const previousData = utils.getInitialData.getData();

      // Optimistically update to the new value
      if (previousData) {
        utils.getInitialData.setData(undefined, {
          ...previousData,
          count: previousData.count + 1,
        });
      }

      // Return a context object with the snapshotted value
      return { previousData };
    },
    onError: (err, _newData, context) => {
      console.error('Client: Increment mutation failed:', err);
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousData) {
        utils.getInitialData.setData(undefined, context.previousData);
      }
    },
    onSuccess: (data) => {
      // Update the cache with the server response instead of refetching
      const previousData = utils.getInitialData.getData();
      if (previousData) {
        utils.getInitialData.setData(undefined, {
          ...previousData,
          count: data.count,
        });
      }
    },
  });

  const decrementMutation = trpc.decrementCounter.useMutation({
    onMutate: async () => {
      // Cancel any outgoing refetches
      await utils.getInitialData.cancel();

      // Snapshot the previous value
      const previousData = utils.getInitialData.getData();

      // Optimistically update to the new value
      if (previousData) {
        utils.getInitialData.setData(undefined, {
          ...previousData,
          count: previousData.count - 1,
        });
      }

      // Return a context object with the snapshotted value
      return { previousData };
    },
    onError: (err, _newData, context) => {
      console.error('Client: Decrement mutation failed:', err);
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousData) {
        utils.getInitialData.setData(undefined, context.previousData);
      }
    },
    onSuccess: (data) => {
      // Update the cache with the server response instead of refetching
      const previousData = utils.getInitialData.getData();
      if (previousData) {
        utils.getInitialData.setData(undefined, {
          ...previousData,
          count: data.count,
        });
      }
    },
  });

  const increment = () => incrementMutation.mutate();
  const decrement = () => decrementMutation.mutate();

  return {
    count: initialData?.count ?? 0,
    username: initialData?.username ?? null,
    appVersion: initialData?.appVersion ?? null,
    loading: isLoading || incrementMutation.isPending || decrementMutation.isPending,
    error: error?.message || incrementMutation.error?.message || decrementMutation.error?.message,
    increment,
    decrement,
  } as const;
};
