import open from 'open';
import { CacheManager } from './cache';

export type SearchType = 'item' | 'quest' | 'ammo' | 'key' | 'boss';

export class TarkovSearch {
  private cache: CacheManager;

  constructor() {
    this.cache = new CacheManager();
  }

  /**
   * Detects the type of search based on the query
   */
  private detectType(query: string): SearchType {
    const lowerQuery = query.toLowerCase();
    
    // Known boss names
    const bosses = ['reshala', 'killa', 'shturman', 'sanitar', 'glukhar', 'tagilla', 'kaban', 'kollontay'];
    if (bosses.some(boss => lowerQuery.includes(boss))) {
      return 'boss';
    }

    // Quest-like patterns
    if (lowerQuery.includes('quest') || lowerQuery.match(/^(debut|first|guide|setup|kind|checking)/i)) {
      return 'quest';
    }

    // Ammo patterns
    if (lowerQuery.includes('ammo') || lowerQuery.match(/\d+x\d+/i) || 
        lowerQuery.match(/(ap|bp|bt|ps|pst|m995|m855|m856|fmj)/i)) {
      return 'ammo';
    }

    // Key patterns
    if (lowerQuery.includes('key') || lowerQuery.match(/^(room|dorm|office|factory|customs)/i)) {
      return 'key';
    }

    return 'item';
  }

  /**
   * Generate tarkov.dev URL based on type and query
   */
  private generateTarkovDevUrl(query: string, type: SearchType): string {
    const encodedQuery = encodeURIComponent(query);
    
    switch (type) {
      case 'quest':
        return `https://tarkov.dev/task/${encodedQuery.toLowerCase().replace(/%20/g, '-')}`;
      case 'boss':
        return `https://tarkov.dev/boss/${encodedQuery.toLowerCase().replace(/%20/g, '-')}`;
      case 'ammo':
        return `https://tarkov.dev/ammo`;
      case 'key':
        return `https://tarkov.dev/keys`;
      default:
        return `https://tarkov.dev/item/${encodedQuery.toLowerCase().replace(/%20/g, '-')}`;
    }
  }

  /**
   * Generate wiki URL
   */
  private generateWikiUrl(query: string): string {
    const encodedQuery = encodeURIComponent(query.replace(/ /g, '_'));
    return `https://escapefromtarkov.fandom.com/wiki/${encodedQuery}`;
  }

  /**
   * Search and open URLs for the given query
   */
  public async search(query: string, typeOverride?: SearchType): Promise<void> {
    // Check cache first
    const cached = this.cache.get(query);
    if (cached) {
      console.log(`[Cache hit] Opening cached results for "${query}"...`);
      await this.openUrls(cached.tarkovDevUrl, cached.wikiUrl);
      return;
    }

    // Determine type
    const type = typeOverride || this.detectType(query);
    console.log(`[${type.toUpperCase()}] Searching for "${query}"...`);

    // Generate URLs
    const tarkovDevUrl = this.generateTarkovDevUrl(query, type);
    const wikiUrl = this.generateWikiUrl(query);

    // Cache the result
    this.cache.set(query, type, tarkovDevUrl, wikiUrl);

    // Open URLs
    await this.openUrls(tarkovDevUrl, wikiUrl);
  }

  /**
   * Open URLs in browser
   */
  private async openUrls(tarkovDevUrl: string, wikiUrl: string): Promise<void> {
    console.log(`Opening: ${tarkovDevUrl}`);
    await open(tarkovDevUrl);
    
    // Small delay before opening second URL
    await new Promise(resolve => setTimeout(resolve, 500));
    
    console.log(`Opening: ${wikiUrl}`);
    await open(wikiUrl);
  }
}
