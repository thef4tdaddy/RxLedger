import { fetchRxNavSuggestions } from './rxnavService';
import { fetchMedlineSuggestions } from './medlineService';
import { fetchOpenFdaSuggestions } from './openFdaService';
import dedupeAndRankSuggestions from '../../utils/dedupeAndRankSuggestions';
import { getOrSetCache } from '../../utils/cache/memoryCache';
/**
 * Get medication suggestions from multiple sources, dedupe and rank.
 * Uses memoryCache util with 24-hour TTL for caching.
 * @param {string} query
 * @returns {Promise<Array>} suggestions
 */
export async function getMedicationSuggestions(query) {
  const normalizedQuery = query.trim().toLowerCase();
  return getOrSetCache(`med-suggestions-${normalizedQuery}`, async () => {
    const results = await Promise.allSettled([
      fetchRxNavSuggestions(query),
      fetchMedlineSuggestions(query),
      fetchOpenFdaSuggestions(query),
    ]);
    const allSuggestions = [];
    for (const result of results) {
      if (result.status === 'fulfilled' && Array.isArray(result.value)) {
        // Filter out falsy or missing-name suggestions before collecting
        const filtered = result.value.filter((s) => s && s.name);
        allSuggestions.push(...filtered);
      } else if (result.status === 'rejected') {
        console.error('Suggestion fetch failed:', result.reason);
      }
    }
    // Dedupe and rank, then slice to 10 results
    return dedupeAndRankSuggestions(allSuggestions).slice(0, 10);
  });
}
export { getMedicationSuggestions as fetchMedicationSuggestions };
