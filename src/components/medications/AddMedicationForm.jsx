import { demoMedications } from '../../demo-data/medications/Medications';
import { fetchMedicationSuggestions } from '../../services/medication-autofill/medicationSuggestionService';
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';

// Optimized: Move static data outside component to prevent recreation
const FIELD_CONFIG = [
  {
    label: 'Common Name *',
    key: 'commonName',
    placeholder: 'e.g. Tylenol',
    required: true,
    hasAutocomplete: true,
  },
  {
    label: 'Medical Name',
    key: 'medicalName',
    placeholder: 'e.g. Acetaminophen',
    hasAutocomplete: true,
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
];

const INITIAL_FORM_DATA = {
  commonName: '',
  medicalName: '',
  manufacturer: '',
  pharmacy: '',
  doseAmount: '',
  schedule: '',
  refillSchedule: '',
  brandGeneric: 'Generic',
};

// Optimized: Memoized random demo function
const getRandomDemoMedication = () => {
  if (!demoMedications?.length) return {};
  const idx = Math.floor(Math.random() * demoMedications.length);
  return demoMedications[idx];
};

// Optimized: Custom hook for suggestions
const useMedicationSuggestions = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const abortControllerRef = useRef(null);
  const debounceTimeoutRef = useRef(null);

  const fetchSuggestions = useCallback(async (query) => {
    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Clear previous debounce
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    debounceTimeoutRef.current = setTimeout(async () => {
      setIsLoading(true);
      abortControllerRef.current = new AbortController();

      try {
        const results = await fetchMedicationSuggestions(query, {
          signal: abortControllerRef.current.signal,
        });

        // Optimized: Single filter and sort operation
        const processedSuggestions = (results || [])
          .filter((s) => s?.commonName?.trim() || s?.medicalName?.trim())
          .sort((a, b) => {
            // Prioritize suggestions with both names
            const aComplete = !!(a.commonName && a.medicalName);
            const bComplete = !!(b.commonName && b.medicalName);
            if (aComplete !== bComplete) return bComplete - aComplete;

            // Then sort by relevance score if available
            if (a.relevanceScore !== b.relevanceScore) {
              return (b.relevanceScore || 0) - (a.relevanceScore || 0);
            }

            return 0;
          })
          // Optimized: Remove duplicates more efficiently
          .filter((suggestion, index, array) => {
            const key = `${suggestion.commonName || ''}-${suggestion.medicalName || ''}`;
            return (
              array.findIndex(
                (s) => `${s.commonName || ''}-${s.medicalName || ''}` === key,
              ) === index
            );
          })
          .slice(0, 8); // Limit results for performance

        setSuggestions(
          processedSuggestions.length > 0
            ? processedSuggestions
            : [{ isNoMatch: true }],
        );
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Error fetching suggestions:', error);
          setSuggestions([]);
        }
      } finally {
        setIsLoading(false);
      }
    }, 300);
  }, []);

  const clearSuggestions = useCallback(() => {
    setSuggestions([]);
    setIsLoading(false);
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  return { suggestions, isLoading, fetchSuggestions, clearSuggestions };
};

// Optimized: Custom hook for form validation
const useFormValidation = (formData) => {
  return useMemo(() => {
    const errors = {};

    if (!formData.commonName?.trim()) {
      errors.commonName = 'Common name is required';
    }
    if (!formData.doseAmount?.trim()) {
      errors.doseAmount = 'Dose amount is required';
    }
    if (!formData.schedule?.trim()) {
      errors.schedule = 'Schedule is required';
    }

    return errors;
  }, [formData.commonName, formData.doseAmount, formData.schedule]);
};

export default function AddMedicationForm({ onClose, onSubmit }) {
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [suggestedFields, setSuggestedFields] = useState({});
  const [inputFocused, setInputFocused] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  // Optimized: Use custom hooks
  const { suggestions, isLoading, fetchSuggestions, clearSuggestions } =
    useMedicationSuggestions();
  const formErrors = useFormValidation(formData);

  // Optimized: Memoized placeholders
  const placeholders = useMemo(() => {
    const demo = getRandomDemoMedication();
    return {
      commonName: demo.commonName ? `e.g. ${demo.commonName}` : 'e.g. Tylenol',
      medicalName: demo.medicalName
        ? `e.g. ${demo.medicalName}`
        : 'e.g. Acetaminophen',
    };
  }, []);

  // Optimized: Update validation errors only when form errors change
  useEffect(() => {
    setValidationErrors(formErrors);
  }, [formErrors]);

  // Optimized: Memoized event handlers
  const handleInputChange = useCallback(
    (e) => {
      const { name, value } = e.target;

      setFormData((prev) => ({ ...prev, [name]: value }));

      // Clear suggested field indicator
      if (suggestedFields[name]) {
        setSuggestedFields((prev) => ({ ...prev, [name]: false }));
      }

      // Trigger suggestions for autocomplete fields
      if (
        (name === 'commonName' || name === 'medicalName') &&
        value.length >= 2
      ) {
        fetchSuggestions(value);
      } else if (name === 'commonName' || name === 'medicalName') {
        clearSuggestions();
      }
    },
    [suggestedFields, fetchSuggestions, clearSuggestions],
  );

  const handleSuggestionSelect = useCallback(
    async (suggestion) => {
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

      // Optimized: Simplified auto-fill logic
      let finalFormData = {
        commonName: commonName || medicalName,
        medicalName: medicalName || commonName,
        manufacturer,
        pharmacy,
        doseAmount,
        schedule,
        refillSchedule,
        brandGeneric,
      };

      // Enhanced: Try to get missing medical name if we only have common name
      if (commonName && !medicalName) {
        try {
          const additionalSuggestions =
            await fetchMedicationSuggestions(commonName);
          const exactMatch = additionalSuggestions?.find(
            (s) =>
              s.commonName?.toLowerCase() === commonName.toLowerCase() &&
              s.medicalName,
          );

          if (exactMatch) {
            finalFormData.medicalName = exactMatch.medicalName;
            finalFormData.manufacturer =
              exactMatch.manufacturer || manufacturer;
            finalFormData.pharmacy = exactMatch.pharmacy || pharmacy;
          }
        } catch (error) {
          console.error('Error fetching additional details:', error);
        }
      }

      setFormData(finalFormData);
      setSuggestedFields({
        commonName: true,
        medicalName: true,
        manufacturer: !!finalFormData.manufacturer,
        pharmacy: !!finalFormData.pharmacy,
        doseAmount: !!finalFormData.doseAmount,
        schedule: !!finalFormData.schedule,
        refillSchedule: !!finalFormData.refillSchedule,
      });
      clearSuggestions();
    },
    [clearSuggestions],
  ); // Removed fetchMedicationSuggestions from dependencies

  const handleFocus = useCallback((field) => {
    setInputFocused((prev) => ({ ...prev, [field]: true }));
  }, []);

  const handleBlur = useCallback((field) => {
    // Optimized: Shorter timeout for better UX
    setTimeout(() => {
      setInputFocused((prev) => ({ ...prev, [field]: false }));
    }, 100);
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (Object.keys(formErrors).length > 0) {
        return;
      }

      setIsSubmitting(true);

      try {
        // Optimized: Clean data preparation
        const cleanData = Object.entries(formData).reduce(
          (acc, [key, value]) => {
            acc[key] = typeof value === 'string' ? value.trim() : value;
            return acc;
          },
          {},
        );

        // Ensure medical name fallback
        if (!cleanData.medicalName) {
          cleanData.medicalName = cleanData.commonName;
        }

        await onSubmit(cleanData);
        onClose();
      } catch (error) {
        console.error('Failed to add medication:', error);
        // Enhanced: Could add error state here for user feedback
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, formErrors, onSubmit, onClose],
  );

  // Optimized: Memoized render functions
  const renderAutocompleteField = useCallback(
    (field) => (
      <div key={field.key} className="relative">
        <label className="block text-sm font-medium text-[#1B59AE] mb-2">
          {field.label}
        </label>
        <input
          type="text"
          className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#1B59AE] focus:border-transparent transition-colors ${
            validationErrors[field.key] ? 'border-red-500' : 'border-gray-300'
          } ${suggestedFields[field.key] ? 'text-gray-400' : 'text-black'}`}
          name={field.key}
          autoComplete="off"
          value={formData[field.key] || ''}
          placeholder={placeholders[field.key] || field.placeholder}
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

        {/* Enhanced suggestions dropdown */}
        {inputFocused[field.key] && formData[field.key]?.length >= 2 && (
          <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-48 overflow-auto shadow-lg">
            {isLoading ? (
              <div className="px-4 py-3 flex items-center gap-2 text-gray-500">
                <div className="w-4 h-4 border-2 border-blue-300 border-t-blue-600 rounded-full animate-spin"></div>
                Searching medications...
              </div>
            ) : suggestions.length > 0 ? (
              <ul>
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
                      className="cursor-pointer px-4 py-2 hover:bg-blue-50 border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-900">
                          {suggestion.commonName || 'Unknown'}
                        </span>
                        {suggestion.medicalName &&
                          suggestion.medicalName !== suggestion.commonName && (
                            <span className="text-xs text-gray-500">
                              {suggestion.medicalName}
                            </span>
                          )}
                        {suggestion.manufacturer && (
                          <span className="text-xs text-blue-600">
                            by {suggestion.manufacturer}
                          </span>
                        )}
                        {suggestion.confidence && (
                          <div className="flex items-center gap-1 mt-1">
                            <div className="w-12 h-1 bg-gray-200 rounded">
                              <div
                                className="h-full bg-green-500 rounded"
                                style={{
                                  width: `${suggestion.confidence * 100}%`,
                                }}
                              />
                            </div>
                            <span className="text-xs text-gray-400">
                              {Math.round(suggestion.confidence * 100)}% match
                            </span>
                          </div>
                        )}
                      </div>
                    </li>
                  ),
                )}
              </ul>
            ) : null}
          </div>
        )}
      </div>
    ),
    [
      formData,
      validationErrors,
      suggestedFields,
      inputFocused,
      placeholders,
      isSubmitting,
      isLoading,
      suggestions,
      handleInputChange,
      handleFocus,
      handleBlur,
      handleSuggestionSelect,
    ],
  );

  const renderRegularField = useCallback(
    (field) => (
      <div key={field.key}>
        <label className="block text-sm font-medium text-[#1B59AE] mb-2">
          {field.label}
        </label>
        <input
          type="text"
          className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#1B59AE] focus:border-transparent transition-colors ${
            validationErrors[field.key] ? 'border-red-500' : 'border-gray-300'
          } ${suggestedFields[field.key] ? 'text-gray-400' : 'text-black'}`}
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
    ),
    [
      formData,
      validationErrors,
      suggestedFields,
      isSubmitting,
      handleInputChange,
    ],
  );

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
          className="text-gray-400 hover:text-gray-600 transition-colors"
          disabled={isSubmitting}
        >
          ✕
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {FIELD_CONFIG.map((field) =>
          field.hasAutocomplete
            ? renderAutocompleteField(field)
            : renderRegularField(field),
        )}

        <div>
          <label className="block text-sm font-medium text-[#1B59AE] mb-2">
            Brand/Generic
          </label>
          <select
            className={`w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B59AE] focus:border-transparent transition-colors ${
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
          disabled={isSubmitting || Object.keys(formErrors).length > 0}
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Adding...
            </span>
          ) : (
            'Add Medication'
          )}
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
