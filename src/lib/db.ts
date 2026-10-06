import type { Recipe } from '../types';
import { normalizeRecipe } from './migrate';

/**
 * Almacén local en IndexedDB.
 * Si el navegador no deja guardar (modo incógnito, permisos), la app sigue
 * funcionando con una copia en memoria y avisa de que no se conservará.
 */

// Nombre interno de la base de datos (no se ve). No cambiarlo: se perderían las recetas guardadas.
const DB_NAME = 'recetario-bella';
const DB_VERSION = 1;
const RECIPES = 'recipes';
const KV = 'kv';

let dbPromise: Promise<IDBDatabase | null> | null = null;
const memory = {
  recipes: new Map<string, Recipe>(),
  kv: new Map<string, unknown>(),
};

function openDb(): Promise<IDBDatabase | null> {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve) => {
    try {
      if (typeof indexedDB === 'undefined') return resolve(null);
      const req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(RECIPES)) db.createObjectStore(RECIPES, { keyPath: 'id' });
        if (!db.objectStoreNames.contains(KV)) db.createObjectStore(KV);
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => resolve(null);
      req.onblocked = () => resolve(null);
      setTimeout(() => resolve(null), 4000);
    } catch {
      resolve(null);
    }
  });
  return dbPromise;
}

function run<T>(store: string, mode: IDBTransactionMode, op: (s: IDBObjectStore) => IDBRequest): Promise<T | undefined> {
  return openDb().then(
    (db) =>
      new Promise<T | undefined>((resolve, reject) => {
        if (!db) return resolve(undefined);
        try {
          const tx = db.transaction(store, mode);
          const req = op(tx.objectStore(store));
          tx.oncomplete = () => resolve(req.result as T);
          tx.onerror = () => reject(tx.error);
          tx.onabort = () => reject(tx.error);
        } catch (e) {
          reject(e);
        }
      }),
  );
}

export async function isPersistent(): Promise<boolean> {
  return (await openDb()) !== null;
}

/** Pide al navegador que no borre los datos si falta espacio. */
export async function askForPersistence() {
  try {
    await navigator.storage?.persist?.();
  } catch {
    /* no pasa nada */
  }
}

export async function listRecipes(): Promise<Recipe[]> {
  try {
    const all = await run<Recipe[]>(RECIPES, 'readonly', (s) => s.getAll());
    const list = (all ?? [...memory.recipes.values()]).map(normalizeRecipe);
    return list.sort((a, b) => b.updatedAt - a.updatedAt);
  } catch {
    return [...memory.recipes.values()].sort((a, b) => b.updatedAt - a.updatedAt);
  }
}

export async function saveRecipe(recipe: Recipe): Promise<void> {
  memory.recipes.set(recipe.id, recipe);
  try {
    await run(RECIPES, 'readwrite', (s) => s.put(recipe));
  } catch (e) {
    // Lo más habitual: el móvil se ha quedado sin espacio por las fotos.
    throw new Error('No se ha podido guardar en el móvil. Puede que falte espacio.', { cause: e });
  }
}

export async function deleteRecipe(id: string): Promise<void> {
  memory.recipes.delete(id);
  try {
    await run(RECIPES, 'readwrite', (s) => s.delete(id));
  } catch {
    /* ya se ha quitado de memoria */
  }
}

export async function getKV<T>(key: string): Promise<T | undefined> {
  try {
    const v = await run<T>(KV, 'readonly', (s) => s.get(key));
    return v ?? (memory.kv.get(key) as T | undefined);
  } catch {
    return memory.kv.get(key) as T | undefined;
  }
}

export async function setKV(key: string, value: unknown): Promise<void> {
  memory.kv.set(key, value);
  try {
    await run(KV, 'readwrite', (s) => s.put(value, key));
  } catch {
    /* se queda en memoria */
  }
}

export async function delKV(key: string): Promise<void> {
  memory.kv.delete(key);
  try {
    await run(KV, 'readwrite', (s) => s.delete(key));
  } catch {
    /* nada */
  }
}

export function newId() {
  try {
    return crypto.randomUUID();
  } catch {
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
  }
}
