// Fetch medication suggestions from MedlinePlus Connect API
// Returns: Array of { commonName, medicalName }
export async function fetchMedlineSuggestions(query) {
  const apiUrl = `https://connect.medlineplus.gov/application?mainSearchCriteria.v.cs=2.16.840.1.113883.6.88&mainSearchCriteria.v.dn=${encodeURIComponent(
    query,
  )}&knowledgeResponseType=application/json`;
  try {
    const response = await fetch(apiUrl, {
      headers: {
        Accept: 'application/json',
      },
    });
    if (response.status === 404) {
      return [];
    }
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    const data = await response.json();

    // Attempt to extract suggestions from MedlinePlus Connect response format
    if (data && data.feed && Array.isArray(data.feed.entry)) {
      return data.feed.entry.map((entry) => ({
        commonName: entry.title?._value || '',
        medicalName: entry.id?._value || '',
        summary: entry.summary?._value || '',
        link: entry.link?.[0]?.href || '',
      }));
    }

    // Fallback if expected structure missing
    return [];
  } catch (error) {
    console.error('Medline API fetch error:', error);
    // Do not surface fallback suggestions on error
    return [];
  }
}
