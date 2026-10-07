// IndexedDB wrapper to store and stream original video files locally with high performance

const DB_NAME = 'EduCaditoVideosDB';
const DB_VERSION = 1;
const STORE_NAME = 'videos';

export interface VideoRecord {
  songId: string;
  blob: Blob;
  name: string;
  mimeType: string;
  updatedAt: number;
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'songId' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveVideoBlob(songId: string, file: File | Blob, originalName: string = ''): Promise<void> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);

    const record: VideoRecord = {
      songId,
      blob: file,
      name: originalName || `${songId}.mp4`,
      mimeType: file.type || 'video/mp4',
      updatedAt: Date.now(),
    };

    store.put(record);

    // Upload to server so videos are available across devices (computer + cell phone)
    try {
      const formData = new FormData();
      formData.append('video', file, originalName || `${songId}.mp4`);
      await fetch(`/api/videos/${songId}`, {
        method: 'POST',
        body: formData,
      });
    } catch (e) {
      console.warn('Could not upload video to server:', e);
    }

    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.error('Error saving video:', err);
  }
}

export async function getVideoUrl(songId: string): Promise<string | null> {
  try {
    // 1. Check IndexedDB first (fastest local client storage on current device)
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);

    const record: VideoRecord | undefined = await new Promise((resolve) => {
      const req = store.get(songId);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => resolve(undefined);
    });

    if (record && record.blob) {
      return URL.createObjectURL(record.blob);
    }
  } catch (err) {
    console.warn(`IndexedDB check for ${songId}:`, err);
  }

  // 2. Check if video exists on server (available on both phone and computer)
  try {
    const res = await fetch('/api/videos');
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.videos && data.videos[songId]) {
        return data.videos[songId];
      }
    }
  } catch (err) {
    console.warn(`Server check for ${songId}:`, err);
  }

  return null;
}

export async function getAllSavedSongIds(): Promise<string[]> {
  const ids = new Set<string>();

  // 1. Local IndexedDB keys
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);

    const keys: string[] = await new Promise((resolve) => {
      const req = store.getAllKeys();
      req.onsuccess = () => resolve(req.result as string[]);
      req.onerror = () => resolve([]);
    });

    keys.forEach(k => ids.add(k));
  } catch {
    // ignore
  }

  // 2. Server shared videos
  try {
    const res = await fetch('/api/videos');
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.videos) {
        Object.keys(data.videos).forEach(k => ids.add(k));
      }
    }
  } catch {
    // ignore
  }

  return Array.from(ids);
}

export async function removeVideo(songId: string): Promise<void> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.delete(songId);
  } catch (err) {
    console.error('Error deleting video locally:', err);
  }

  try {
    await fetch(`/api/videos/${songId}`, { method: 'DELETE' });
  } catch {
    // ignore
  }
}
