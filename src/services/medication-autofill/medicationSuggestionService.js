import rxnavService from './rxnavService';
import medlineService from './medlineService';
import openFdaService from './openFdaService';
import dedupeAndRankSuggestions from '../../utils/dedupeAndRankSuggestions';
import { getOrSetCache } from '../../utils/memoryCache';

/**
 * Get medication suggestions from multiple sources, dedupe and rank.
 * Uses memoryCache util with 24-hour TTL for caching.
 * @param {string} query
 * @returns {Promise<Array>} suggestions
 */
export async function getMedicationSuggestions(query) {
  return getOrSetCache(`med-suggestions-${query}`, async () => {
    const results = await Promise.allSettled([
      rxnavService.fetchRxNavSuggestions(query),
      medlineService.fetchMedlineSuggestions(query),
      openFdaService.fetchOpenFdaSuggestions(query),
    ]);
    const allSuggestions = [];
    for (const result of results) {
      if (result.status === 'fulfilled' && Array.isArray(result.value)) {
        allSuggestions.push(...result.value);
      }
    }
    return dedupeAndRankSuggestions(allSuggestions);
  });
}
