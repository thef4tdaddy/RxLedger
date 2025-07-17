// services/medicationSuggestionService.js - Enhanced version
import { fetchRxNavSuggestions } from './rxnavService';
import { fetchMedlineSuggestions } from './medlineService';
import { fetchOpenFdaSuggestions } from './openFdaService';
import dedupeAndRankSuggestions from '../../utils/dedupeAndRankSuggestions';
import { getOrSetCache } from '../../utils/cache/memoryCache';

/**
 * Enhanced medication suggestion service with better error handling,
 * performance optimization, and user experience improvements.
 */

// Configuration for different search strategies
const SEARCH_CONFIG = {
  // Minimum query length to trigger API calls
  MIN_QUERY_LENGTH: 2,
  // Maximum suggestions to return
  MAX_SUGGESTIONS: 12,
  // Cache TTL in milliseconds (6 hours)
  CACHE_TTL: 6 * 60 * 60 * 1000,
  // Request timeout in milliseconds
  REQUEST_TIMEOUT: 8000,
  // Parallel vs sequential search strategy
  USE_PARALLEL_SEARCH: true,
};

/**
 * Get medication suggestions from multiple sources with enhanced features
 * @param {string} query - Search query
 * @param {Object} options - Search options
 * @returns {Promise<Array>} Enhanced medication suggestions
 */
export async function getMedicationSuggestions(query, options = {}) {
  // Input validation and normalization
  if (!query || typeof query !== 'string') {
    return [];
  }

  const normalizedQuery = query.trim();

  // Early return for very short queries
  if (normalizedQuery.length < SEARCH_CONFIG.MIN_QUERY_LENGTH) {
    return [];
  }

  // Extract options with defaults
  const {
    maxResults = SEARCH_CONFIG.MAX_SUGGESTIONS,
    includeGeneric = true,
    includeBrand = true,
    preferredSources = ['rxnav', 'openfda', 'medline'],
    timeout = SEARCH_CONFIG.REQUEST_TIMEOUT,
  } = options;

  const cacheKey = `med-suggestions-v2-${normalizedQuery.toLowerCase()}-${JSON.stringify(options)}`;

  try {
    return await getOrSetCache(
      cacheKey,
      async () => {
        console.log(`🔍 Searching medications for: "${normalizedQuery}"`);

        // Create search promises with timeout
        const searchPromises = createSearchPromises(
          normalizedQuery,
          preferredSources,
          timeout,
        );

        let allSuggestions = [];

        if (SEARCH_CONFIG.USE_PARALLEL_SEARCH) {
          // Parallel search for speed
          allSuggestions = await executeParallelSearch(searchPromises);
        } else {
          // Sequential search with fallback
          allSuggestions = await executeSequentialSearch(searchPromises);
        }

        // Filter based on user preferences
        const filteredSuggestions = filterSuggestionsByPreferences(
          allSuggestions,
          { includeGeneric, includeBrand },
        );

        // Enhanced deduplication and ranking
        const rankedSuggestions = dedupeAndRankSuggestions(
          filteredSuggestions,
          {
            prioritizeExactMatches: true,
            considerSourceReliability: true,
            normalizeNames: true,
            removeIncomplete: false,
            originalQuery: normalizedQuery,
          },
        );

        // Limit results and add metadata with relevance scoring
        const finalSuggestions = rankedSuggestions
          .slice(0, maxResults)
          .map((suggestion) =>
            enhanceSuggestionMetadata(
              {
                ...suggestion,
                relevanceScore: calculateRelevanceScore(
                  suggestion,
                  normalizedQuery.toLowerCase(),
                ),
              },
              normalizedQuery,
            ),
          );

        console.log(
          `✅ Found ${finalSuggestions.length} medication suggestions`,
        );
        return finalSuggestions;
      },
      SEARCH_CONFIG.CACHE_TTL,
    );
  } catch (error) {
    console.error('Error in getMedicationSuggestions:', error);
    // Return graceful fallback suggestions
    return createFallbackSuggestions(normalizedQuery);
  }
}

/**
 * Create search promises for different sources with timeout
 */
function createSearchPromises(query, preferredSources, timeout) {
  const promises = [];

  if (preferredSources.includes('rxnav')) {
    promises.push({
      name: 'rxnav',
      promise: withTimeout(fetchRxNavSuggestions(query), timeout, 'RxNav'),
      priority: 1,
    });
  }

  if (preferredSources.includes('openfda')) {
    promises.push({
      name: 'openfda',
      promise: withTimeout(fetchOpenFdaSuggestions(query), timeout, 'OpenFDA'),
      priority: 2,
    });
  }

  if (preferredSources.includes('medline')) {
    promises.push({
      name: 'medline',
      promise: withTimeout(
        fetchMedlineSuggestions(query),
        timeout,
        'MedlinePlus',
      ),
      priority: 3,
    });
  }

  return promises;
}

/**
 * Execute parallel search across all sources
 */
async function executeParallelSearch(searchPromises) {
  const results = await Promise.allSettled(
    searchPromises.map(({ promise, name }) =>
      promise.catch((error) => {
        console.warn(`${name} search failed:`, error.message);
        return [];
      }),
    ),
  );

  const allSuggestions = [];

  results.forEach((result, index) => {
    if (result.status === 'fulfilled' && Array.isArray(result.value)) {
      const sourceName = searchPromises[index].name;
      const priority = searchPromises[index].priority;

      // Add source metadata to suggestions
      const enhancedSuggestions = result.value.map((suggestion) => ({
        ...suggestion,
        source: sourceName,
        sourcePriority: priority,
        confidence: calculateConfidence(suggestion, sourceName),
      }));

      allSuggestions.push(...enhancedSuggestions);
    }
  });

  return allSuggestions;
}

