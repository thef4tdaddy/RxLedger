import { demoMedications } from '../medications/Medications';

// Manufacturer counts aggregated over manufacturerHistory
export const manufacturerCounts = demoMedications.reduce((acc, med) => {
  const history = med.manufacturerHistory ?? [];
  history.forEach((name) => {
    const existing = acc.find((m) => m.manufacturer === name);
    if (existing) {
      existing.count += 1;
    } else {
      acc.push({ manufacturer: name, count: 1 });
    }
  });
  return acc;
}, []);

// Pharmacy counts
export const pharmacyCounts = demoMedications.reduce((acc, med) => {
  const existing = acc.find((p) => p.pharmacy === med.pharmacy);
  if (existing) {
    existing.count += 1;
  } else {
    acc.push({ pharmacy: med.pharmacy, count: 1 });
  }
  return acc;
}, []);

// Totals for dashboard summary cards
export const totalMedications = demoMedications.length;

export const medicationsTakenToday = demoMedications.filter(
  (m) => m.takenToday,
).length;

export const remindersOnCount = demoMedications.filter(
  (m) => m.remindersOn,
).length;
