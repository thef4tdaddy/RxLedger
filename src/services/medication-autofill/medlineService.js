// Fetch medication suggestions from MedlinePlus Connect API
// Returns: Array of { commonName, medicalName }
export async function fetchMedlineSuggestions(query) {
  const apiUrl = `/api/medline-suggestions?mainSearchCriteria.v.cs=2.16.840.1.113883.6.88&mainSearchCriteria.v.dn=${encodeURIComponent(query)}&knowledgeResponseType=application/json`;
  try {
    const response = await fetch(apiUrl, {
      headers: {
        Accept: 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    const data = await response.json();

    // Log the raw data to see what structure you get
    console.log('Medline API raw response:', data);
    console.log('Medline API raw feed:', JSON.stringify(data.feed, null, 2));

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
    // Fallback: informative static suggestions
    return [
      { commonName: 'Tylenol', medicalName: 'Acetaminophen' },
      { commonName: 'Advil', medicalName: 'Ibuprofen' },
      { commonName: 'Aleve', medicalName: 'Naproxen' },
      { commonName: 'Benadryl', medicalName: 'Diphenhydramine' },
    ];
  }
}
