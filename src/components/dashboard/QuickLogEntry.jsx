import Select from 'react-select';
import { Link } from 'react-router-dom';
export default function QuickLogEntry() {
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
            {['😊', '😐', '😞'].map((emoji) => (
              <button
                key={emoji}
                className="p-2 text-2xl hover:bg-[#10B981] rounded transition-colors"
              >
                {emoji}
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
            options={[
              { value: 'all', label: 'All' },
              { value: 'sertraline', label: 'Sertraline' },
              { value: 'metformin', label: 'Metformin' },
            ]}
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
            options={[
              { value: 'nausea', label: 'Nausea' },
              { value: 'headache', label: 'Headache' },
              { value: 'dizziness', label: 'Dizziness' },
              { value: 'fatigue', label: 'Fatigue' },
            ]}
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
          />
        </div>
        <button className="w-full md:w-auto px-6 py-3 bg-[#1B59AE] text-white rounded-lg font-medium hover:bg-[#10B981] transition-colors">
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
