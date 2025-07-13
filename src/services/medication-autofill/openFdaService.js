export async function fetchOpenFdaSuggestions(query) {
  const response = await fetch(
    `https://api.fda.gov/drug/label.json?search=openfda.brand_name:${encodeURIComponent(query)}&limit=5`,
  );
  if (!response.ok) {
    console.error('OpenFDA API error:', response.status);
    return [];
  }

  const data = await response.json();

  if (!data.results || !data.results.length) {
    return [];
  }

  return data.results.map((item) => ({
    commonName: item.openfda?.brand_name?.[0] || '',
    medicalName: item.openfda?.generic_name?.[0] || '',
    manufacturer: item.openfda?.manufacturer_name?.[0] || '',
    source: 'OpenFDA',
  }));
}
