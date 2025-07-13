// src/services/rxnavService.js
export async function fetchRxNavSuggestions(query) {
  const url = `https://rxnav.nlm.nih.gov/REST/approximateTerm.json?term=${encodeURIComponent(query)}&maxEntries=5`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Error fetching medication data');
  }
  const data = await res.json();

  console.log('API response data:', data);

  const candidates = data?.approximateGroup?.candidate ?? [];

  const suggestions = await Promise.all(
    candidates.map(async (candidate) => {
      const rxcui = candidate.rxcui;
      let commonName = candidate.term || '';
      let synonym = '';

      if (rxcui) {
        try {
          const detailsRes = await fetch(
            `https://rxnav.nlm.nih.gov/REST/rxcui/${rxcui}/properties.json`,
          );
          const detailsData = await detailsRes.json();
          commonName = detailsData?.properties?.name || commonName;
          synonym = detailsData?.properties?.synonym || '';
        } catch (err) {
          console.error('Error fetching RXCUI details:', err);
        }
      }

      return {
        rxcui,
        commonName,
        medicalName: synonym,
      };
    }),
  );

  console.log('Parsed suggestions with details:', suggestions);

  return suggestions.filter((s) => s.commonName);
}
