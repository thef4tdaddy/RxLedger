// components/community/CommunityHeader.jsx - Updated with demo warning integration
import DemoDataWarning from './DemoDataWarning';
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
