// services/medlineService.js - Enhanced version with better parsing and error handling

/**
 * Enhanced MedlinePlus Connect API service
 * Provides medication information with educational content links
 */

const MEDLINE_BASE_URL = 'https://connect.medlineplus.gov/application';
const REQUEST_TIMEOUT = 6000;

export async function fetchMedlineSuggestions(query) {
  const normalizedQuery = query.trim();

  if (!normalizedQuery || normalizedQuery.length < 2) {
    return [];
  }

  console.log(`🔍 MedlinePlus search for: "${normalizedQuery}"`);

  try {
    // Try multiple search approaches
    const searchStrategies = [
      () => searchByExactTerm(normalizedQuery),
      () => searchByPartialTerm(normalizedQuery),
      () => searchByAlternativeFormats(normalizedQuery),
    ];

    for (const strategy of searchStrategies) {
      try {
        const results = await strategy();
        if (results.length > 0) {
          console.log(`✅ MedlinePlus found ${results.length} results`);
          return results;
        }
      } catch (err) {
        console.warn(`MedlinePlus strategy failed:`, err.message);
        continue;
      }
    }

    console.log(`⚠️ MedlinePlus: No results found for "${normalizedQuery}"`);
    return [];
  } catch (err) {
    console.error('MedlinePlus service error:', err.message);
    return [];
  }
}

/**
 * Search using exact term matching
 */
async function searchByExactTerm(query) {
  const searchParams = new URLSearchParams({
    'mainSearchCriteria.v.cs': '2.16.840.1.113883.6.88',
    'mainSearchCriteria.v.dn': query,
    knowledgeResponseType: 'application/json',
    informationRecipient: 'PROV',
    'informationRecipient.languageCode.c': 'en',
  });

  const apiUrl = `${MEDLINE_BASE_URL}?${searchParams.toString()}`;

  const response = await fetchWithTimeout(apiUrl, REQUEST_TIMEOUT);

  if (response.status === 404) {
    return [];
  }

  if (!response.ok) {
    throw new Error(`MedlinePlus API error: ${response.status}`);
  }

  const data = await response.json();
  return processMedlineResponse(data, 'exact', query);
}

/**
 * Search using partial term matching (fallback)
 */
async function searchByPartialTerm(query) {
  // Try searching with individual words if the full query failed
  const words = query.split(' ').filter((word) => word.length > 2);

  if (words.length === 0) {
    return [];
  }

  // Try the longest word first
  const primaryWord = words.sort((a, b) => b.length - a.length)[0];

  const searchParams = new URLSearchParams({
    'mainSearchCriteria.v.cs': '2.16.840.1.113883.6.88',
    'mainSearchCriteria.v.dn': primaryWord,
    knowledgeResponseType: 'application/json',
    informationRecipient: 'PROV',
  });

  const apiUrl = `${MEDLINE_BASE_URL}?${searchParams.toString()}`;

  const response = await fetchWithTimeout(apiUrl, REQUEST_TIMEOUT);

  if (response.status === 404) {
    return [];
  }

  if (!response.ok) {
    throw new Error(`MedlinePlus partial search error: ${response.status}`);
  }

  const data = await response.json();
  return processMedlineResponse(data, 'partial', query);
}

/**
 * Search using alternative formats (generic names, etc.)
 */
async function searchByAlternativeFormats(query) {
  // Try common medication name variations
  const alternatives = generateAlternativeQueries(query);

  for (const altQuery of alternatives) {
    try {
      const searchParams = new URLSearchParams({
        'mainSearchCriteria.v.cs': '2.16.840.1.113883.6.88',
        'mainSearchCriteria.v.dn': altQuery,
        knowledgeResponseType: 'application/json',
      });

      const apiUrl = `${MEDLINE_BASE_URL}?${searchParams.toString()}`;

      const response = await fetchWithTimeout(apiUrl, REQUEST_TIMEOUT);

      if (response.ok) {
        const data = await response.json();
        const results = processMedlineResponse(data, 'alternative', query);

        if (results.length > 0) {
          return results;
        }
      }
    } catch (err) {
      // Continue to next alternative
      console.warn('Alternative search failed:', err.message);
      continue;
    }
  }

  return [];
}

/**
 * Generate alternative query formats
 */
