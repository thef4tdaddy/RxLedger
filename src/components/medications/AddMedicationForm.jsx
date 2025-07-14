import { useState } from 'react';
import { addMedication } from '../../services/medicationService.js';

export default function AddMedicationForm({ onClose, onAdded }) {
  const [form, setForm] = useState({
    commonName: '',
    medicalName: '',
    brandGeneric: 'Generic',
    manufacturer: '',
    pharmacy: '',
    doseAmount: '',
    schedule: '',
    refillSchedule: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addMedication(form);
    if (onAdded) onAdded();
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Add New Medication</h2>
        <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Common Name</label>
          <input type="text" name="commonName" value={form.commonName} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"/>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Medical Name</label>
          <input type="text" name="medicalName" value={form.medicalName} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"/>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Brand/Generic</label>
          <select name="brandGeneric" value={form.brandGeneric} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option value="Generic">Generic</option>
            <option value="Brand">Brand</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Manufacturer</label>
          <input type="text" name="manufacturer" value={form.manufacturer} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"/>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Pharmacy</label>
          <input type="text" name="pharmacy" value={form.pharmacy} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"/>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Dose Amount</label>
          <input type="text" name="doseAmount" value={form.doseAmount} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"/>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Schedule</label>
          <input type="text" name="schedule" value={form.schedule} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"/>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Refill Schedule</label>
          <input type="text" name="refillSchedule" value={form.refillSchedule} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"/>
        </div>
      </div>
      <div className="flex gap-3 mt-6">
        <button type="submit" className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">Add Medication</button>
        <button type="button" onClick={onClose} className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors">Cancel</button>
      </div>
    </form>
  );
}
