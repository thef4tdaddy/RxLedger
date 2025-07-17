// services/rxnavService.js - Enhanced version with better error handling and performance
export async function fetchRxNavSuggestions(query) {
  const normalizedQuery = query.trim();

  if (!normalizedQuery || normalizedQuery.length < 2) {
    return [];
  }

  try {
    // Use spelling suggestions for better fuzzy matching
    const url = `https://rxnav.nlm.nih.gov/REST/spellingsuggestions.json?name=${encodeURIComponent(normalizedQuery)}`;

    console.log(`🔍 RxNav search for: "${normalizedQuery}"`);

    const response = await fetch(url, {
      headers: {
        Accept: 'application/json',
        'User-Agent': 'RxLedger-App/1.0',
      },
    });

    if (!response.ok) {
      // Fallback to approximate term if spelling suggestions fail
      return await fetchApproximateTerms(normalizedQuery);
    }

    const data = await response.json();

    // Handle spelling suggestions response
    const suggestions = data?.suggestionGroup?.suggestionList?.suggestion || [];

    if (suggestions.length === 0) {
      // Fallback to approximate term search
      return await fetchApproximateTerms(normalizedQuery);
    }

    // Process spelling suggestions to get detailed medication info
    const detailedSuggestions = await Promise.all(
      suggestions
        .slice(0, 8)
        .map((suggestion) => getMedicationDetails(suggestion, normalizedQuery)),
    );

    // Filter out null results and deduplicate
    const validSuggestions = detailedSuggestions.filter(Boolean);
    return deduplicateRxNavResults(validSuggestions);
  } catch (error) {
    console.error('RxNav spelling suggestions failed:', error);
    // Final fallback to approximate terms
    return await fetchApproximateTerms(normalizedQuery);
  }
}

/**
 * Fallback function using approximate terms
 */
async function fetchApproximateTerms(query) {
  try {
    const url = `https://rxnav.nlm.nih.gov/REST/approximateTerm.json?term=${encodeURIComponent(query)}&maxEntries=10`;

    const response = await fetch(url, {
      headers: {
        Accept: 'application/json',
        'User-Agent': 'RxLedger-App/1.0',
      },
    });

    if (!response.ok) {
      throw new Error(`RxNav API error: ${response.status}`);
    }

    const data = await response.json();
    const candidates = data?.approximateGroup?.candidate || [];

    if (candidates.length === 0) {
      return [];
    }

    // Process candidates with better error handling
    const suggestions = await Promise.allSettled(
      candidates
        .slice(0, 8)
        .map((candidate) =>
          getMedicationDetailsFromCandidate(candidate, query),
        ),
    );

    // Extract successful results
    const validSuggestions = suggestions
      .filter((result) => result.status === 'fulfilled' && result.value)
      .map((result) => result.value);

    return deduplicateRxNavResults(validSuggestions);
  } catch (error) {
    console.error('RxNav approximate terms failed:', error);
    return [];
  }
}

/**
 * Get detailed medication information from a spelling suggestion
 */
async function getMedicationDetails(suggestion, originalQuery) {
  try {
    // Search for RxCUI using the suggestion
    const searchUrl = `https://rxnav.nlm.nih.gov/REST/rxcui.json?name=${encodeURIComponent(suggestion)}&search=2`;

    const searchResponse = await fetch(searchUrl);
    if (!searchResponse.ok) {
      return createBasicSuggestion(suggestion, originalQuery);
    }

    const searchData = await searchResponse.json();
    const rxcui = searchData?.idGroup?.rxnormId?.[0];

    if (!rxcui) {
      return createBasicSuggestion(suggestion, originalQuery);
    }

    return await fetchMedicationPropertiesByRxcui(
      rxcui,
      suggestion,
      originalQuery,
    );
  } catch (error) {
    console.error(
      `Error getting details for suggestion "${suggestion}":`,
      error,
    );
    return createBasicSuggestion(suggestion, originalQuery);
  }
}

/**
 * Get detailed medication information from a candidate (approximate terms)
 */
async function getMedicationDetailsFromCandidate(candidate, originalQuery) {
  try {
    const rxcui = candidate.rxcui;
    const term = candidate.term || '';

    if (!rxcui) {
      return createBasicSuggestion(term, originalQuery);
    }

    return await fetchMedicationPropertiesByRxcui(rxcui, term, originalQuery);
  } catch (error) {
    console.error(`Error processing candidate:`, error);
    return createBasicSuggestion(candidate.term || '', originalQuery);
  }
}

/**
 * Fetch detailed medication properties by RxCUI
 */
