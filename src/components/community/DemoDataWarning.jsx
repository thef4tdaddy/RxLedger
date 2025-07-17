// components/community/DemoDataWarning.jsx - Warning banner for community demo data
import { useState } from 'react';

export default function DemoDataWarning({ onDismiss }) {
  const [isDismissed, setIsDismissed] = useState(false);

  const handleDismiss = () => {
    setIsDismissed(true);
    if (onDismiss) onDismiss();
  };

  if (isDismissed) return null;

  return (
    <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-400 p-6 mb-6 rounded-lg shadow-sm">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg
            className="h-6 w-6 text-amber-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
        <div className="ml-4 flex-1">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-amber-800 mb-2">
                📊 Community Data Notice
              </h3>
              <div className="text-amber-700 space-y-2">
                <p className="font-medium">
                  🚧 <strong>Demo Data Currently Displayed</strong> 🚧
                </p>
                <p className="text-sm leading-relaxed">
                  The community insights shown below are{' '}
                  <strong>demonstration data</strong> and do not reflect real
                  user experiences yet. Real community insights will be
                  available once more users join RxLedger and begin sharing
                  their anonymized health data.
                </p>
                <div className="bg-amber-100 p-3 rounded-lg mt-3">
                  <p className="text-sm font-medium text-amber-800 mb-2">
                    What you&apos;re seeing:
                  </p>
                  <ul className="text-xs text-amber-700 space-y-1">
                    <li>
                      • <strong>Broad Insights:</strong> Sample statistics
                      showing how the feature will work
                    </li>
                    <li>
                      • <strong>Medication Insights:</strong> Example data for
                      common medications
                    </li>
                    <li>
                      • <strong>Community Trends:</strong> Simulated patterns to
                      demonstrate functionality
                    </li>
                  </ul>
                </div>
                <div className="bg-blue-100 p-3 rounded-lg mt-3">
                  <p className="text-sm font-medium text-blue-800 mb-2">
                    🔒 Your Privacy:
                  </p>
                  <p className="text-xs text-blue-700">
                    When real community data becomes available, all shared
                    information will remain completely anonymous. No personal
                    details, names, or identifying information will ever be
                    shared.
                  </p>
                </div>
                <div className="bg-green-100 p-3 rounded-lg mt-3">
                  <p className="text-sm font-medium text-green-800 mb-2">
                    🤝 Help Build the Community:
                  </p>
                  <p className="text-xs text-green-700">
                    You can contribute to real community insights by using the
                    &ldquo;Share My Progress&rdquo; feature below. Your
                    anonymized data will help other users make informed
                    decisions about their health.
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={handleDismiss}
              className="ml-4 text-amber-500 hover:text-amber-700 transition-colors"
              title="Dismiss this warning"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// components/community/CommunityHeader.jsx - Updated with demo warning integration
export function CommunityHeader() {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-3xl font-bold text-[#1B59AE] mb-2">
            Community Insights
          </h1>
          <p className="text-gray-600">
            Discover patterns and insights from the RxLedger community to
            support your health journey
          </p>
        </div>
        <div className="hidden md:flex items-center gap-2 text-sm text-gray-500">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
          <span>Privacy Protected</span>
        </div>
      </div>

      {/* Demo Data Warning */}
      <DemoDataWarning />
    </div>
  );
}
