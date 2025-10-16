import { trpc } from '../trpc/client';
import { VersionState, UseVersionInfoReturn } from '../../shared/types/version';

/**
 * Custom hook for fetching and managing version information using tRPC
 *
 * NOTE: This now uses data from getInitialData instead of making a separate API call
 *
 * @returns Object containing version state and retry function
 */
export const useVersionInfo = (): UseVersionInfoReturn => {
  const { data: initialData, isLoading, error, refetch } = trpc.getInitialData.useQuery();

  // Convert tRPC query state to our VersionState format
  const versionState: VersionState = (() => {
    if (isLoading) {
      return { status: 'loading' };
    }
    if (error) {
      return { status: 'error', message: error.message };
    }
    if (initialData?.appVersion) {
      return {
        status: 'success',
        data: {
          version: initialData.appVersion,
          buildTime: new Date().toISOString() // Client-side timestamp
        }
      };
    }
    return { status: 'loading' };
  })();

  const retry = () => {
    console.log('Client: Retrying version info fetch');
    void refetch();
  };

  return {
    versionState,
    retry,
  };
};
