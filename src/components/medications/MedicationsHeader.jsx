export default function MedicationsHeader({ onAdd }) {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-3xl font-bold text-gray-800">My Medications</h1>
      <button
        onClick={onAdd}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 flex items-center gap-2 transition-colors"
      >
        <span className="text-lg">+</span>
        Add Medication
      </button>
    </div>
  );
}
