import { VehicleFormData, VehicleImages, INITIAL_FORM_DATA, INITIAL_IMAGES } from '../types';

const DB_NAME = 'VehicleAppDB';
const STORE_NAME = 'drafts';
const DRAFT_KEY = 'current_draft';

// Helper to open DB
const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    // Check if indexedDB is supported
    if (!('indexedDB' in window)) {
      reject(new Error('IndexedDB not supported'));
      return;
    }

    const request = indexedDB.open(DB_NAME, 1);
    
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const saveDraft = async (data: VehicleFormData, images: VehicleImages): Promise<void> => {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    
    // We can store Files directly in IndexedDB
    const draftObject = {
      data,
      images
    };
    
    store.put(draftObject, DRAFT_KEY);
    
    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (error) {
    console.error('Failed to save draft to IndexedDB', error);
  }
};

export const loadDraft = async (): Promise<{ data: VehicleFormData; images: VehicleImages } | null> => {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const request = store.get(DRAFT_KEY);
    
    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        const result = request.result;
        if (!result) {
          resolve(null);
          return;
        }
        
        // Ensure structure matches current types (merge with initials to be safe)
        const mergedData = { ...INITIAL_FORM_DATA, ...(result.data || {}) };
        
        // When restoring images, we need to ensure they are valid keys in VehicleImages
        const mergedImages = { ...INITIAL_IMAGES };
        if (result.images) {
           Object.keys(result.images).forEach(key => {
             if (key in mergedImages) {
               // @ts-ignore
               mergedImages[key] = result.images[key];
             }
           });
        }
        
        resolve({ data: mergedData, images: mergedImages });
      };
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Failed to load draft from IndexedDB', error);
    return null;
  }
};

export const clearDraft = async (): Promise<void> => {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.delete(DRAFT_KEY);
    
    return new Promise((resolve, reject) => {
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
    });
  } catch (error) {
    console.error('Failed to clear draft', error);
  }
};