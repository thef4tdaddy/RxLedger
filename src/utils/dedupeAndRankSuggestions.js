export function dedupeAndRankSuggestions(suggestions) {
  if (!Array.isArray(suggestions) || suggestions.length === 0) return [];

  const uniqueMap = new Map();

  suggestions.forEach((sugg) => {
    if (typeof sugg.commonName !== 'string') return;

    const commonKey = sugg.commonName.toLowerCase();
    const medicalKey =
      typeof sugg.medicalName === 'string'
        ? sugg.medicalName.toLowerCase()
        : '';
    const key = `${commonKey}|${medicalKey}`;

    const suggRank = sugg.rank ?? 999;
    const existing = uniqueMap.get(key);
    const existingRank = existing?.rank ?? 999;

    if (!existing || suggRank < existingRank) {
      uniqueMap.set(key, sugg);
    }
  });

  return Array.from(uniqueMap.values()).sort((a, b) => {
    return (a.rank ?? 999) - (b.rank ?? 999);
  });
}

export default dedupeAndRankSuggestions;
