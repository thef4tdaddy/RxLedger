import { useEffect, useState } from 'react';
import MedicationsHeader from '../components/medications/MedicationsHeader';
import MedicationsTable from '../components/medications/MedicationsTable';
import SummaryCards from '../components/medications/SummaryCards';
import MedicationSettings from '../components/medications/MedicationSettings';
import AddMedicationForm from '../components/medications/AddMedicationForm';
import { getMedications } from '../services/medicationService.js';

export default function MedicationsPage() {
  const [medications, setMedications] = useState([]);
  const [showAdd, setShowAdd] = useState(false);

  const load = async () => {
    try {
      const data = await getMedications();
      setMedications(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <MedicationsHeader onAdd={() => setShowAdd(true)} />
      {showAdd && (
        <AddMedicationForm
          onClose={() => setShowAdd(false)}
          onAdded={load}
        />
      )}
      <MedicationsTable
        medications={medications}
        onToggleTaken={() => {}}
        onToggleReminders={() => {}}
      />
      <SummaryCards medications={medications} />
      <MedicationSettings />
    </div>
  );
}
