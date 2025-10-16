/**
 * Version information interface containing application version details
 * Used by both client and server for consistent version data structure
 */
export interface VersionInfo {
  /** Application version from package.json (semantic versioning) */
  version: string;
  /** ISO timestamp when the build was created */
  buildTime: string;
  /** Git commit hash if available during build */
  commitHash?: string;
}

/**
 * Build-time metadata interface
 * Used during build process to inject version information
 */
export interface BuildMetadata {
  /** Build timestamp in ISO format */
  timestamp: string;
  /** Git commit hash if git is available */
  commitHash?: string;
}

/**
 * Version state types for client-side state management
 * Represents different states of version info loading
 */
export type VersionState =
  | { status: 'loading' }
  | { status: 'success'; data: VersionInfo }
  | { status: 'error'; message: string };

/**
 * Version hook return type for useVersionInfo hook
 */
export interface UseVersionInfoReturn {
  /** Current version state */
  versionState: VersionState;
  /** Function to retry fetching version info */
  retry: () => void;
}
