const STORAGE_KEYS = {
  user: "jobfinder_user",
  session: "jobfinder_session",
  searches: "jobfinder_searches",
  theme: "jobfinder_theme",
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];

function safeParse<T>(value: string | null, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export const storage = {
  keys: STORAGE_KEYS,

  get<T>(key: StorageKey, fallback: T): T {
    return safeParse(localStorage.getItem(key), fallback);
  },

  set<T>(key: StorageKey, value: T): void {
    localStorage.setItem(key, JSON.stringify(value));
  },

  remove(key: StorageKey): void {
    localStorage.removeItem(key);
  },
};

// Trocar esta camada por um client HTTP no backend futuro.
// A UI não deve conhecer detalhes do mecanismo de persistência.
