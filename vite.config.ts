import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

/**
 * After the build finishes, collect every file in dist/ and inject the list
 * into sw.js so the service worker can precache the whole app on first visit.
 * That is what makes the app open with no network.
 * A unique build id (ISO timestamp) is also injected so every deploy gets
 * its own cache name (madrasati-<build-id>); the new worker precaches the
 * new files while the old one keeps serving the open page until the user
 * accepts the update (see src/lib/swUpdate.ts).
 */
function offlinePrecachePlugin() {
  return {
    name: 'madrasati-offline-precache',
    apply: 'build' as const,
    closeBundle() {
      const dist = join(process.cwd(), 'dist');
      const files: string[] = [];
      const walk = (dir: string) => {
        for (const name of readdirSync(dir)) {
          const full = join(dir, name);
          if (statSync(full).isDirectory()) walk(full);
          else {
            const rel = relative(dist, full).split(sep).join('/');
            if (rel !== 'sw.js') files.push('/' + rel);
          }
        }
      };
      walk(dist);
      const buildId = new Date().toISOString().replace(/[:.]/g, '-');
      const template = readFileSync(join(process.cwd(), 'public', 'sw.js'), 'utf8');
      writeFileSync(
        join(dist, 'sw.js'),
        template
          .replace('"__ASSETS__"', JSON.stringify(files.sort()))
          // replaceAll لأن __BUILD_ID__ يظهر أولًا في تعليق أعلى الملف.
          .replaceAll('__BUILD_ID__', buildId),
      );
    },
  };
}

export default defineConfig({
  plugins: [react(), offlinePrecachePlugin()],
});
