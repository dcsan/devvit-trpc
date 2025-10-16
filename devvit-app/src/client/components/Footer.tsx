import { VersionState } from '../../shared/types/version';

interface FooterProps {
  versionState: VersionState;
  onRetry?: () => void;
}

/**
 * Footer component that displays game version information
 * Shows app version prominently with game-specific branding
 */
export const Footer = ({ versionState, onRetry }: FooterProps) => {
  const versionData = versionState.status === 'success' ? versionState.data : null;
  const { version, buildTime } = versionData || {};
  const buildDate = buildTime ? new Date(buildTime).toLocaleDateString() : '';

  const renderVersionInfo = () => {
    switch (versionState.status) {
      case 'loading':
        return (
          <div className="text-center">
            <div className="text-gray-500 animate-pulse text-sm">Loading game info...</div>
          </div>
        );

      case 'success': {
        return (
          <div className="text-center">
            <div className="text-gray-700 font-medium text-sm">Devvit tRPC</div>
            <div className="text-gray-500 text-xs" title={`Built: ${buildTime}`}>
              Version {version} • {buildDate}
            </div>
          </div>
        );
      }

      case 'error':
        return (
          <div className="text-center">
            <div className="text-gray-700 font-medium text-sm">Devvit tRPC</div>
            <div className="text-red-500 text-xs">
              Version info unavailable
              {onRetry && (
                <button
                  onClick={onRetry}
                  className="ml-1 text-red-600 hover:text-red-700 underline cursor-pointer"
                  title="Retry loading version info"
                >
                  (retry)
                </button>
              )}
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center">
            <div className="text-gray-700 font-medium text-sm">Devvit tRPC</div>
          </div>
        );
    }
  };

  return (
    <footer className="absolute bottom-4 left-1/2 -translate-x-1/2">{renderVersionInfo()}</footer>
  );
};
