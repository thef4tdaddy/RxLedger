// src/services/rxnavService.js
export async function fetchRxNavSuggestions(query) {
  const url = `https://rxnav.nlm.nih.gov/REST/approximateTerm.json?term=${encodeURIComponent(query)}&maxEntries=10`;

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
      let medicalName = '';

      if (rxcui) {
        try {
          const detailsRes = await fetch(
            `https://rxnav.nlm.nih.gov/REST/rxcui/${rxcui}/conceptProperties.json`,
          );
          const detailsData = await detailsRes.json();

          const concepts = detailsData?.conceptProperties || [];

          // Prefer Ingredient (TTY=IN) for medicalName
          const ingredient = concepts.find((c) => c.tty === 'IN');
          if (ingredient) {
            medicalName = ingredient.name;
          } else {
            // Fallback to SCD (Semantic Clinical Drug)
            const scd = concepts.find((c) => c.tty === 'SCD');
            if (scd) {
              medicalName = scd.name;
            } else if (concepts.length > 0) {
              // Fallback to any available
              medicalName = concepts[0].name;
            }
          }

          // Always set commonName to the preferred name if available
          if (concepts.length > 0) {
            commonName = concepts[0].name;
          }
        } catch (err) {
          console.error('Error fetching RXCUI details:', err);
        }
      }

      // Fallback for medicalName if still empty
      if (!medicalName) {
        medicalName = commonName;
      }

      return {
        rxcui,
        commonName,
        medicalName,
      };
    }),
  );

  // Deduplicate by commonName + medicalName
  const unique = [];
  const seen = new Set();
  for (const s of suggestions) {
    const key = `${s.commonName}_${s.medicalName}`;
    if (!seen.has(key) && s.commonName) {
      seen.add(key);
      unique.push(s);
    }
  }

  console.log('Parsed suggestions with details:', unique);
  return unique;
}