function generateAlternativeQueries(query) {
  const alternatives = [];
  const queryLower = query.toLowerCase();

  // Remove common suffixes
  const suffixesToRemove = [
    'tablet',
    'tablets',
    'capsule',
    'capsules',
    'mg',
    'mcg',
  ];
  let baseQuery = queryLower;

  for (const suffix of suffixesToRemove) {
    if (baseQuery.endsWith(' ' + suffix)) {
      alternatives.push(baseQuery.replace(' ' + suffix, '').trim());
    }
  }

  // Try without dosage information
  const withoutDosage = queryLower
    .replace(/\d+\s*(mg|mcg|ml|g)\b/gi, '')
    .trim();
  if (withoutDosage !== queryLower && withoutDosage.length > 2) {
    alternatives.push(withoutDosage);
  }

  // Try first word only if multiple words
  const words = queryLower.split(' ');
  if (words.length > 1 && words[0].length > 3) {
    alternatives.push(words[0]);
  }

  return alternatives.filter((alt) => alt.length > 2);
}

/**
 * Process MedlinePlus API response
 */
function processMedlineResponse(data, searchType, originalQuery) {
  if (!data) {
    return [];
  }

  // Handle different response formats
  let entries = [];

  if (data.feed && Array.isArray(data.feed.entry)) {
    entries = data.feed.entry;
  } else if (Array.isArray(data.entry)) {
    entries = data.entry;
  } else if (data.entry) {
    entries = [data.entry];
  }

  if (entries.length === 0) {
    return [];
  }

  const suggestions = [];
  const seen = new Set();

  for (const entry of entries) {
    try {
      const processed = processMedlineEntry(entry, searchType, originalQuery);

      if (processed) {
        const key = `${processed.commonName?.toLowerCase()}_${processed.medicalName?.toLowerCase()}`;

        if (!seen.has(key) && processed.commonName) {
          seen.add(key);
          suggestions.push(processed);
        }
      }
    } catch (err) {
      console.warn('Error processing MedlinePlus entry:', err.message);
      continue;
    }
  }

  return suggestions;
}

/**
 * Process individual MedlinePlus entry
 */
function processMedlineEntry(entry, searchType, originalQuery) {
  if (!entry) return null;

  // Extract title (medication name)
  const title = extractValue(entry.title) || '';

  // Extract ID (often contains medical/generic name)
  const id = extractValue(entry.id) || '';

  // Extract summary (description)
  const summary = extractValue(entry.summary) || '';

  // Extract link for more information
  const link = extractLink(entry.link) || '';

  if (!title.trim()) {
    return null;
  }

  // Determine common and medical names
  const { commonName, medicalName } = extractMedicationNames(
    title,
    id,
    summary,
  );

  if (!commonName) {
    return null;
  }

  return {
    commonName: cleanMedicationName(commonName),
    medicalName: cleanMedicationName(medicalName || commonName),
    summary: cleanSummary(summary),
    link,
    source: 'medline',
    searchType,
    originalQuery,
    brandGeneric: determineBrandGeneric(commonName, medicalName),
    confidence: calculateMedlineConfidence(commonName, originalQuery),
    hasEducationalContent: !!link,
    educationalInfo: {
      summary: summary ? cleanSummary(summary) : '',
      detailsUrl: link,
      provider: 'MedlinePlus',
    },
  };
}

/**
 * Extract medication names from MedlinePlus data
 */
function extractMedicationNames(title, id, summary) {
  let commonName = title.trim();
  let medicalName = '';

  // Try to extract medical name from ID
  if (id && id.toLowerCase() !== title.toLowerCase()) {
    medicalName = id.trim();
  }

  // Try to extract from summary if available
  if (!medicalName && summary) {
    const summaryMatch = summary.match(/generic name[:\s]+([^.,;]+)/i);
    if (summaryMatch) {
      medicalName = summaryMatch[1].trim();
    }
  }

  // Look for parenthetical generic names in title
  const parentheticalMatch = title.match(/^([^(]+)\s*\(([^)]+)\)/);
  if (parentheticalMatch) {
    commonName = parentheticalMatch[1].trim();
    medicalName = parentheticalMatch[2].trim();
  }

  // Look for "also known as" patterns
  const alsoKnownMatch = title.match(
    /^([^,]+),?\s*(?:also known as|generic name?)\s*:?\s*([^,]+)/i,
  );
  if (alsoKnownMatch) {
    commonName = alsoKnownMatch[1].trim();
    medicalName = alsoKnownMatch[2].trim();
  }

  return {
    commonName: commonName || title,
    medicalName: medicalName || commonName || title,
  };
}

/**
 * Extract value from MedlinePlus field (handles different formats)
 */
function extractValue(field) {
  if (!field) return '';

  if (typeof field === 'string') {
    return field;
  }

  if (field._value || field.value) {
    return field._value || field.value;
  }

  if (field['$t']) {
    return field['$t'];
  }

  if (field.content) {
    return field.content;
  }

  return '';
}

