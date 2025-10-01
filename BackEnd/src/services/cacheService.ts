interface CacheItem {
  data: any;
  timestamp: number;
  ttl: number;
}

class MemoryCache {
  private cache: Map<string, CacheItem> = new Map();

  async get(key: string): Promise<any | null> {
    const item = this.cache.get(key);
    if (!item) return null;

    const now = Date.now();
    if (now - item.timestamp > item.ttl * 1000) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  async set(key: string, data: any, ttlSeconds: number): Promise<void> {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlSeconds
    });
  }

  async del(key: string): Promise<void> {
    this.cache.delete(key);
  }

  async clear(): Promise<void> {
    this.cache.clear();
  }

  getStats(): { keys: number; size: string } {
    return {
      keys: this.cache.size,
      size: `${JSON.stringify([...this.cache.entries()]).length} bytes`
    };
  }
}

// Cache singleton
export const cache = new MemoryCache();

// Funções utilitárias
export const getCache = async (key: string): Promise<any | null> => {
  return await cache.get(key);
};

export const setCache = async (key: string, data: any, ttlSeconds: number): Promise<void> => {
  return await cache.set(key, data, ttlSeconds);
};

export const delCache = async (key: string): Promise<void> => {
  return await cache.del(key);
};

// TTLs padrão (em segundos)
export const TTL = {
  FIXTURES: 15 * 60,        // 15 minutos
  FIXTURES_LIVE: 5 * 60,    // 5 minutos em dia de rodada
  STANDINGS: 30 * 60,       // 30 minutos
  STANDINGS_LIVE: 15 * 60,  // 15 minutos em dia de rodada
  TEAM_MEDIA: 3 * 24 * 60 * 60, // 3 dias
  TEAM_DATA: 24 * 60 * 60,  // 1 dia
} as const;