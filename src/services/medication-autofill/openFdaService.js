// services/openFdaService.js - Enhanced version with better error handling and data extraction

/**
 * Enhanced OpenFDA service for fetching medication suggestions
 * Provides brand name, generic name, and manufacturer information
 */

const OPENFDA_BASE_URL = 'https://api.fda.gov/drug';
const DEFAULT_LIMIT = 8;
const REQUEST_TIMEOUT = 5000;

export async function fetchOpenFdaSuggestions(query) {
  const normalizedQuery = query.trim();

  if (!normalizedQuery || normalizedQuery.length < 2) {
    return [];
  }

  console.log(`🔍 OpenFDA search for: "${normalizedQuery}"`);

  try {
    // Try multiple search strategies
    const strategies = [
      () => searchByBrandName(normalizedQuery),
      () => searchByGenericName(normalizedQuery),
      () => searchBySubstanceName(normalizedQuery),
      () => searchByCombinedTerms(normalizedQuery),
    ];

    for (const strategy of strategies) {
      try {
        const results = await strategy();
        if (results.length > 0) {
          console.log(`✅ OpenFDA found ${results.length} results`);
          return results;
        }
      } catch (error) {
        console.warn(`OpenFDA strategy failed:`, error.message);
        continue;
      }
    }

    console.log(`⚠️ OpenFDA: No results found for "${normalizedQuery}"`);
    return [];
  } catch (error) {
    console.error('OpenFDA service error:', error);
    return [];
  }
}

/**
 * Search by brand name
 */
async function searchByBrandName(query) {
  const searchUrl = `${OPENFDA_BASE_URL}/label.json?search=openfda.brand_name:"${encodeURIComponent(query)}"&limit=${DEFAULT_LIMIT}`;

  const response = await fetchWithTimeout(searchUrl, REQUEST_TIMEOUT);

  if (!response.ok) {
    if (response.status === 404) {
      return [];
    }
    throw new Error(`OpenFDA brand search failed: ${response.status}`);
  }

  const data = await response.json();
  return processOpenFDAResults(data, 'brand', query);
}

/**
 * Search by generic name
 */
async function searchByGenericName(query) {
  const searchUrl = `${OPENFDA_BASE_URL}/label.json?search=openfda.generic_name:"${encodeURIComponent(query)}"&limit=${DEFAULT_LIMIT}`;

  const response = await fetchWithTimeout(searchUrl, REQUEST_TIMEOUT);

  if (!response.ok) {
    if (response.status === 404) {
      return [];
    }
    throw new Error(`OpenFDA generic search failed: ${response.status}`);
  }

  const data = await response.json();
  return processOpenFDAResults(data, 'generic', query);
}

/**
 * Search by substance name
 */
async function searchBySubstanceName(query) {
  const searchUrl = `${OPENFDA_BASE_URL}/label.json?search=openfda.substance_name:"${encodeURIComponent(query)}"&limit=${DEFAULT_LIMIT}`;

  const response = await fetchWithTimeout(searchUrl, REQUEST_TIMEOUT);

  if (!response.ok) {
    if (response.status === 404) {
      return [];
    }
    throw new Error(`OpenFDA substance search failed: ${response.status}`);
  }

  const data = await response.json();
  return processOpenFDAResults(data, 'substance', query);
}

/**
 * Search using combined terms with fuzzy matching
 */
async function searchByCombinedTerms(query) {
  // Create a broader search that might catch variations
  const searchTerms = query
    .split(' ')
    .map(
      (term) =>
        `(openfda.brand_name:${encodeURIComponent(term)} OR openfda.generic_name:${encodeURIComponent(term)})`,
    )
    .join(' AND ');

  const searchUrl = `${OPENFDA_BASE_URL}/label.json?search=${searchTerms}&limit=${DEFAULT_LIMIT}`;

  const response = await fetchWithTimeout(searchUrl, REQUEST_TIMEOUT);

  if (!response.ok) {
    if (response.status === 404) {
      return [];
    }
    throw new Error(`OpenFDA combined search failed: ${response.status}`);
  }

  const data = await response.json();
  return processOpenFDAResults(data, 'combined', query);
}

/**
 * Process OpenFDA API response into standardized suggestions
 */
function processOpenFDAResults(data, searchType, originalQuery) {
  if (!data.results || !Array.isArray(data.results)) {
    return [];
  }

  const suggestions = [];
  const seen = new Set();

  for (const item of data.results) {
    try {
      const processed = processOpenFDAItem(item, searchType, originalQuery);

      if (processed && processed.length > 0) {
        for (const suggestion of processed) {
          const key = `${suggestion.commonName?.toLowerCase()}_${suggestion.medicalName?.toLowerCase()}`;

          if (!seen.has(key) && suggestion.commonName) {
            seen.add(key);
            suggestions.push(suggestion);
          }
        }
      }
    } catch (error) {
      console.warn('Error processing OpenFDA item:', error);
      continue;
    }
  }

  return suggestions.slice(0, DEFAULT_LIMIT);
}

/**
 * Process individual OpenFDA result item
 */
