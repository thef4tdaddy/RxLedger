import { demoMedications } from '../../demo-data/medications/Medications';
import { fetchMedicationSuggestions } from '../../services/medication-autofill/medicationSuggestionService';
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
  const [placeholders, setPlaceholders] = useState({
    commonName: 'e.g. Tylenol',
    medicalName: 'e.g. Acetaminophen',
  });
  const [inputFocused, setInputFocused] = useState({
    commonName: false,
    medicalName: false,
  });

  useEffect(() => {
    const demo = getRandomDemoMedication();
    if (demo.commonName || demo.medicalName) {
      setPlaceholders({
        commonName: demo.commonName ? `e.g. ${demo.commonName}` : 'e.g. Tylenol',
        medicalName: demo.medicalName
          ? `e.g. ${demo.medicalName}`
          : 'e.g. Acetaminophen',
      });
    }
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
            fetchedSuggestions = await fetchMedicationSuggestions(value);
            if (fetchedSuggestions && fetchedSuggestions.length > 0) {
              setMedlineError(false);
            }
          } catch (err) {
            // handle fetch error
            console.error('Error fetching suggestions:', err);
            fetchedSuggestions = [];
          }
          // Filter out empty/incomplete suggestions before displaying
          let filtered = (fetchedSuggestions || []).filter(
            (suggestion) =>
              suggestion &&
              (suggestion.commonName || suggestion.medicalName) &&
              (suggestion.commonName || suggestion.medicalName).trim() !== '',
          );
          // Sort suggestions: those with both commonName and medicalName first, then those with only one
          filtered.sort((a, b) => {
            const aHasBoth = a.commonName && a.medicalName;
            const bHasBoth = b.commonName && b.medicalName;
            if (aHasBoth && !bHasBoth) return -1;
            if (!aHasBoth && bHasBoth) return 1;
            return 0;
          });
          // Remove duplicate suggestions (same commonName and medicalName), keeping only the first/highest ranked occurrence
          const seen = new Set();
          filtered = filtered.filter((suggestion) => {
            const key =
              (suggestion.commonName || '').toLowerCase().trim() +
              '||' +
              (suggestion.medicalName || '').toLowerCase().trim();
            if (seen.has(key)) {
              return false;
            }
            seen.add(key);
            return true;
          });
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

  // Enhanced fallback handling for suggestion select
  const handleSuggestionSelect = async (suggestion) => {
    if (suggestion.isNoMatch) return;
    let commonName = suggestion.commonName || '';
    let medicalName = suggestion.medicalName || '';
    let manufacturer = suggestion.manufacturer || '';
    let pharmacy = suggestion.pharmacy || '';
    let doseAmount = suggestion.doseAmount || '';
    let schedule = suggestion.schedule || '';
    let refillSchedule = suggestion.refillSchedule || '';
    let brandGeneric = suggestion.brandGeneric || '';

    // If both names present, just use them
    if (commonName && medicalName) {
      setFormData({
        commonName,
        medicalName,
        manufacturer,
        pharmacy,
        doseAmount,
        schedule,
        refillSchedule,
        brandGeneric,
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
      return;
    }

    // If only one name is present, try to fetch the other by querying the API
    let filled = false;
    // Try to fill missing medicalName if only commonName present
    if (commonName && !medicalName) {
      try {
        const fetched = await fetchMedicationSuggestions(commonName);
        // Prefer a suggestion that has both names and matches this commonName
        let match = (fetched || []).find(
          (s) =>
            s.commonName &&
            s.medicalName &&
            s.commonName.toLowerCase() === commonName.toLowerCase(),
        );
        // If not found, prefer any suggestion with a medicalName
        if (!match) {
          match = (fetched || []).find((s) => s.medicalName);
        }
        if (match) {
          setFormData({
            commonName: match.commonName || commonName,
            medicalName: match.medicalName || commonName,
            manufacturer: match.manufacturer || manufacturer,
            pharmacy: match.pharmacy || pharmacy,
            doseAmount: match.doseAmount || doseAmount,
            schedule: match.schedule || schedule,
            refillSchedule: match.refillSchedule || refillSchedule,
            brandGeneric: match.brandGeneric || brandGeneric,
          });
          filled = true;
        } else {
          // No match with both names nor any with medicalName; fallback
          console.warn(
            'Fallback: no match with both names, using provided name as both.',
          );
          setFormData({
            commonName: commonName,
            medicalName: commonName,
            manufacturer,
            pharmacy,
            doseAmount,
            schedule,
            refillSchedule,
            brandGeneric,
          });
          filled = true;
        }
      } catch (err) {
        // Error fetching medical name suggestion; fallback
        console.error('Error fetching medical name suggestion:', err);
        console.warn(
          'Fallback: no match with both names, using provided name as both.',
        );
        setFormData({
          commonName: commonName,
          medicalName: commonName,
          manufacturer,
          pharmacy,
          doseAmount,
          schedule,
          refillSchedule,
          brandGeneric,
        });
        filled = true;
      }
    }
    // Try to fill missing commonName if only medicalName present
    else if (!commonName && medicalName) {
      try {
        const fetched = await fetchMedicationSuggestions(medicalName);
        let match = (fetched || []).find(
          (s) =>
            s.commonName &&
            s.medicalName &&
            s.medicalName.toLowerCase() === medicalName.toLowerCase(),
        );
        // If not found, prefer any suggestion with a commonName
        if (!match) {
          match = (fetched || []).find((s) => s.commonName);
        }
        if (match) {
          setFormData({
            commonName: match.commonName || medicalName,
            medicalName: match.medicalName || medicalName,
            manufacturer: match.manufacturer || manufacturer,
            pharmacy: match.pharmacy || pharmacy,
            doseAmount: match.doseAmount || doseAmount,
            schedule: match.schedule || schedule,
            refillSchedule: match.refillSchedule || refillSchedule,
            brandGeneric: match.brandGeneric || brandGeneric,
          });
          filled = true;
        } else {
          // No match with both names nor any with commonName; fallback
          console.warn(
            'Fallback: no match with both names, using provided name as both.',
          );
          setFormData({
            commonName: medicalName,
            medicalName: medicalName,
            manufacturer,
            pharmacy,
            doseAmount,
            schedule,
            refillSchedule,
            brandGeneric,
          });
          filled = true;
        }
      } catch (err) {
        // Error fetching common name suggestion; fallback
        console.error('Error fetching common name suggestion:', err);
        console.warn(
          'Fallback: no match with both names, using provided name as both.',
        );
        setFormData({
          commonName: medicalName,
          medicalName: medicalName,
          manufacturer,
          pharmacy,
          doseAmount,
          schedule,
          refillSchedule,
          brandGeneric,
        });
        filled = true;
      }
    }
    if (!filled) {
      // If couldn't fill the other name, just use what we have (shouldn't usually happen)
      setFormData({
        commonName,
        medicalName,
        manufacturer,
        pharmacy,
        doseAmount,
        schedule,
        refillSchedule,
        brandGeneric,
      });
    }
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

  const handleFocus = (field) => {
    setInputFocused((prev) => ({ ...prev, [field]: true }));
  };

  const handleBlur = (field) => {
    // Delay hiding suggestions to allow click on suggestion
    setTimeout(() => {
      setInputFocused((prev) => ({ ...prev, [field]: false }));
    }, 150);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
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
            placeholder: placeholders.commonName,
          },
          {
            label: 'Medical Name',
            key: 'medicalName',
            placeholder: placeholders.medicalName,
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
                  onFocus={() => handleFocus(field.key)}
                  onBlur={() => handleBlur(field.key)}
                />
                {/* Show suggestions only when input is focused and has 2+ chars */}
                {inputFocused[field.key] &&
                  formData[field.key].length >= 2 &&
                  suggestions.length > 0 && (
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
                            className="cursor-pointer px-4 py-2 hover:bg-blue-100 flex flex-col"
                          >
                            <span className="font-medium">
                              {suggestion.commonName || 'Unknown'}
                            </span>
                            <span className="text-xs text-gray-500">
                              {suggestion.medicalName
                                ? suggestion.medicalName
                                : suggestion.commonName
                                  ? ''
                                  : ''}
                            </span>
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
    </div>
  );
}
