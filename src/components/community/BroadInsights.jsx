// components/community/BroadInsights.jsx
import { useState, useEffect } from 'react';

export default function BroadInsights() {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBroadInsights = async () => {
      try {
        // In a real implementation, this would query aggregated community data
        // For now, we'll use demo insights
        const demoInsights = [
          '78% of users report better medication adherence when using daily reminders',
          'Morning medications show 23% higher compliance rates than evening doses',
          "Users who track side effects identify patterns 2x faster than those who don't",
          'Community members with chronic conditions benefit from peer support groups',
          'Generic medications show equivalent effectiveness to brand names in 94% of cases',
        ];

        // Simulate loading delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        setInsights(demoInsights);
      } catch (error) {
        console.error('Error loading broad insights:', error);
        setInsights([
          'Unable to load community insights at this time',
          'Please check your connection and try again',
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadBroadInsights();
  }, []);

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
        <h2 className="text-xl font-semibold text-[#1B59AE] mb-4 flex items-center gap-2">
          <span>📊</span>
          Broad Community Insights
        </h2>
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
      <h2 className="text-xl font-semibold text-[#1B59AE] mb-4 flex items-center gap-2">
        <span>📊</span>
        Broad Community Insights
      </h2>

      <div className="space-y-3">
        {insights.map((insight, index) => (
          <div
            key={index}
            className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="text-[#10B981] mt-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <p className="text-gray-800 flex-1">{insight}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-blue-800 text-sm">
          💡 <strong>Note:</strong> These insights are generated from anonymized
          community data. Individual results may vary. Always consult your
          healthcare provider for medical advice.
        </p>
      </div>
    </div>
  );
}