/**
 * Extract link from MedlinePlus entry
 */
function extractLink(linkField) {
  if (!linkField) return '';

  if (typeof linkField === 'string') {
    return linkField;
  }

  if (Array.isArray(linkField)) {
    const primaryLink = linkField.find(
      (link) => link.href && (link.rel === 'alternate' || !link.rel),
    );
    return primaryLink?.href || linkField[0]?.href || '';
  }

  if (linkField.href) {
    return linkField.href;
  }

  return '';
}

/**
 * Determine if medication is brand or generic
 */
function determineBrandGeneric(commonName, medicalName) {
  if (!commonName || !medicalName) {
    return 'Generic';
  }

  const common = commonName.toLowerCase();
  const medical = medicalName.toLowerCase();

  // If names are very different, likely brand vs generic
  if (
    common !== medical &&
    !common.includes(medical) &&
    !medical.includes(common)
  ) {
    return 'Brand';
  }

  // Check for common brand name patterns
  const brandIndicators = [
    /^[A-Z][a-z]+$/, // Single capitalized word
    /[A-Z]{2,}/, // Multiple capitals
    /-[A-Z]/, // Hyphenated with capital
  ];

  for (const pattern of brandIndicators) {
    if (pattern.test(commonName)) {
      return 'Brand';
    }
  }

  return 'Generic';
}

/**
 * Calculate confidence score for MedlinePlus suggestions
 */
function calculateMedlineConfidence(name, originalQuery) {
  let confidence = 0.5; // Base confidence for MedlinePlus

  const nameLower = name.toLowerCase();
  const queryLower = originalQuery.toLowerCase();

  // Query matching bonus
  if (nameLower === queryLower) {
    confidence += 0.4;
  } else if (nameLower.startsWith(queryLower)) {
    confidence += 0.3;
  } else if (nameLower.includes(queryLower)) {
    confidence += 0.2;
  }

  // Educational content bonus
  confidence += 0.1;

  return Math.min(confidence, 1.0);
}

/**
 * Clean and normalize medication names
 */
function cleanMedicationName(name) {
  if (!name || typeof name !== 'string') {
    return '';
  }

  return (
    name
      .trim()
      // Remove common MedlinePlus artifacts
      .replace(/\s*\([^)]*\)$/, '') // Remove trailing parentheses
      .replace(/\s*-\s*MedlinePlus.*$/i, '') // Remove MedlinePlus suffixes
      .replace(/\s*Drug Information$/i, '') // Remove "Drug Information"
      .replace(/\s+/g, ' ') // Normalize whitespace
      .replace(/^(the\s+)?/i, '') // Remove leading "the"
      .trim()
  );
}

/**
 * Clean and truncate summary text
 */
function cleanSummary(summary) {
  if (!summary || typeof summary !== 'string') {
    return '';
  }

  return summary
    .trim()
    .replace(/\s+/g, ' ') // Normalize whitespace
    .substring(0, 200) // Truncate for UI
    .replace(/[.!?](?=[^.!?]*$)/, '') // Remove incomplete sentences
    .trim();
}

/**
 * Fetch with timeout and proper error handling
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
        'Cache-Control': 'no-cache',
      },
    });

    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error(`MedlinePlus request timeout after ${timeoutMs}ms`);
    }
    throw error;
  }
}

/**
 * Get MedlinePlus service status
 */
export async function getMedlineStatus() {
  try {
    const testUrl = `${MEDLINE_BASE_URL}?mainSearchCriteria.v.cs=2.16.840.1.113883.6.88&mainSearchCriteria.v.dn=aspirin&knowledgeResponseType=application/json`;

    const response = await fetchWithTimeout(testUrl, 3000);

    return {
      available: response.ok,
      status: response.status,
      lastChecked: new Date().toISOString(),
    };
  } catch (err) {
    return {
      available: false,
      error: err.message,
      lastChecked: new Date().toISOString(),
    };
  }
}

/**
 * Search for medication educational content only
 */
export async function fetchMedicationEducationalContent(medicationName) {
  try {
    const suggestions = await fetchMedlineSuggestions(medicationName);

    return suggestions.map((suggestion) => ({
      medicationName: suggestion.commonName,
      summary: suggestion.educationalInfo?.summary || '',
      detailsUrl: suggestion.educationalInfo?.detailsUrl || '',
      provider: 'MedlinePlus',
      lastUpdated: new Date().toISOString(),
    }));
  } catch (err) {
    console.error('Error fetching educational content:', err.message);
    return [];
  }
}
