/**
 * Simple cache implementation for API responses
 * 
 * This helps prevent unnecessary duplicate API calls and improves performance
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  query: string;
}

class ApiCache {
  private cache: Map<string, CacheEntry<any>> = new Map();
  private readonly MAX_CACHE_SIZE = 50; // Maximum number of cached responses
  private readonly CACHE_TTL = 5 * 60 * 1000; // Cache time-to-live: 5 minutes
  
  /**
   * Get a cached response or fetch from the API if not cached
   */
  async getOrFetch<T>(
    cacheKey: string,
    fetchFn: () => Promise<T>,
    query: string
  ): Promise<T> {
    // Check if we have a valid cached response
    const cachedEntry = this.cache.get(cacheKey);
    const now = Date.now();
    
    if (
      cachedEntry && 
      now - cachedEntry.timestamp < this.CACHE_TTL &&
      cachedEntry.query === query
    ) {
      console.log(`Cache hit for: ${cacheKey}`);
      return cachedEntry.data;
    }
    
    // If not cached or expired, fetch fresh data
    console.log(`Cache miss for: ${cacheKey}, fetching...`);
    const data = await fetchFn();
    
    // Cache the result
    this.cache.set(cacheKey, {
      data,
      timestamp: now,
      query
    });
    
    // Manage cache size
    this.trimCache();
    
    return data;
  }
  
  /**
   * Clear specific entries from the cache
   */
  clearCache(keyPattern?: string) {
    if (!keyPattern) {
      // Clear entire cache
      this.cache.clear();
      return;
    }
    
    // Clear entries matching the pattern
    for (const key of this.cache.keys()) {
      if (key.includes(keyPattern)) {
        this.cache.delete(key);
      }
    }
  }
  
  /**
   * Reduce cache size if it exceeds the maximum
   */
  private trimCache() {
    if (this.cache.size <= this.MAX_CACHE_SIZE) {
      return;
    }
    
    // Sort entries by age (oldest first)
    const entries = Array.from(this.cache.entries())
      .sort((a, b) => a[1].timestamp - b[1].timestamp);
    
    // Remove oldest entries until we're under the limit
    const toRemove = entries.slice(0, entries.length - this.MAX_CACHE_SIZE);
    for (const [key] of toRemove) {
      this.cache.delete(key);
    }
  }
}

// Export a singleton instance
export const apiCache = new ApiCache(); 