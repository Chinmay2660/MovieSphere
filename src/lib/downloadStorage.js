const DB_NAME = "moviesphere_downloads";
const STORE_NAME = "blobs";
const DB_VERSION = 1;
const OPFS_DIR = "downloads";

const opfsSupported = () =>
  typeof navigator !== "undefined" && typeof navigator.storage?.getDirectory === "function";

const openDb = () =>
  new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
  });

const getOpfsFileHandle = async (key, { create = false } = {}) => {
  const root = await navigator.storage.getDirectory();
  const dir = await root.getDirectoryHandle(OPFS_DIR, { create: true });
  return dir.getFileHandle(key, { create });
};

/**
 * Writes download bytes as they arrive (OPFS on mobile/desktop; IDB blob fallback).
 * ponytail: memory fallback holds chunks in RAM — upgrade path is OPFS-only once min iOS is 15.2+.
 */
export const createDownloadSink = async (key) => {
  if (opfsSupported()) {
    const handle = await getOpfsFileHandle(key, { create: true });
    const writable = await handle.createWritable();
    return {
      async write(chunk) {
        await writable.write(chunk);
      },
      async close(_mimeType) {
        await writable.close();
      },
      async abort() {
        try {
          await writable.abort();
        } catch {
          // already closed
        }
        try {
          const root = await navigator.storage.getDirectory();
          const dir = await root.getDirectoryHandle(OPFS_DIR);
          await dir.removeEntry(key);
        } catch {
          // missing file
        }
      },
    };
  }

  const chunks = [];
  return {
    async write(chunk) {
      chunks.push(chunk);
    },
    async close(mimeType) {
      await saveBlob(key, new Blob(chunks, { type: mimeType }));
      chunks.length = 0;
    },
    async abort() {
      chunks.length = 0;
      await deleteBlob(key).catch(() => {});
    },
  };
};

export const saveBlob = async (key, blob) => {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    tx.objectStore(STORE_NAME).put(blob, key);
  });
};

export const getBlob = async (key) => {
  if (opfsSupported()) {
    try {
      const handle = await getOpfsFileHandle(key);
      return await handle.getFile();
    } catch {
      // fall through to IDB
    }
  }

  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const request = tx.objectStore(STORE_NAME).get(key);
    request.onsuccess = () => resolve(request.result ?? null);
    request.onerror = () => reject(request.error);
  });
};

export const deleteBlob = async (key) => {
  if (opfsSupported()) {
    try {
      const root = await navigator.storage.getDirectory();
      const dir = await root.getDirectoryHandle(OPFS_DIR);
      await dir.removeEntry(key);
    } catch {
      // not in OPFS
    }
  }

  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    tx.objectStore(STORE_NAME).delete(key);
  });
};