/**
 * Execute sequential search with early success optimization
 */
async function executeSequentialSearch(searchPromises) {
  const allSuggestions = [];

  // Sort by priority for sequential execution
  const sortedPromises = searchPromises.sort((a, b) => a.priority - b.priority);

  for (const { promise, name, priority } of sortedPromises) {
    try {
      const results = await promise;

      if (Array.isArray(results) && results.length > 0) {
        const enhancedResults = results.map((suggestion) => ({
          ...suggestion,
          source: name,
          sourcePriority: priority,
          confidence: calculateConfidence(suggestion, name),
        }));

        allSuggestions.push(...enhancedResults);

        // Early termination if we have enough high-quality results
        if (allSuggestions.length >= SEARCH_CONFIG.MAX_SUGGESTIONS) {
          console.log(
            `⚡ Early termination after ${name} - sufficient results found`,
          );
          break;
        }
      }
    } catch (error) {
      console.warn(`${name} search failed in sequential mode:`, error.message);
      // Continue to next source
    }
  }

  return allSuggestions;
}

/**
 * Filter suggestions based on user preferences
 */
function filterSuggestionsByPreferences(
  suggestions,
  { includeGeneric, includeBrand },
) {
  return suggestions.filter((suggestion) => {
    const isGeneric =
      suggestion.brandGeneric === 'Generic' ||
      suggestion.type === 'generic' ||
      !suggestion.manufacturer;
    const isBrand = !isGeneric;

    return (includeGeneric && isGeneric) || (includeBrand && isBrand);
  });
}

/**
 * Calculate relevance score based on query matching
 */
function calculateRelevanceScore(suggestion, queryLower) {
  let score = 0;

  const commonName = (suggestion.commonName || '').toLowerCase();
  const medicalName = (suggestion.medicalName || '').toLowerCase();

  // Exact match bonus
  if (commonName === queryLower || medicalName === queryLower) {
    score += 100;
  }

  // Starts with query bonus
  if (commonName.startsWith(queryLower) || medicalName.startsWith(queryLower)) {
    score += 50;
  }

  // Contains query bonus
  if (commonName.includes(queryLower) || medicalName.includes(queryLower)) {
    score += 25;
  }

  // Source quality bonus
  if (suggestion.source === 'rxnav') score += 10;
  if (suggestion.source === 'openfda') score += 8;
  if (suggestion.source === 'medline') score += 5;

  // Confidence bonus
  score += (suggestion.confidence || 0) * 10;

  return score;
}

/**
 * Calculate confidence score for suggestions
 */
function calculateConfidence(suggestion, source) {
  let confidence = 0.5; // Base confidence

  // Complete information bonus
  if (suggestion.commonName && suggestion.medicalName) {
    confidence += 0.3;
  }

  // Source reliability
  switch (source) {
    case 'rxnav':
      confidence += 0.2;
      break;
    case 'openfda':
      confidence += 0.15;
      break;
    case 'medline':
      confidence += 0.1;
      break;
  }

  // Additional metadata bonus
  if (suggestion.manufacturer) confidence += 0.1;
  if (suggestion.rxcui) confidence += 0.1;

  return Math.min(confidence, 1.0);
}

/**
 * Enhance suggestion with additional metadata
 */
function enhanceSuggestionMetadata(suggestion, query) {
  return {
    ...suggestion,
    // Add search metadata
    searchQuery: query,
    searchTimestamp: new Date().toISOString(),

    // Ensure required fields for your form
    commonName: suggestion.commonName || suggestion.medicalName || '',
    medicalName: suggestion.medicalName || suggestion.commonName || '',

    // Add helpful UI hints
    displayName: suggestion.commonName || suggestion.medicalName,
    subtitle:
      suggestion.medicalName !== suggestion.commonName
        ? suggestion.medicalName
        : null,

    // Form-ready data
    brandGeneric:
      suggestion.brandGeneric ||
      (suggestion.manufacturer ? 'Brand' : 'Generic'),
    manufacturer: suggestion.manufacturer || '',

    // Metadata for UI
    hasManufacturer: !!suggestion.manufacturer,
    isHighConfidence: (suggestion.confidence || 0) > 0.7,
    sourceDisplay: formatSourceForDisplay(suggestion.source),
  };
}

/**
 * Format source name for display
 */
function formatSourceForDisplay(source) {
  const sourceMap = {
    rxnav: 'RxNav',
    openfda: 'FDA',
    medline: 'MedlinePlus',
  };
  return sourceMap[source] || source;
}

/**
 * Create fallback suggestions for common medications
 */
function createFallbackSuggestions(query) {
  // Common medication fallbacks based on query patterns
  const fallbacks = [
    {
      commonName: query,
      medicalName: query,
      source: 'fallback',
      confidence: 0.3,
      isFallback: true,
      brandGeneric: 'Generic',
    },
  ];

  return fallbacks.map((suggestion) =>
    enhanceSuggestionMetadata(suggestion, query),
  );
}

/**
 * Wrapper to add timeout to any promise
 */
function withTimeout(promise, timeoutMs, sourceName) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(
        () =>
          reject(
            new Error(`${sourceName} request timeout after ${timeoutMs}ms`),
          ),
        timeoutMs,
      ),
    ),
  ]);
}

// Export aliases for backward compatibility
export { getMedicationSuggestions as fetchMedicationSuggestions };

// Export configuration for external customization
export { SEARCH_CONFIG };
