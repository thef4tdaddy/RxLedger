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
    brandGeneric: 'Generic',
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    const demo = getRandomDemoMedication();
    if (demo.commonName || demo.medicalName) {
      setPlaceholders({
        commonName: demo.commonName
          ? `e.g. ${demo.commonName}`
          : 'e.g. Tylenol',
        medicalName: demo.medicalName
          ? `e.g. ${demo.medicalName}`
          : 'e.g. Acetaminophen',
      });
    }
  }, []);

  // Debounce logic for both name fields
  const debounceTimeout = useRef(null);

  const validateForm = () => {
    const errors = {};

    // Required fields
    if (!formData.commonName.trim()) {
      errors.commonName = 'Common name is required';
    }
    if (!formData.doseAmount.trim()) {
      errors.doseAmount = 'Dose amount is required';
    }
    if (!formData.schedule.trim()) {
      errors.schedule = 'Schedule is required';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Ensure we have both names (fallback to commonName if medicalName is missing)
      const submissionData = {
        ...formData,
        medicalName: formData.medicalName.trim() || formData.commonName.trim(),
        commonName: formData.commonName.trim(),
        manufacturer: formData.manufacturer.trim(),
        pharmacy: formData.pharmacy.trim(),
        doseAmount: formData.doseAmount.trim(),
        schedule: formData.schedule.trim(),
        refillSchedule: formData.refillSchedule.trim(),
        brandGeneric: formData.brandGeneric || 'Generic',
      };

      await onSubmit(submissionData);

      // Only close if submission was successful
      onClose();
    } catch (error) {
      console.error('Failed to add medication:', error);
      // Keep form open so user can try again
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

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
          } catch (err) {
            console.error('Error fetching suggestions:', err);
            fetchedSuggestions = [];
          }

          // Filter and sort suggestions
          let filtered = (fetchedSuggestions || []).filter(
            (suggestion) =>
              suggestion &&
              (suggestion.commonName || suggestion.medicalName) &&
              (suggestion.commonName || suggestion.medicalName).trim() !== '',
          );

          filtered.sort((a, b) => {
            const aHasBoth = a.commonName && a.medicalName;
            const bHasBoth = b.commonName && b.medicalName;
            if (aHasBoth && !bHasBoth) return -1;
            if (!aHasBoth && bHasBoth) return 1;
            return 0;
          });

          // Remove duplicates
          const seen = new Set();
          filtered = filtered.filter((suggestion) => {
            const key = `${suggestion.commonName || ''}-${suggestion.medicalName || ''}`;
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
          });

          setSuggestions(
            filtered.length > 0 ? filtered : [{ isNoMatch: true }],
          );
        }, 300);
      } else {
        setSuggestions([]);
      }
    }
  };

  const handleSuggestionSelect = async (suggestion) => {
    if (suggestion.isNoMatch) return;

    const {
      commonName = '',
      medicalName = '',
      manufacturer = '',
      pharmacy = '',
      doseAmount = '',
      schedule = '',
      refillSchedule = '',
      brandGeneric = 'Generic',
    } = suggestion;

    // Auto-fill logic similar to your existing code
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

    // Handle cases with only one name - similar to your existing logic
    let filled = false;
    if (commonName && !medicalName) {
      try {
        const fetched = await fetchMedicationSuggestions(commonName);
        let match = (fetched || []).find(
          (s) =>
            s.commonName &&
            s.medicalName &&
            s.commonName.toLowerCase() === commonName.toLowerCase(),
        );
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
        }
      } catch (err) {
        console.error('Error fetching medical name suggestion:', err);
      }
    }

    if (!filled) {
      setFormData({
        commonName: commonName || medicalName,
        medicalName: medicalName || commonName,
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
    setTimeout(() => {
      setInputFocused((prev) => ({ ...prev, [field]: false }));
    }, 150);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-[#1B59AE]">
          Add New Medication
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600"
          disabled={isSubmitting}
        >
          ✕
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          {
            label: 'Common Name *',
            key: 'commonName',
            placeholder: placeholders.commonName,
            required: true,
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
          {
            label: 'Pharmacy',
            key: 'pharmacy',
            placeholder: 'e.g. Walgreens',
          },
          {
            label: 'Dose Amount *',
            key: 'doseAmount',
            placeholder: 'e.g. 500mg',
            required: true,
          },
          {
            label: 'Schedule *',
            key: 'schedule',
            placeholder: 'e.g. 2x daily',
            required: true,
          },
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
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#1B59AE] focus:border-transparent ${
                    validationErrors[field.key]
                      ? 'border-red-500'
                      : 'border-gray-300'
                  } ${
                    suggestedFields[field.key] ? 'text-gray-400' : 'text-black'
                  }`}
                  name={field.key}
                  autoComplete="on"
                  value={formData[field.key]}
                  placeholder={field.placeholder}
                  onChange={handleInputChange}
                  onFocus={() => handleFocus(field.key)}
                  onBlur={() => handleBlur(field.key)}
                  required={field.required}
                  disabled={isSubmitting}
                />
                {validationErrors[field.key] && (
                  <p className="text-red-500 text-xs mt-1">
                    {validationErrors[field.key]}
                  </p>
                )}

                {/* Suggestions dropdown */}
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
                              {suggestion.medicalName || ''}
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
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#1B59AE] focus:border-transparent ${
                    validationErrors[field.key]
                      ? 'border-red-500'
                      : 'border-gray-300'
                  } ${
                    suggestedFields[field.key] ? 'text-gray-400' : 'text-black'
                  }`}
                  name={field.key}
                  autoComplete="on"
                  value={formData[field.key] || ''}
                  placeholder={field.placeholder}
                  onChange={handleInputChange}
                  required={field.required}
                  disabled={isSubmitting}
                />
                {validationErrors[field.key] && (
                  <p className="text-red-500 text-xs mt-1">
                    {validationErrors[field.key]}
                  </p>
                )}
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
            value={formData.brandGeneric || 'Generic'}
            onChange={handleInputChange}
            disabled={isSubmitting}
          >
            <option value="Generic">Generic</option>
            <option value="Brand">Brand</option>
          </select>
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <button
          type="submit"
          className="px-6 py-3 bg-[#1B59AE] text-white rounded-lg font-medium hover:bg-[#48B4A2] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Adding...' : 'Add Medication'}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors disabled:opacity-50"
          disabled={isSubmitting}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
