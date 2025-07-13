import React, { useState } from 'react';

export default function AddMedicationForm({ onClose }) {
  // Removed unused medlineError, setMedlineError, suggestedFields, setSuggestedFields
  const [formData, setFormData] = useState({
    brandGeneric: '',
    // Add other fields if needed
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = (data) => {
    console.log('Submitting form data:', data);
    // You could add submission logic here
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
            name: 'commonName',
            placeholder: 'e.g., Sertraline',
          },
          {
            label: 'Medical Name',
            name: 'medicalName',
            placeholder: 'e.g., Sertraline HCl',
          },
          {
            label: 'Manufacturer',
            name: 'manufacturer',
            placeholder: 'e.g., Pfizer',
          },
          {
            label: 'Pharmacy',
            name: 'pharmacy',
            placeholder: 'e.g., CVS Pharmacy',
          },
          {
            label: 'Dose Amount',
            name: 'doseAmount',
            placeholder: 'e.g., 50mg',
          },
          {
            label: 'Schedule',
            name: 'schedule',
            placeholder: 'e.g., Daily 8:00am',
          },
          {
            label: 'Refill Schedule',
            name: 'refillSchedule',
            placeholder: 'e.g., Every 30 days',
          },
        ].map((field) => (
          <div key={field.label}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {field.label}
            </label>
            <input
              type="text"
              name={field.name}
              value={formData[field.name] || ''}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={field.placeholder}
            />
          </div>
        ))}
        <div>
          <label className="block text-sm font-medium text-[#1B59AE] mb-2">
            Brand/Generic
          </label>
          <select
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B59AE] focus:border-transparent"
            name="brandGeneric"
            value={formData.brandGeneric}
            onChange={handleInputChange}
          >
            <option value="">Select</option>
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
          onClick={onClose}
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
