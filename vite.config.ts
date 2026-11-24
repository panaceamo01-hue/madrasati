import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

/**
 * After the build finishes, collect every file in dist/ and inject the list
 * into sw.js so the service worker can precache the whole app on first visit.
 * That is what makes the app open with no network.
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
      const template = readFileSync(join(process.cwd(), 'public', 'sw.js'), 'utf8');
      writeFileSync(join(dist, 'sw.js'), template.replace('"__ASSETS__"', JSON.stringify(files.sort())));
    },
  };
}

export default defineConfig({
  plugins: [react(), offlinePrecachePlugin()],
});
