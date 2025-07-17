// utils/dedupeAndRankSuggestions.js - Fixed version with complete syntax

/**
 * Enhanced deduplication and ranking for medication suggestions
 * @param {Array} suggestions - Array of medication suggestions
 * @param {Object} options - Ranking options
 * @returns {Array} Deduplicated and ranked suggestions
 */
export function dedupeAndRankSuggestions(suggestions, options = {}) {
  if (!Array.isArray(suggestions) || suggestions.length === 0) {
    return [];
  }

  const { normalizeNames = true, removeIncomplete = true } = options;

  console.log(`🔄 Deduplicating ${suggestions.length} suggestions...`);

  // Step 1: Filter and normalize suggestions
  const normalizedSuggestions = suggestions
    .filter((suggestion) => isValidSuggestion(suggestion, removeIncomplete))
    .map((suggestion) => normalizeSuggestion(suggestion, normalizeNames));

  // Step 2: Create enhanced deduplication map
  const uniqueMap = new Map();

  normalizedSuggestions.forEach((suggestion) => {
    const dedupeKey = createEnhancedDedupeKey(suggestion);

    const existing = uniqueMap.get(dedupeKey);

    if (!existing || shouldReplaceSuggestion(existing, suggestion, options)) {
      uniqueMap.set(dedupeKey, {
        ...suggestion,
        dedupeKey,
        mergedSources: existing
          ? [
              ...(existing.mergedSources || [existing.source]),
              suggestion.source,
            ]
          : [suggestion.source],
      });
    } else {
      // Merge additional information from duplicate
      const merged = mergeSuggestionData(existing, suggestion);
      uniqueMap.set(dedupeKey, merged);
    }
  });

  // Step 3: Convert to array and calculate final scores
  const uniqueSuggestions = Array.from(uniqueMap.values()).map(
    (suggestion) => ({
      ...suggestion,
      finalScore: calculateFinalScore(suggestion, options),
    }),
  );

  // Step 4: Sort by final score
  const sortedSuggestions = uniqueSuggestions.sort((a, b) => {
    // Primary: Final score (higher is better)
    if (a.finalScore !== b.finalScore) {
      return b.finalScore - a.finalScore;
    }

    // Secondary: Original rank if available
    const aRank = a.rank ?? 999;
    const bRank = b.rank ?? 999;
    if (aRank !== bRank) {
      return aRank - bRank;
    }

    // Tertiary: Alphabetical
    return (a.commonName || '').localeCompare(b.commonName || '');
  });

  console.log(
    `✅ Deduplicated to ${sortedSuggestions.length} unique suggestions`,
  );

  return sortedSuggestions;
}

/**
 * Check if a suggestion is valid and complete enough
 */
function isValidSuggestion(suggestion, removeIncomplete) {
  if (!suggestion || typeof suggestion !== 'object') {
    return false;
  }

  // Must have at least one name
  const hasName = suggestion.commonName || suggestion.medicalName;
  if (!hasName) {
    return false;
  }

  // If removing incomplete, require both names
  if (removeIncomplete) {
    return !!(suggestion.commonName && suggestion.medicalName);
  }

  return true;
}

/**
 * Normalize suggestion data for better processing
 */
function normalizeSuggestion(suggestion, normalizeNames) {
  const normalized = { ...suggestion };

  if (normalizeNames) {
    // Normalize name fields
    normalized.commonName = normalizeNameField(suggestion.commonName);
    normalized.medicalName = normalizeNameField(suggestion.medicalName);

    // Ensure both names exist
    if (!normalized.commonName && normalized.medicalName) {
      normalized.commonName = normalized.medicalName;
    }
    if (!normalized.medicalName && normalized.commonName) {
      normalized.medicalName = normalized.commonName;
    }
  }

  // Add normalized search terms for better matching
  normalized._normalizedCommon = (normalized.commonName || '')
    .toLowerCase()
    .trim();
  normalized._normalizedMedical = (normalized.medicalName || '')
    .toLowerCase()
    .trim();

  // Standardize confidence score
  normalized.confidence = Math.max(
    0,
    Math.min(1, normalized.confidence || 0.5),
  );

  // Ensure source is set
  normalized.source = normalized.source || 'unknown';

  return normalized;
}

/**
 * Normalize individual name fields
 */
