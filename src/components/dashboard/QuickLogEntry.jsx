import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Select from 'react-select';
import { demoSideEffectsOptions } from '../../demo-data/sideEffects';
import { getMedications } from '../../services/medicationService.js';
import { addLogEntry } from '../../services/logService.js';

export default function QuickLogEntry() {
  const [mood, setMood] = useState(null);
  const [medOptions, setMedOptions] = useState([]);
  const [meds, setMeds] = useState([]);
  const [effects, setEffects] = useState([]);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    getMedications()
      .then((list) => {
        const options = list.map((m) => ({ value: m.id, label: m.commonName }));
        setMedOptions([{ value: 'all', label: 'All' }, ...options]);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleSubmit = async () => {
    try {
      await addLogEntry({
        type: 'quick',
        created: new Date().toISOString(),
        mood,
        meds: meds.map((m) => m.value),
        sideEffects: effects.map((e) => e.value),
        notes,
      });
      setMood(null);
      setMeds([]);
      setEffects([]);
      setNotes('');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border-2 border-black mb-8">
      <h2 className="text-xl font-semibold text-[#1B59AE] mb-4">
        Quick Log Entry
      </h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-black mb-2">
            Mood
          </label>
          <div className="flex gap-2">
            {[
              { e: '😊', v: 3 },
              { e: '😐', v: 2 },
              { e: '😞', v: 1 },
            ].map(({ e, v }) => (
              <button
                key={e}
                type="button"
                onClick={() => setMood(v)}
                className={`p-2 text-2xl rounded transition-colors ${mood === v ? 'bg-[#10B981]' : 'hover:bg-[#10B981]'}`}
              >
                {e}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-black mb-2">
            Take Meds
          </label>
          <Select
            isMulti
            options={medOptions}
            value={meds}
            onChange={(v) => setMeds(v || [])}
            className="basic-multi-select"
            classNamePrefix="select"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-black mb-2">
            Side Effects
          </label>
          <Select
            isMulti
            options={demoSideEffectsOptions}
            value={effects}
            onChange={(v) => setEffects(v || [])}
            className="basic-multi-select"
            classNamePrefix="select"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-black mb-2">
            Notes
          </label>
          <textarea
            className="w-full p-3 border-2 border-gray-400 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows="3"
            placeholder="How are you feeling today?"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
       </div>
        <button
          type="button"
          onClick={handleSubmit}
          className="w-full md:w-auto px-6 py-3 bg-[#1B59AE] text-white rounded-lg font-medium hover:bg-[#10B981] transition-colors"
        >
          Log Entry
        </button>
        <div className="mt-4 text-center">
          <Link
            to="/log-entry"
            className="inline-block text-[#1B59AE] font-semibold hover:underline"
          >
            Start Full Log Entry
          </Link>
        </div>
      </div>
    </div>
  );
}
