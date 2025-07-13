const cache = new Map();

const MAX_CACHE_SIZE = 50; // Maximum number of entries

// TTL in milliseconds: 24 hours
const TTL_MS = 24 * 60 * 60 * 1000; // 86,400,000 ms

const memoryCache = {
  get(key) {
    const entry = cache.get(key);
    if (!entry) return undefined;
    const { value, timestamp } = entry;
    if (Date.now() - timestamp > TTL_MS) {
      cache.delete(key);
      return undefined;
    }
    // LRU: move accessed entry to end
    cache.delete(key);
    cache.set(key, { value, timestamp });
    return value;
  },
  set(key, value) {
    // LRU: remove existing, then set to end
    if (cache.has(key)) {
      cache.delete(key);
    }
    cache.set(key, { value, timestamp: Date.now() });
    // Enforce max size
    while (cache.size > MAX_CACHE_SIZE) {
      // Remove least recently used (first item)
      const firstKey = cache.keys().next().value;
      cache.delete(firstKey);
    }
  },
  has(key) {
    const entry = cache.get(key);
    if (!entry) return false;
    if (Date.now() - entry.timestamp > TTL_MS) {
      cache.delete(key);
      return false;
    }
    return true;
  },
  clear() {
    cache.clear();
  },
};

export async function getOrSetCache(key, fetcher) {
  if (memoryCache.has(key)) {
    return memoryCache.get(key);
  }
  const value = await fetcher();
  memoryCache.set(key, value);
  return value;
}

export default memoryCache;
