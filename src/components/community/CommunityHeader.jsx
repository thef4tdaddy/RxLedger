// components/community/CommunityHeader.jsx
import React from 'react';

export default function CommunityHeader() {
  const communityQuote =
    'Together, we share experiences and insights to help each other on our health journeys. All data is anonymized to protect your privacy.';

  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="text-4xl">🤝</div>
        <h1 className="text-3xl font-bold text-[#1B59AE]">
          Community Insights
        </h1>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <div className="text-blue-500 text-xl">💡</div>
          <div>
            <p className="text-blue-900 italic font-medium">
              "{communityQuote}"
            </p>
            <p className="text-blue-700 text-sm mt-2">
              🔒 Your personal information is never shared. All insights are
              generated from anonymous, aggregated data.
            </p>
          </div>
        </div>
      </div>

      {/* Community stats preview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
          <div className="text-2xl font-bold text-[#1B59AE] mb-1">12,847</div>
          <div className="text-sm text-gray-600">Anonymous Contributors</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
          <div className="text-2xl font-bold text-[#10B981] mb-1">2,156</div>
          <div className="text-sm text-gray-600">Medications Tracked</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
          <div className="text-2xl font-bold text-[#F59E0B] mb-1">847K</div>
          <div className="text-sm text-gray-600">Shared Experiences</div>
        </div>
      </div>
    </div>
  );
}
