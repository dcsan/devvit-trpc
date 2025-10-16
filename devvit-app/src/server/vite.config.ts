import { defineConfig } from 'vite';
import { builtinModules } from 'node:module';
import { execSync } from 'node:child_process';

// Get build-time metadata
function getBuildMetadata() {
  const timestamp = new Date().toISOString();
  let commitHash: string | undefined;

  try {
    // Try to get git commit hash
    commitHash = execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim();
  } catch (error) {
    // Git not available or not in a git repository
    console.warn('Git commit hash not available:', error);
    commitHash = undefined;
  }

  return {
    BUILD_TIMESTAMP: timestamp,
    BUILD_COMMIT_HASH: commitHash,
  };
}

export default defineConfig({
  define: {
    // Inject build metadata as compile-time constants
    ...Object.fromEntries(
      Object.entries(getBuildMetadata()).map(([key, value]) => [
        `process.env.${key}`,
        JSON.stringify(value),
      ])
    ),
  },
  ssr: {
    noExternal: true,
  },
  build: {
    emptyOutDir: false,
    ssr: 'index.ts',
    outDir: '../../dist/server',
    target: 'node22',
    sourcemap: false, // Disable sourcemaps for production to reduce size
    minify: true, // Enable minification
    rollupOptions: {
      external: [...builtinModules],
      treeshake: true, // Enable tree shaking
      output: {
        format: 'cjs',
        entryFileNames: 'index.cjs',
        inlineDynamicImports: true,
        compact: true, // Compact output
      },
    },
  },
});
