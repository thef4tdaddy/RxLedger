// components/log-entry/NotesInput.jsx - Simplified to match your style
export default function NotesInput({ notes, onNotesChange }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Notes
      </label>
      <textarea
        value={notes}
        onChange={(e) => onNotesChange(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        rows="4"
        placeholder="Any additional notes about how you're feeling, side effects, or other observations..."
      />
    </div>
  );
}
