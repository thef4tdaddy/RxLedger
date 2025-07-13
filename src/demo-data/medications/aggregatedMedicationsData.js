// src/demo-data/medications/aggregatedMedicationsData.js
import { demoMedications } from './Medications.js';

export const aggregatedMedicationData = (() => {
  const total = demoMedications.length;
  const taken = demoMedications.filter((m) => m.takenToday).length;
  const reminders = demoMedications.filter((m) => m.remindersOn).length;
  const multipleManufacturers = demoMedications.filter(
    (m) =>
      m.manufacturerHistory &&
      new Set(
        m.manufacturerHistory.map((h) =>
          typeof h === 'string' ? h : h.manufacturer,
        ),
      ).size > 1,
  ).length;

  return {
    total,
    taken,
    reminders,
    multipleManufacturers,
  };
})();
