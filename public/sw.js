/* مدرستي — خدمة العمل دون إنترنت.
   قائمة الملفات (__ASSETS__) ومعرّف البناء (__BUILD_ID__) يُحقنان آليًا
   عند البناء من ملفات dist كاملة. معرّف البناء بصمة من المحتوى، فكل نسخة
   مختلفة تحصل على ذاكرة تخزين خاصة بها (madrasati-<بصمة المحتوى>)،
   وأما إعادة النشر بلا تغيير فتبقي المعرّف نفسه فلا تظهر لافتة تحديث.
   فيبقى العامل القديم يخدم الصفحة المفتوحة حتى يقبل المستخدم التحديث
   من داخل التطبيق. */
const CACHE = 'madrasati-__BUILD_ID__';
const ASSETS = "__ASSETS__";

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(ASSETS)));
});

/* لا نستدعي skipWaiting هنا عمدًا: العامل الجديد يبقى في حالة الانتظار
   حتى يضغط المستخدم «حدّث الآن» في لافتة التحديث داخل التطبيق. */
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // فتح الصفحة: من الشبكة إن وُجدت، وإلا من النسخة المحفوظة.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE).then((cache) => cache.put('/index.html', copy));
          return response;
        })
        .catch(() =>
          caches.match('/index.html').then((cached) => cached || caches.match('/')),
        ),
    );
    return;
  }

  // ملفات التطبيق: من الذاكرة المحلية أولًا، ثم الشبكة مع حفظ أي ملف جديد.
  event.respondWith(
    caches.match(request).then(
      (cached) =>
        cached ||
        fetch(request).then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE).then((cache) => cache.put(request, copy));
          }
          return response;
        }),
    ),
  );
});
