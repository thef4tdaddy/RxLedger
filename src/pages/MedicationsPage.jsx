import React, { useState } from 'react';
import MedicationsHeader from '../components/medications/MedicationsHeader';
import AddMedicationForm from '../components/medications/AddMedicationForm';
import MedicationsTable from '../components/medications/MedicationsTable';
import SummaryCards from '../components/medications/SummaryCards';
import MedicationSettings from '../components/medications/MedicationSettings';

export default function EnhancedMedicationsPage() {
  const [showAddForm, setShowAddForm] = useState(false);

  return (
    <div className="p-6 max-w-6xl mx-auto relative">
      <MedicationsHeader onAdd={() => setShowAddForm(true)} />

      {showAddForm && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 transition-all duration-300">
          <div className="bg-white p-6 rounded shadow-lg max-w-lg w-full border border-black">
            <AddMedicationForm onClose={() => setShowAddForm(false)} />
          </div>
        </div>
      )}

      <MedicationsTable />

      <SummaryCards />

      <MedicationSettings />
    </div>
  );
}
