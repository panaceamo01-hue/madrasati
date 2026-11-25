import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { createHash } from 'node:crypto';
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

/**
 * After the build finishes, collect every file in dist/ and inject the list
 * into sw.js so the service worker can precache the whole app on first visit.
 * That is what makes the app open with no network.
 * معرّف البناء مشتق من محتوى الملفات (بصمة SHA-256)، لا من الوقت: إن لم
 * يتغير أي ملف يبقى المعرّف نفسه، فيبقى عامل الخدمة نفسه، فلا تظهر لافتة
 * التحديث عند إعادة نشر بلا تغيير (مثل إعادة النشر بعد إضافة متغير بيئة).
 * وعند أي تغيير حقيقي في المحتوى يتغير المعرّف، فيكتشف المتصفح عاملًا
 * جديدًا وتظهر اللافتة — فقط عند توفر تحديث حقًا.
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
            // ملفات الامتحانات (PDF) لا تُحفظ مسبقًا: تُجلب عند الطلب وتُحفظ
            // بعدها في الذاكرة عبر معالج fetch، حتى لا يثقل التثبيت الأول
            // (عشرات الملفات) ولا يفشل التثبيت إن تعذّر ملف واحد.
            if (rel !== 'sw.js' && !rel.startsWith('exams/')) files.push('/' + rel);
          }
        }
      };
      walk(dist);
      const template = readFileSync(join(process.cwd(), 'public', 'sw.js'), 'utf8');
      const hash = createHash('sha256');
      hash.update(template);
      for (const rel of files.sort()) {
        hash.update(rel);
        hash.update(readFileSync(join(dist, rel)));
      }
      const buildId = hash.digest('hex').slice(0, 12);
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