async function fetchMedicationPropertiesByRxcui(
  rxcui,
  fallbackName,
  originalQuery,
) {
  try {
    // Get concept properties
    const detailsUrl = `https://rxnav.nlm.nih.gov/REST/rxcui/${rxcui}/conceptProperties.json`;
    const detailsResponse = await fetch(detailsUrl);

    if (detailsResponse.status === 404) {
      return createBasicSuggestion(fallbackName, originalQuery, rxcui);
    }

    if (!detailsResponse.ok) {
      console.warn(
        `RxNav details error ${detailsResponse.status} for rxcui ${rxcui}`,
      );
      return createBasicSuggestion(fallbackName, originalQuery, rxcui);
    }

    const detailsData = await detailsResponse.json();
    const concepts = detailsData?.conceptProperties || [];

    if (concepts.length === 0) {
      return createBasicSuggestion(fallbackName, originalQuery, rxcui);
    }

    // Enhanced logic to extract best names
    const medicationInfo = extractMedicationInfo(
      concepts,
      fallbackName,
      originalQuery,
    );

    return {
      ...medicationInfo,
      rxcui,
      source: 'rxnav',
      originalQuery,
      conceptCount: concepts.length,
      hasDetailedInfo: true,
    };
  } catch (error) {
    console.error(`Error fetching properties for rxcui ${rxcui}:`, error);
    return createBasicSuggestion(fallbackName, originalQuery, rxcui);
  }
}

/**
 * Extract the best medication names from RxNav concepts
 */
function extractMedicationInfo(concepts, fallbackName, originalQuery) {
  let commonName = fallbackName;
  let medicalName = fallbackName;
  let brandGeneric = 'Generic';

  // Priority order for different concept types
  const priorityTypes = ['IN', 'PIN', 'MIN', 'SCD', 'SBD', 'GPCK', 'BPCK'];

  // Find the best ingredient name (medical name)
  for (const tty of priorityTypes) {
    const concept = concepts.find((c) => c.tty === tty);
    if (concept) {
      medicalName = concept.name;
      break;
    }
  }

  // Find brand name if available
  const brandConcept = concepts.find((c) => c.tty === 'BN' || c.tty === 'SBD');
  if (brandConcept) {
    commonName = brandConcept.name;
    brandGeneric = 'Brand';
  } else {
    // Use the most relevant concept as common name
    const relevantConcept = findMostRelevantConcept(concepts, originalQuery);
    if (relevantConcept) {
      commonName = relevantConcept.name;
    }
  }

  // Ensure names are different and meaningful
  if (commonName === medicalName && concepts.length > 1) {
    const alternateConcept = concepts.find((c) => c.name !== commonName);
    if (alternateConcept) {
      if (brandGeneric === 'Brand') {
        medicalName = alternateConcept.name;
      } else {
        commonName = alternateConcept.name;
      }
    }
  }

  return {
    commonName: cleanMedicationName(commonName),
    medicalName: cleanMedicationName(medicalName),
    brandGeneric,
    confidence: calculateRxNavConfidence(concepts, originalQuery, commonName),
  };
}

/**
 * Find the most relevant concept based on query similarity
 */
function findMostRelevantConcept(concepts, query) {
  const queryLower = query.toLowerCase();

  // Score concepts by relevance to original query
  const scoredConcepts = concepts.map((concept) => ({
    ...concept,
    relevanceScore: calculateNameRelevance(concept.name, queryLower),
  }));

  // Sort by relevance score and return the best match
  return scoredConcepts.sort((a, b) => b.relevanceScore - a.relevanceScore)[0];
}

/**
 * Calculate how relevant a name is to the original query
 */
function calculateNameRelevance(name, query) {
  const nameLower = name.toLowerCase();
  let score = 0;

  if (nameLower === query) score += 100;
  if (nameLower.startsWith(query)) score += 50;
  if (nameLower.includes(query)) score += 25;

  // Prefer shorter, simpler names
  score -= name.length * 0.1;

  // Prefer names without complex formatting
  if (!name.includes('[') && !name.includes('(')) score += 10;

  return score;
}

/**
 * Calculate confidence score for RxNav suggestions
 */
function calculateRxNavConfidence(concepts, originalQuery, finalName) {
  let confidence = 0.7; // Base confidence for RxNav

  // More concepts generally means better data
  confidence += Math.min(concepts.length * 0.05, 0.2);

  // Name similarity to query
  const queryLower = originalQuery.toLowerCase();
  const nameLower = finalName.toLowerCase();

  if (nameLower.includes(queryLower)) {
    confidence += 0.1;
  }

  return Math.min(confidence, 1.0);
}

/**
 * Clean and normalize medication names
 */
function cleanMedicationName(name) {
  if (!name) return '';

  return (
    name
      .trim()
      // Remove common RxNav artifacts
      .replace(/\[.*?\]/g, '') // Remove bracketed content
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim()
  );
}

/**
 * Create a basic suggestion when detailed info isn't available
 */
function createBasicSuggestion(name, originalQuery, rxcui = null) {
  const cleanName = cleanMedicationName(name);

  if (!cleanName) return null;

  return {
    commonName: cleanName,
    medicalName: cleanName,
    brandGeneric: 'Generic',
    rxcui,
    source: 'rxnav',
    originalQuery,
    confidence: 0.5,
    hasDetailedInfo: false,
  };
}

/**
 * Remove duplicate results from RxNav
 */
function deduplicateRxNavResults(suggestions) {
  const seen = new Set();
  const unique = [];

  for (const suggestion of suggestions) {
    if (!suggestion) continue;

    const key = `${suggestion.commonName?.toLowerCase()}_${suggestion.medicalName?.toLowerCase()}`;

    if (!seen.has(key) && suggestion.commonName) {
      seen.add(key);
      unique.push(suggestion);
    }
  }

  return unique;
}
