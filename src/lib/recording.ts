/**
 * تسجيل تلاوة الطفل: MediaRecorder لتسجيل الصوت، وIndexedDB لحفظ
 * آخر تسجيل لكل سورة على الجهاز (دون خادم). إن تعذّر الحفظ يبقى
 * التسجيل في الجلسة الحالية فقط.
 */

export function recordingSupported(): boolean {
  return (
    typeof window !== 'undefined' &&
    'mediaDevices' in navigator &&
    typeof navigator.mediaDevices.getUserMedia === 'function' &&
    'MediaRecorder' in window
  );
}

export interface ActiveRecording {
  recorder: MediaRecorder;
  /** يوقف التسجيل ويعيد الصوت المسجّل. */
  stop: () => Promise<Blob>;
}

/** يطلب إذن الميكروفون ويبدأ التسجيل. يرمي خطأ إن رفض الطفل أو ولي الأمر الإذن. */
export async function startRecording(): Promise<ActiveRecording> {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const recorder = new MediaRecorder(stream);
  const chunks: Blob[] = [];
  recorder.ondataavailable = (event) => {
    if (event.data.size > 0) chunks.push(event.data);
  };
  const stopped = new Promise<Blob>((resolve) => {
    recorder.onstop = () => {
      stream.getTracks().forEach((track) => track.stop());
      resolve(new Blob(chunks, { type: recorder.mimeType || 'audio/webm' }));
    };
  });
  recorder.start();
  return {
    recorder,
    stop: () => {
      recorder.stop();
      return stopped;
    },
  };
}

const DB_NAME = 'madrasati';
const STORE_NAME = 'recordings';

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(STORE_NAME)) {
        request.result.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/** يحفظ آخر تسجيل لسورة ما (يستبدل التسجيل السابق لها). */
export async function saveRecording(surahId: string, blob: Blob): Promise<boolean> {
  try {
    const db = await openDb();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      tx.objectStore(STORE_NAME).put(blob, surahId);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
    db.close();
    return true;
  } catch {
    return false;
  }
}

/** يعيد آخر تسجيل محفوظ لسورة ما، أو null إن لم يوجد. */
export async function loadRecording(surahId: string): Promise<Blob | null> {
  try {
    const db = await openDb();
    const blob = await new Promise<Blob | undefined>((resolve, reject) => {
      const request = db.transaction(STORE_NAME, 'readonly').objectStore(STORE_NAME).get(surahId);
      request.onsuccess = () => resolve(request.result as Blob | undefined);
      request.onerror = () => reject(request.error);
    });
    db.close();
    return blob ?? null;
  } catch {
    return null;
  }
}

/** يحذف التسجيل المحفوظ لسورة ما. */
export async function deleteRecording(surahId: string): Promise<void> {
  try {
    const db = await openDb();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      tx.objectStore(STORE_NAME).delete(surahId);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
    db.close();
  } catch {
    /* الحذف ميزة إضافية: نتجاهل أي خطأ. */
  }
}
