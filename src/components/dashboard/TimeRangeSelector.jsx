export default function TimeRangeSelector({ selected, onSelect }) {
  return (
    <div className="flex gap-2 mb-6">
      {['Today', 'Week', 'Month'].map((period) => (
        <button
          key={period}
          onClick={() => onSelect(period)}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            selected === period
              ? 'bg-[#1B59AE] text-white'
              : 'bg-gray-200 text-black hover:bg-[#10B981]'
          }`}
        >
          {period}
        </button>
      ))}
    </div>
  );
}
