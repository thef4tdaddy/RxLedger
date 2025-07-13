// Fetch medication suggestions from MedlinePlus Connect API
// Returns: Array of { commonName, medicalName }
export async function fetchMedlineSuggestions(query) {
  const apiUrl = `https://connect.medlineplus.gov/rxcui?input=${encodeURIComponent(query)}&inputType=GENERIC&searchType=contains`;
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    const data = await response.json();
    // Simulate extraction of suggestions from MedlinePlus Connect API response
    // This is a placeholder; actual API shape may differ.
    if (data && Array.isArray(data.suggestions)) {
      return data.suggestions.map((s) => ({
        commonName: s.name || s.commonName || '',
        medicalName: s.medicalName || s.name || '',
      }));
    }
    // Fallback if suggestions array is missing
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
