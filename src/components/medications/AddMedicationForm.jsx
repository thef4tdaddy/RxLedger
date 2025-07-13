import { demoMedications } from '../../demo-data/medications/Medications';
import { fetchRxNavSuggestions } from '../../services/rxnavService';
import { useState, useEffect, useRef } from 'react';

function getRandomDemoMedication() {
  if (!demoMedications || demoMedications.length === 0) return {};
  const idx = Math.floor(Math.random() * demoMedications.length);
  return demoMedications[idx];
}

export default function AddMedicationForm({ onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    commonName: '',
    medicalName: '',
    manufacturer: '',
    pharmacy: '',
    doseAmount: '',
    schedule: '',
    refillSchedule: '',
    brandGeneric: '',
  });
  const [suggestions, setSuggestions] = useState([]);
  const [suggestedFields, setSuggestedFields] = useState({});
  const [medlineError, setMedlineError] = useState(false);

  useEffect(() => {
    async function fetchDefaultSuggestions() {
      try {
        const fetchedSuggestions = await fetchRxNavSuggestions('aspirin');
        if (fetchedSuggestions && fetchedSuggestions.length > 0) {
          const randomIdx = Math.floor(
            Math.random() * fetchedSuggestions.length,
          );
          const randomSuggestion = fetchedSuggestions[randomIdx];
          setFormData({
            commonName: randomSuggestion.commonName || '',
            medicalName: randomSuggestion.medicalName || '',
            manufacturer: randomSuggestion.manufacturer || '',
            pharmacy: randomSuggestion.pharmacy || '',
            doseAmount: randomSuggestion.doseAmount || '',
            schedule: randomSuggestion.schedule || '',
            refillSchedule: randomSuggestion.refillSchedule || '',
            brandGeneric: randomSuggestion.brandGeneric || '',
          });
          setSuggestedFields({
            commonName: true,
            medicalName: true,
            manufacturer: true,
            pharmacy: true,
            doseAmount: true,
            schedule: true,
            refillSchedule: true,
          });
          setSuggestions(fetchedSuggestions);
          setMedlineError(false);
        } else {
          // No suggestions found, fallback to demo medication and clear suggestions
          setMedlineError(true);
          const demoMedication = getRandomDemoMedication();
          setFormData({
            commonName: demoMedication.commonName || '',
            medicalName: demoMedication.medicalName || '',
            manufacturer: demoMedication.manufacturer || '',
            pharmacy: demoMedication.pharmacy || '',
            doseAmount: demoMedication.doseAmount || '',
            schedule: demoMedication.schedule || '',
            refillSchedule: demoMedication.refillSchedule || '',
            brandGeneric: demoMedication.brandGeneric || '',
          });
          setSuggestedFields({});
          setSuggestions([]);
        }
      } catch {
        console.error('RxNav fetch failed:');
        setMedlineError(true);
        const demoMedication = getRandomDemoMedication();
        setFormData({
          commonName: demoMedication.commonName || '',
          medicalName: demoMedication.medicalName || '',
          manufacturer: demoMedication.manufacturer || '',
          pharmacy: demoMedication.pharmacy || '',
          doseAmount: demoMedication.doseAmount || '',
          schedule: demoMedication.schedule || '',
          refillSchedule: demoMedication.refillSchedule || '',
          brandGeneric: demoMedication.brandGeneric || '',
        });
        setSuggestedFields({});
        setSuggestions([]);
      }
    }
    fetchDefaultSuggestions();
  }, []);

  // Debounce logic for both name fields
  const debounceTimeout = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (suggestedFields[name]) {
      setSuggestedFields((prev) => ({ ...prev, [name]: false }));
    }

    // Only trigger suggestions for commonName or medicalName
    if (name === 'commonName' || name === 'medicalName') {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
      if (value.length >= 2) {
        debounceTimeout.current = setTimeout(async () => {
          let fetchedSuggestions = [];
          try {
            fetchedSuggestions = await fetchRxNavSuggestions(value);
          } catch {
            fetchedSuggestions = [];
          }
          // Filter out empty/incomplete suggestions before displaying
          const filtered = (fetchedSuggestions || []).filter(
            (suggestion) =>
              suggestion && suggestion.name && suggestion.name.trim() !== '',
          );
          // If no matches, show a "No matches found" entry
          if (filtered.length === 0) {
            setSuggestions([
              {
                commonName: 'No matches found',
                medicalName: '',
                isNoMatch: true,
              },
            ]);
          } else {
            setSuggestions(filtered);
          }
        }, 350);
      } else {
        setSuggestions([]);
      }
    }
  };

  const handleSuggestionSelect = (suggestion) => {
    if (suggestion.isNoMatch) return;
    setFormData({
      commonName: suggestion.commonName || '',
      medicalName: suggestion.medicalName || '',
      manufacturer: suggestion.manufacturer || '',
      pharmacy: suggestion.pharmacy || '',
      doseAmount: suggestion.doseAmount || '',
      schedule: suggestion.schedule || '',
      refillSchedule: suggestion.refillSchedule || '',
      brandGeneric: suggestion.brandGeneric || '',
    });
    setSuggestedFields({
      commonName: true,
      medicalName: true,
      manufacturer: true,
      pharmacy: true,
      doseAmount: true,
      schedule: true,
      refillSchedule: true,
    });
    setSuggestions([]);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
      {medlineError && (
        <div className="mb-4 p-2 bg-yellow-100 border border-yellow-300 rounded text-yellow-800">
          Unable to fetch suggestions from RxNav. Using example data.
        </div>
      )}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-[#1B59AE]">
          Add New Medication
        </h2>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          ✕
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          {
            label: 'Common Name',
            key: 'commonName',
            placeholder: 'e.g. Tylenol',
          },
          {
            label: 'Medical Name',
            key: 'medicalName',
            placeholder: 'e.g. Acetaminophen',
          },
          {
            label: 'Manufacturer',
            key: 'manufacturer',
            placeholder: 'e.g. Johnson & Johnson',
          },
          { label: 'Pharmacy', key: 'pharmacy', placeholder: 'e.g. Walgreens' },
          {
            label: 'Dose Amount',
            key: 'doseAmount',
            placeholder: 'e.g. 500mg',
          },
          { label: 'Schedule', key: 'schedule', placeholder: 'e.g. 2x daily' },
          {
            label: 'Refill Schedule',
            key: 'refillSchedule',
            placeholder: 'e.g. Every 30 days',
          },
        ].map((field) => {
          if (field.key === 'commonName' || field.key === 'medicalName') {
            return (
              <div key={field.label} className="relative">
                <label className="block text-sm font-medium text-[#1B59AE] mb-2">
                  {field.label}
                </label>
                <input
                  type="text"
                  className={`w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B59AE] focus:border-transparent ${
                    suggestedFields[field.key] ? 'text-gray-400' : 'text-black'
                  }`}
                  name={field.key}
                  autoComplete="on"
                  value={formData[field.key]}
                  placeholder={field.placeholder}
                  onChange={handleInputChange}
                />
                {/* Show suggestions for either field if that field is focused and has enough characters */}
                {formData[field.key].length >= 2 && suggestions.length > 0 && (
                  <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-48 overflow-auto shadow-lg">
                    {suggestions.map((suggestion, idx) =>
                      suggestion.isNoMatch ? (
                        <li
                          key={idx}
                          className="px-4 py-2 text-gray-400 cursor-default"
                        >
                          No matches found
                        </li>
                      ) : (
                        <li
                          key={idx}
                          onClick={() => handleSuggestionSelect(suggestion)}
                          className="cursor-pointer px-4 py-2 hover:bg-blue-100"
                        >
                          {suggestion.commonName ||
                            suggestion.medicalName ||
                            'Unknown'}
                        </li>
                      ),
                    )}
                  </ul>
                )}
              </div>
            );
          } else {
            return (
              <div key={field.label}>
                <label className="block text-sm font-medium text-[#1B59AE] mb-2">
                  {field.label}
                </label>
                <input
                  type="text"
                  className={`w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B59AE] focus:border-transparent ${
                    suggestedFields[field.key] ? 'text-gray-400' : 'text-black'
                  }`}
                  name={field.key}
                  autoComplete="on"
                  value={formData[field.key] || ''}
                  placeholder={field.placeholder}
                  onChange={handleInputChange}
                />
              </div>
            );
          }
        })}
        <div>
          <label className="block text-sm font-medium text-[#1B59AE] mb-2">
            Brand/Generic
          </label>
          <select
            className={`w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B59AE] focus:border-transparent ${
              suggestedFields.brandGeneric ? 'text-gray-400' : 'text-black'
            }`}
            name="brandGeneric"
            value={formData.brandGeneric || ''}
            onChange={handleInputChange}
          >
            <option value="Generic">Generic</option>
            <option value="Brand">Brand</option>
          </select>
        </div>
      </div>
      <div className="flex gap-3 mt-6">
        <button
          onClick={() => onSubmit(formData)}
          className="px-6 py-3 bg-[#1B59AE] text-white rounded-lg font-medium hover:bg-[#48B4A2] transition-colors"
        >
          Add Medication
        </button>
        <button
          onClick={() => {
            onClose();
          }}
          className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
        >
          Cancel
        </button>
      </div>
      <p className="mt-4 text-center text-xs text-gray-400">
        Random Prefilled Medication from RxNav. Edit with yours.
      </p>
    </div>
  );
}