function normalizeNameField(name) {
  if (!name || typeof name !== 'string') {
    return '';
  }

  return (
    name
      .trim()
      // Remove extra whitespace
      .replace(/\s+/g, ' ')
      // Remove common artifacts
      .replace(/\[.*?\]/g, '') // Remove bracketed content
      .replace(/\(.*?\)/g, '') // Remove parenthetical content
      .replace(/\{.*?\}/g, '') // Remove braced content
      // Clean up punctuation
      .replace(/[^\w\s\-\.]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
  );
}

/**
 * Create an enhanced deduplication key
 */
function createEnhancedDedupeKey(suggestion) {
  const common = suggestion._normalizedCommon || '';
  const medical = suggestion._normalizedMedical || '';

  // Create multiple possible keys for fuzzy matching
  const keys = [`${common}|${medical}`, `${medical}|${common}`];

  // Add simplified versions without common words
  const simplifiedCommon = removeCommonWords(common);
  const simplifiedMedical = removeCommonWords(medical);

  if (simplifiedCommon !== common || simplifiedMedical !== medical) {
    keys.push(`${simplifiedCommon}|${simplifiedMedical}`);
  }

  // Use the shortest meaningful key (usually the most specific)
  return (
    keys
      .filter(
        (key) => key.length > 1 && !key.startsWith('|') && !key.endsWith('|'),
      )
      .sort((a, b) => a.length - b.length)[0] || keys[0]
  );
}

/**
 * Remove common pharmaceutical words for better deduplication
 */
function removeCommonWords(name) {
  const commonWords = [
    'tablet',
    'tablets',
    'capsule',
    'capsules',
    'mg',
    'mcg',
    'ml',
    'oral',
    'extended',
    'release',
    'immediate',
    'delayed',
    'generic',
    'brand',
  ];

  return name
    .split(' ')
    .filter((word) => !commonWords.includes(word.toLowerCase()))
    .join(' ')
    .trim();
}

/**
 * Determine if one suggestion should replace another during deduplication
 */
function shouldReplaceSuggestion(existing, candidate, options) {
  // Higher confidence wins
  if (candidate.confidence > existing.confidence + 0.1) {
    return true;
  }

  // Better source priority (if considerSourceReliability is enabled)
  const considerSourceReliability = options.considerSourceReliability !== false;
  if (considerSourceReliability) {
    const existingPriority = getSourcePriority(existing.source);
    const candidatePriority = getSourcePriority(candidate.source);

    if (candidatePriority < existingPriority) {
      return true;
    }
  }

  // More complete information
  const existingCompleteness = calculateCompleteness(existing);
  const candidateCompleteness = calculateCompleteness(candidate);

  if (candidateCompleteness > existingCompleteness) {
    return true;
  }

  // Better rank (lower number)
  const existingRank = existing.rank ?? 999;
  const candidateRank = candidate.rank ?? 999;

  if (candidateRank < existingRank) {
    return true;
  }

  return false;
}

/**
 * Get source priority (lower number = higher priority)
 */
function getSourcePriority(source) {
  const priorities = {
    rxnav: 1,
    openfda: 2,
    medline: 3,
    fallback: 4,
    unknown: 5,
  };

  return priorities[source] || 5;
}

/**
 * Calculate how complete a suggestion's information is
 */
function calculateCompleteness(suggestion) {
  let score = 0;

  if (suggestion.commonName) score += 1;
  if (suggestion.medicalName) score += 1;
  if (suggestion.manufacturer) score += 1;
  if (suggestion.brandGeneric) score += 0.5;
  if (suggestion.rxcui) score += 0.5;
  if (suggestion.source && suggestion.source !== 'unknown') score += 0.5;

  return score;
}

/**
 * Merge data from duplicate suggestions
 */
function mergeSuggestionData(existing, duplicate) {
  return {
    ...existing,
    // Keep the best confidence
    confidence: Math.max(existing.confidence, duplicate.confidence),

    // Merge manufacturer info
    manufacturer: existing.manufacturer || duplicate.manufacturer,

    // Keep additional identifiers
    rxcui: existing.rxcui || duplicate.rxcui,

    // Merge source information
    mergedSources: [
      ...(existing.mergedSources || [existing.source]),
      duplicate.source,
    ].filter((source, index, array) => array.indexOf(source) === index),

    // Keep any additional metadata
    ...(!existing.summary &&
      duplicate.summary && { summary: duplicate.summary }),
    ...(!existing.link && duplicate.link && { link: duplicate.link }),
  };
}

/**
 * Calculate final ranking score for suggestions
 */
function calculateFinalScore(suggestion, options) {
  let score = 0;

  // Base confidence score (0-100)
  score += suggestion.confidence * 100;

  // Source reliability bonus (if considerSourceReliability is enabled)
  const considerSourceReliability = options.considerSourceReliability !== false;
  if (considerSourceReliability) {
    const sourcePriority = getSourcePriority(suggestion.source);
    score += (6 - sourcePriority) * 10; // 50, 40, 30, 20, 10
  }

  // Exact match bonus (if prioritizeExactMatches is enabled)
  const prioritizeExactMatches = options.prioritizeExactMatches !== false;
  if (prioritizeExactMatches && options.originalQuery) {
    const queryLower = options.originalQuery.toLowerCase();
    const commonLower = (suggestion.commonName || '').toLowerCase();
    const medicalLower = (suggestion.medicalName || '').toLowerCase();

    if (commonLower === queryLower || medicalLower === queryLower) {
      score += 50; // Exact match bonus
    } else if (
      commonLower.startsWith(queryLower) ||
      medicalLower.startsWith(queryLower)
    ) {
      score += 25; // Starts with bonus
    }
  }

  // Completeness bonus
  const completeness = calculateCompleteness(suggestion);
  score += completeness * 10;

  // Multiple source bonus
  if (suggestion.mergedSources && suggestion.mergedSources.length > 1) {
    score += suggestion.mergedSources.length * 5;
  }

  // Name quality bonus
  const nameQuality = calculateNameQuality(suggestion);
  score += nameQuality * 5;

  // Penalize very long names (usually less user-friendly)
  const nameLength = (suggestion.commonName || '').length;
  if (nameLength > 50) {
    score -= (nameLength - 50) * 0.5;
  }

  return Math.max(0, score);
}

/**
 * Calculate quality of medication names
 */
function calculateNameQuality(suggestion) {
  let quality = 0;

  const common = suggestion.commonName || '';
  const medical = suggestion.medicalName || '';

  // Both names present
  if (common && medical) quality += 2;

  // Names are different (more informative)
  if (common !== medical) quality += 1;

  // Reasonable length names
  if (common.length > 2 && common.length < 30) quality += 1;
  if (medical.length > 2 && medical.length < 50) quality += 1;

  // No special characters or artifacts
  if (!/[^\w\s\-\.]/.test(common)) quality += 0.5;
  if (!/[^\w\s\-\.]/.test(medical)) quality += 0.5;

  return quality;
}

/**
 * Create a similarity score between two medication names
 */
function calculateNameSimilarity(name1, name2) {
  if (!name1 || !name2) return 0;

  const n1 = name1.toLowerCase().trim();
  const n2 = name2.toLowerCase().trim();

  if (n1 === n2) return 1.0;

  // Simple similarity based on common characters
  const chars1 = new Set(n1.replace(/\s/g, ''));
  const chars2 = new Set(n2.replace(/\s/g, ''));

  const intersection = new Set([...chars1].filter((char) => chars2.has(char)));
  const union = new Set([...chars1, ...chars2]);

  return intersection.size / union.size;
}

/**
 * Find potential duplicates that might have been missed
 */
export function findPotentialDuplicates(suggestions, threshold = 0.8) {
  const duplicates = [];

  for (let i = 0; i < suggestions.length; i++) {
    for (let j = i + 1; j < suggestions.length; j++) {
      const similarity = Math.max(
        calculateNameSimilarity(
          suggestions[i].commonName,
          suggestions[j].commonName,
        ),
        calculateNameSimilarity(
          suggestions[i].medicalName,
          suggestions[j].medicalName,
        ),
        calculateNameSimilarity(
          suggestions[i].commonName,
          suggestions[j].medicalName,
        ),
        calculateNameSimilarity(
          suggestions[i].medicalName,
          suggestions[j].commonName,
        ),
      );

      if (similarity > threshold) {
        duplicates.push({
          indices: [i, j],
          similarity,
          suggestions: [suggestions[i], suggestions[j]],
        });
      }
    }
  }

  return duplicates;
}

// Export as default and named export for backward compatibility
export default dedupeAndRankSuggestions;
