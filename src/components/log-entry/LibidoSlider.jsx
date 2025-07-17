// components/log-entry/LibidoSlider.jsx - Simplified to match your style
export default function LibidoSlider({ libido, onLibidoChange }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-3">
        Libido Level
      </label>
      <div className="px-2">
        <input
          type="range"
          min="1"
          max="10"
          value={libido}
          onChange={(e) => onLibidoChange(parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-sm text-gray-600 mt-1">
          <span>Low</span>
          <span>Medium</span>
          <span>High</span>
        </div>
      </div>
    </div>
  );
}
