import MoodTrendChart from '../components/trends/MoodTrendChart';
import SleepTrendChart from '../components/trends/SleepTrendChart';
import EnergyTrendChart from '../components/trends/EnergyTrendChart';
import MedsTakenTimeChart from '../components/trends/MedsTakenTimeChart';
import SideEffectsHeatmap from '../components/trends/SideEffectsHeatmap';

export default function TrendsPage() {
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Trends</h1>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">
          Export Data
        </button>
      </div>

      <div className="mb-4">
        <label className="mr-2 font-medium">Time Range:</label>
        <select className="border rounded px-2 py-1">
          <option>Last 7 Days</option>
          <option>Last Month</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <MoodTrendChart />
        <SleepTrendChart />
        <EnergyTrendChart />
        <MedsTakenTimeChart />
        <div className="md:col-span-2">
          <SideEffectsHeatmap />
        </div>
      </div>

      <div className="text-center">
        <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">
          Generate Full Report
        </button>
      </div>
    </div>
  );
}
