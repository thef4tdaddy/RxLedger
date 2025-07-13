export function dedupeAndRankSuggestions(suggestions) {
  if (!Array.isArray(suggestions)) return [];

  // Create a map to dedupe by commonName + medicalName
  const uniqueMap = new Map();

  suggestions.forEach((sugg) => {
    const key = `${sugg.commonName?.toLowerCase() || ''}|${sugg.medicalName?.toLowerCase() || ''}`;

    if (!uniqueMap.has(key)) {
      uniqueMap.set(key, sugg);
    } else {
      // If duplicate, keep the one with higher rank (lower rank number)
      const existing = uniqueMap.get(key);
      if ((sugg.rank ?? 999) < (existing.rank ?? 999)) {
        uniqueMap.set(key, sugg);
      }
    }
  });

  // Convert back to array and sort by rank ascending
  return Array.from(uniqueMap.values()).sort((a, b) => {
    return (a.rank ?? 999) - (b.rank ?? 999);
  });
}
