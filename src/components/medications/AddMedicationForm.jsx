export default function AddMedicationForm({ onClose }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Add New Medication
        </h2>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          ✕
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { label: 'Common Name', placeholder: 'e.g., Sertraline' },
          { label: 'Medical Name', placeholder: 'e.g., Sertraline HCl' },
          { label: 'Manufacturer', placeholder: 'e.g., Pfizer' },
          { label: 'Pharmacy', placeholder: 'e.g., CVS Pharmacy' },
          { label: 'Dose Amount', placeholder: 'e.g., 50mg' },
          { label: 'Schedule', placeholder: 'e.g., Daily 8:00am' },
          { label: 'Refill Schedule', placeholder: 'e.g., Every 30 days' },
        ].map((field) => (
          <div key={field.label}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {field.label}
            </label>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={field.placeholder}
            />
          </div>
        ))}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Brand/Generic
          </label>
          <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option>Generic</option>
            <option>Brand</option>
          </select>
        </div>
      </div>
      <div className="flex gap-3 mt-6">
        <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
          Add Medication
        </button>
        <button
          onClick={onClose}
          className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
