import { useState } from 'react';
import { addLogEntry } from '../services/logService.js';

export default function LogEntryPage() {
  const today = new Date();
  const [date, setDate] = useState(today.toISOString().split('T')[0]);
  const [time, setTime] = useState(today.toTimeString().slice(0, 5));
  const [mood, setMood] = useState(null);
  const [energy, setEnergy] = useState(5);
  const [sleep, setSleep] = useState('');
  const symptomsList = [
    'Headache',
    'Nausea',
    'Dizziness',
    'Fatigue',
    'Anxiety',
    'Insomnia',
    'Appetite loss',
    'Dry mouth',
    'Drowsiness',
  ];
  const [symptoms, setSymptoms] = useState([]);
  const [notes, setNotes] = useState('');

  const toggleSymptom = (s) => {
    setSymptoms((cur) => (cur.includes(s) ? cur.filter((x) => x !== s) : [...cur, s]));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addLogEntry({
        type: 'full',
        created: new Date(`${date}T${time}`).toISOString(),
        mood,
        energy: Number(energy) * 10,
        sleepHours: sleep ? Number(sleep) : null,
        symptoms,
        notes,
      });
      setNotes('');
      setSymptoms([]);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Log Entry</h1>
        <p className="text-gray-600 mt-1">How are you feeling today?</p>
      </div>

      {/* Log Entry Form */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date
              </label>
              <input
                type="date"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time
              </label>
              <input
                type="time"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>
          </div>

          {/* Mood */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Mood
            </label>
            <div className="flex gap-3">
              {[
                { e: '😊', v: 5 },
                { e: '😐', v: 3 },
                { e: '😞', v: 1 },
                { e: '😠', v: 0 },
                { e: '😱', v: 2 },
                { e: '😴', v: 4 },
              ].map(({ e, v }) => (
                <button
                  key={e}
                  type="button"
                  onClick={() => setMood(v)}
                  className={`p-4 text-3xl rounded-lg transition-colors ${mood === v ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          {/* Energy Level */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Energy Level
            </label>
            <div className="px-2">
              <input
                type="range"
                min="1"
                max="10"
                value={energy}
                onChange={(e) => setEnergy(e.target.value)}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-sm text-gray-600 mt-1">
                <span>Low</span>
                <span>Medium</span>
                <span>High</span>
              </div>
            </div>
          </div>

          {/* Sleep */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sleep (hours)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0"
                max="24"
                step="0.5"
                placeholder="8"
                value={sleep}
                onChange={(e) => setSleep(e.target.value)}
                className="w-24 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <span className="text-gray-600">hours</span>
            </div>
          </div>

          {/* Symptoms */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Symptoms (select all that apply)
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {symptomsList.map((symptom) => (
                <label
                  key={symptom}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={symptoms.includes(symptom)}
                    onChange={() => toggleSymptom(symptom)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{symptom}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows="4"
              placeholder="Any additional notes about how you're feeling, side effects, or other observations..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Save Entry
          </button>
        </form>
      </div>
    </div>
  );
}