function processOpenFDAItem(item, searchType, originalQuery) {
  const openfda = item.openfda || {};
  const suggestions = [];

  // Extract brand names
  const brandNames = Array.isArray(openfda.brand_name)
    ? openfda.brand_name
    : [];

  // Extract generic names
  const genericNames = Array.isArray(openfda.generic_name)
    ? openfda.generic_name
    : [];

  // Extract substance names
  const substanceNames = Array.isArray(openfda.substance_name)
    ? openfda.substance_name
    : [];

  // Extract manufacturer info
  const manufacturers = Array.isArray(openfda.manufacturer_name)
    ? openfda.manufacturer_name
    : [];
  const primaryManufacturer = manufacturers[0] || '';

  // Create suggestions for brand names
  for (const brandName of brandNames) {
    if (brandName && brandName.trim()) {
      const genericName =
        findBestMatch(brandName, genericNames) ||
        findBestMatch(brandName, substanceNames) ||
        brandName;

      suggestions.push({
        commonName: cleanMedicationName(brandName),
        medicalName: cleanMedicationName(genericName),
        manufacturer: primaryManufacturer,
        brandGeneric: 'Brand',
        source: 'openfda',
        searchType,
        originalQuery,
        confidence: calculateOpenFDAConfidence(
          brandName,
          originalQuery,
          'brand',
        ),
        hasManufacturer: !!primaryManufacturer,
        fdaInfo: {
          ndc: openfda.product_ndc?.[0],
          rxcui: openfda.rxcui?.[0],
          route: openfda.route?.[0],
          dosageForm: openfda.dosage_form?.[0],
        },
      });
    }
  }

  // Create suggestions for generic names (if no brand found or if different)
  for (const genericName of genericNames) {
    if (genericName && genericName.trim()) {
      const isAlreadyAdded = suggestions.some(
        (s) => s.medicalName.toLowerCase() === genericName.toLowerCase(),
      );

      if (!isAlreadyAdded) {
        suggestions.push({
          commonName: cleanMedicationName(genericName),
          medicalName: cleanMedicationName(genericName),
          manufacturer: primaryManufacturer,
          brandGeneric: 'Generic',
          source: 'openfda',
          searchType,
          originalQuery,
          confidence: calculateOpenFDAConfidence(
            genericName,
            originalQuery,
            'generic',
          ),
          hasManufacturer: !!primaryManufacturer,
          fdaInfo: {
            ndc: openfda.product_ndc?.[0],
            rxcui: openfda.rxcui?.[0],
            route: openfda.route?.[0],
            dosageForm: openfda.dosage_form?.[0],
          },
        });
      }
    }
  }

  return suggestions;
}

/**
 * Find the best matching name from a list
 */
function findBestMatch(target, candidates) {
  if (!candidates || candidates.length === 0) return null;

  const targetLower = target.toLowerCase();

  // First try exact match
  for (const candidate of candidates) {
    if (candidate.toLowerCase() === targetLower) {
      return candidate;
    }
  }

  // Then try contains match
  for (const candidate of candidates) {
    if (
      candidate.toLowerCase().includes(targetLower) ||
      targetLower.includes(candidate.toLowerCase())
    ) {
      return candidate;
    }
  }

  // Return first candidate as fallback
  return candidates[0];
}

/**
 * Calculate confidence score for OpenFDA suggestions
 */
function calculateOpenFDAConfidence(name, originalQuery, type) {
  let confidence = 0.6; // Base confidence for OpenFDA

  const nameLower = name.toLowerCase();
  const queryLower = originalQuery.toLowerCase();

  // Query matching bonus
  if (nameLower === queryLower) {
    confidence += 0.3;
  } else if (nameLower.startsWith(queryLower)) {
    confidence += 0.2;
  } else if (nameLower.includes(queryLower)) {
    confidence += 0.1;
  }

  // Type bonus
  if (type === 'brand') {
    confidence += 0.05;
  }

  return Math.min(confidence, 1.0);
}

/**
 * Clean and normalize medication names from OpenFDA
 */
function cleanMedicationName(name) {
  if (!name || typeof name !== 'string') {
    return '';
  }

  return (
    name
      .trim()
      // Normalize whitespace
      .replace(/\s+/g, ' ')
      // Remove common FDA artifacts
      .replace(/\[.*?\]/g, '')
      .replace(/\(.*?\)/g, '')
      // Clean up case - title case for readability
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ')
      .trim()
  );
}

/**
 * Fetch with timeout support
 */
async function fetchWithTimeout(url, timeoutMs) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
        'User-Agent': 'RxLedger-App/1.0',
      },
    });

    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error(`Request timeout after ${timeoutMs}ms`);
    }
    throw error;
  }
}

/**
 * Get OpenFDA service status and capabilities
 */
export async function getOpenFDAStatus() {
  try {
    const response = await fetchWithTimeout(
      `${OPENFDA_BASE_URL}/label.json?limit=1`,
      3000,
    );

    return {
      available: response.ok,
      status: response.status,
      lastChecked: new Date().toISOString(),
    };
  } catch (error) {
    return {
      available: false,
      error: error.message,
      lastChecked: new Date().toISOString(),
    };
  }
}
