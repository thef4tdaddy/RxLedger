import { useState } from 'react';
import {
  communityQuote,
  broadInsights,
  medicationInsights,
} from '../demo-data/community/communityInsights';
import { demoMedications } from '../demo-data/medications/Medications';

export default function CommunityPage() {
  const [selected, setSelected] = useState('adderall');
  const meds = demoMedications.map((m) => m.commonName.toLowerCase());
  const insight = medicationInsights[selected];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Community Insights</h1>
      <p className="mb-6 italic text-gray-700">{communityQuote}</p>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
        <h2 className="text-xl font-semibold mb-2">Broad Insights</h2>
        <ul className="list-disc list-inside space-y-1">
          {broadInsights.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
        <h2 className="text-xl font-semibold mb-2">Tailored Insights</h2>
        <div className="mb-3">
          <label className="mr-2 font-medium">Medication:</label>
          <select
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
            className="border rounded px-2 py-1"
          >
            {meds.map((name) => (
              <option key={name} value={name}>
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </option>
            ))}
          </select>
        </div>
        {insight && (
          <ul className="list-disc list-inside space-y-1">
            {insight.insights.map((i) => (
              <li key={i}>{i}</li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex gap-4">
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">
          View Community Trends
        </button>
        <button className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700">
          Share My Progress
        </button>
      </div>
    </div>
  );
}
