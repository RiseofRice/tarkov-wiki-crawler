import * as fs from 'fs';
import * as path from 'path';

interface CacheEntry {
  query: string;
  type: string;
  tarkovDevUrl: string;
  wikiUrl: string;
  timestamp: number;
}

interface Cache {
  [key: string]: CacheEntry;
}

const CACHE_FILE = path.join(process.cwd(), 'cache.json');
const CACHE_TTL = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

export class CacheManager {
  private cache: Cache = {};

  constructor() {
    this.loadCache();
  }

  private loadCache(): void {
    try {
      if (fs.existsSync(CACHE_FILE)) {
        const data = fs.readFileSync(CACHE_FILE, 'utf-8');
        this.cache = JSON.parse(data);
        // Clean expired entries
        this.cleanExpired();
      }
    } catch (error) {
      console.warn('Could not load cache:', error);
      this.cache = {};
    }
  }

  private saveCache(): void {
    try {
      fs.writeFileSync(CACHE_FILE, JSON.stringify(this.cache, null, 2));
    } catch (error) {
      console.warn('Could not save cache:', error);
    }
  }

  private cleanExpired(): void {
    const now = Date.now();
    let changed = false;
    Object.keys(this.cache).forEach(key => {
      if (now - this.cache[key].timestamp > CACHE_TTL) {
        delete this.cache[key];
        changed = true;
      }
    });
    if (changed) {
      this.saveCache();
    }
  }

  public get(query: string): CacheEntry | null {
    const key = query.toLowerCase();
    const entry = this.cache[key];
    if (entry && Date.now() - entry.timestamp < CACHE_TTL) {
      return entry;
    }
    return null;
  }

  public set(query: string, type: string, tarkovDevUrl: string, wikiUrl: string): void {
    const key = query.toLowerCase();
    this.cache[key] = {
      query,
      type,
      tarkovDevUrl,
      wikiUrl,
      timestamp: Date.now()
    };
    this.saveCache();
  }
}
