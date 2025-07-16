// components/community/CommunityActions.jsx
import React from 'react';

export default function CommunityActions({
  onShareProgress,
  onViewTrends,
  hasMedications,
}) {
  return (
    <div className="space-y-6">
      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={onViewTrends}
          className="flex-1 px-6 py-3 bg-[#1B59AE] text-white rounded-lg font-medium hover:bg-[#48B4A2] transition-colors flex items-center justify-center gap-2"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
          View Community Trends
        </button>

        <button
          onClick={onShareProgress}
          disabled={!hasMedications}
          className={`flex-1 px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
            hasMedications
              ? 'bg-[#10B981] text-white hover:bg-[#0EA5E9]'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
          title={
            !hasMedications
              ? 'Add medications first to share your progress'
              : ''
          }
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
            />
          </svg>
          Share My Progress
        </button>
      </div>

      {/* Information cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Privacy information */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <div className="text-blue-500 text-2xl">🔒</div>
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">
                Your Privacy is Protected
              </h3>
              <ul className="text-blue-800 text-sm space-y-1">
                <li>• All shared data is completely anonymous</li>
                <li>• No personal information is ever revealed</li>
                <li>• You control what gets shared</li>
                <li>• Data is aggregated with thousands of others</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Community benefits */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <div className="text-green-500 text-2xl">🤝</div>
            <div>
              <h3 className="font-semibold text-green-900 mb-2">
                Help Others Like You
              </h3>
              <ul className="text-green-800 text-sm space-y-1">
                <li>• Share experiences to help others</li>
                <li>• Discover what works for similar cases</li>
                <li>• Contribute to medical research</li>
                <li>• Build a supportive community</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Community guidelines */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <span>📋</span>
          Community Guidelines
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
          <div>
            <h4 className="font-medium mb-2">✅ Please Do:</h4>
            <ul className="space-y-1">
              <li>• Share honest experiences</li>
              <li>• Report accurate side effects</li>
              <li>• Respect others' experiences</li>
              <li>• Follow medical advice</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">❌ Please Don't:</h4>
            <ul className="space-y-1">
              <li>• Give medical advice</li>
              <li>• Share personal information</li>
              <li>• Make unsubstantiated claims</li>
              <li>• Promote specific brands</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Support contact */}
      <div className="text-center">
        <p className="text-gray-600 text-sm">
          Questions about community features?
          <a href="#/support" className="text-[#1B59AE] hover:underline ml-1">
            Contact Support
          </a>
        </p>
      </div>
    </div>
  );
}
