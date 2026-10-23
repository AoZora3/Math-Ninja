const readStorage = () => {
  if (typeof window === 'undefined') return null;
  const storage = window.localStorage;
  return storage || null;
};

export const storage = {
  getItem(key, fallback = null) {
    try {
      const store = readStorage();
      const value = store ? store.getItem(key) : null;
      return value === null ? fallback : value;
    } catch {
      return fallback;
    }
  },
  setItem(key, value) {
    try {
      const store = readStorage();
      if (!store) return false;
      store.setItem(key, String(value));
      return true;
    } catch {
      return false;
    }
  },
  removeItem(key) {
    try {
      const store = readStorage();
      if (!store) return false;
      store.removeItem(key);
      return true;
    } catch {
      return false;
    }
  }
};
