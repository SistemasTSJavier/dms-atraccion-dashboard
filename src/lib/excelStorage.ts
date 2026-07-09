const DB_NAME = 'dms-dashboard-images'
const DB_VERSION = 1
const STORE = 'images'
const EXCEL_KEY = 'imported-excel'

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION)
    req.onupgradeneeded = () => {
      const db = req.result
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE)
      }
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

export async function saveExcelFile(blob: Blob, fileName: string): Promise<void> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite')
    tx.objectStore(STORE).put({ blob, fileName, savedAt: Date.now() }, EXCEL_KEY)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

export async function loadExcelFile(): Promise<{ blob: Blob; fileName: string } | null> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readonly')
    const req = tx.objectStore(STORE).get(EXCEL_KEY)
    req.onsuccess = () => {
      const result = req.result as { blob: Blob; fileName: string } | undefined
      resolve(result ?? null)
    }
    req.onerror = () => reject(req.error)
  })
}

export async function clearExcelFile(): Promise<void> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite')
    tx.objectStore(STORE).delete(EXCEL_KEY)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}
