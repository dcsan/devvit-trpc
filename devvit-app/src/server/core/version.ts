import { readFileSync } from 'fs';
import { join } from 'path';
import type { VersionInfo, BuildMetadata } from '../../shared/types/version.js';

/**
 * Version Info Service
 * Handles gathering and formatting version information from various sources
 */
export class VersionInfoService {
  private static instance: VersionInfoService;
  private cachedVersionInfo: VersionInfo | null = null;

  private constructor() {}

  /**
   * Get singleton instance of VersionInfoService
   */
  public static getInstance(): VersionInfoService {
    if (!VersionInfoService.instance) {
      VersionInfoService.instance = new VersionInfoService();
    }
    return VersionInfoService.instance;
  }

  /**
   * Get version information from package.json and build metadata
   * Caches result for subsequent calls
   */
  public async getVersionInfo(): Promise<VersionInfo> {
    if (this.cachedVersionInfo) {
      return this.cachedVersionInfo;
    }

    const version = this.getPackageVersion();
    const buildMetadata = this.getBuildMetadata();

    const versionInfo: VersionInfo = {
      version,
      buildTime: buildMetadata.timestamp,
    };

    // Only add commitHash if it exists
    if (buildMetadata.commitHash) {
      versionInfo.commitHash = buildMetadata.commitHash;
    }

    this.cachedVersionInfo = versionInfo;
    return this.cachedVersionInfo;
  }

  /**
   * Read version from package.json
   * Returns "unknown" if package.json is not found or version is missing
   */
  private getPackageVersion(): string {
    try {
      // Look for package.json in the project root (two levels up from this file)
      const packageJsonPath = join(process.cwd(), 'package.json');
      const packageJsonContent = readFileSync(packageJsonPath, 'utf-8');
      const packageJson = JSON.parse(packageJsonContent);

      return packageJson.version || 'unknown';
    } catch (error) {
      console.warn('Failed to read package.json version:', error);
      return 'unknown';
    }
  }

  /**
   * Get build metadata from environment variables or fallback values
   * Build process should inject these values during compilation
   */
  private getBuildMetadata(): BuildMetadata {
    // Try to get build-time injected metadata from environment variables
    // These are injected by Vite during build process
    const buildTime = process.env.BUILD_TIMESTAMP;
    const commitHash = process.env.BUILD_COMMIT_HASH;

    const metadata: BuildMetadata = {
      // Use injected timestamp or fallback to current time
      timestamp: buildTime || new Date().toISOString(),
    };

    // Only add commitHash if it exists and is not undefined
    if (commitHash && commitHash !== 'undefined') {
      metadata.commitHash = commitHash;
    }

    return metadata;
  }

  /**
   * Clear cached version info (useful for testing)
   */
  public clearCache(): void {
    this.cachedVersionInfo = null;
  }
}

/**
 * Convenience function to get version info
 * Uses singleton instance of VersionInfoService
 */
export async function getVersionInfo(): Promise<VersionInfo> {
  const service = VersionInfoService.getInstance();
  return service.getVersionInfo();
}
