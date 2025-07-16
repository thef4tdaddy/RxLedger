// components/community/CommunityTrendsModal.jsx
import { useState, useEffect } from 'react';
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit,
} from 'firebase/firestore';
import { db } from '../../utils/firebase';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

export default function CommunityTrendsModal({ medications, onClose }) {
  const [activeTab, setActiveTab] = useState('effectiveness');
  const [communityData, setCommunityData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMedication, setSelectedMedication] = useState('all');

  useEffect(() => {
    loadCommunityTrends();
  }, []);

  const loadCommunityTrends = async () => {
    try {
      setLoading(true);

      // In a real implementation, this would query the communityShares collection
      // For now, we'll generate realistic demo data
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const demoTrends = generateDemoTrends();
      setCommunityData(demoTrends);
    } catch (error) {
      console.error('Error loading community trends:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateDemoTrends = () => {
    return {
      effectiveness: [
        { medication: 'Lisinopril', avgRating: 8.3, reportCount: 1247 },
        { medication: 'Metformin', avgRating: 8.1, reportCount: 2156 },
        { medication: 'Adderall', avgRating: 7.9, reportCount: 891 },
        { medication: 'Lexapro', avgRating: 7.6, reportCount: 1563 },
        { medication: 'Synthroid', avgRating: 8.5, reportCount: 934 },
      ],
      sideEffects: [
        { effect: 'Headache', percentage: 15, severity: 'Mild' },
        { effect: 'Nausea', percentage: 12, severity: 'Mild' },
        { effect: 'Dizziness', percentage: 8, severity: 'Mild' },
        { effect: 'Fatigue', percentage: 18, severity: 'Moderate' },
        { effect: 'Dry Mouth', percentage: 6, severity: 'Mild' },
      ],
      adherence: [
        { timeframe: 'Week 1', percentage: 94 },
        { timeframe: 'Month 1', percentage: 87 },
        { timeframe: 'Month 3', percentage: 79 },
        { timeframe: 'Month 6', percentage: 73 },
        { timeframe: 'Year 1', percentage: 68 },
      ],
      demographics: [
        { ageRange: '18-25', count: 1234, percentage: 12 },
        { ageRange: '26-35', count: 2856, percentage: 28 },
        { ageRange: '36-45', count: 2341, percentage: 23 },
        { ageRange: '46-55', count: 1987, percentage: 19 },
        { ageRange: '56-65', count: 1129, percentage: 11 },
        { ageRange: '65+', count: 743, percentage: 7 },
      ],
    };
  };

  const COLORS = [
    '#1B59AE',
    '#10B981',
    '#F59E0B',
    '#EF4444',
    '#8B5CF6',
    '#06B6D4',
  ];

  const renderEffectivenessChart = () => (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={communityData.effectiveness}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="medication" fontSize={12} />
          <YAxis domain={[0, 10]} />
          <Tooltip
            formatter={(value, name) => [
              name === 'avgRating' ? `${value}/10` : value,
              name === 'avgRating' ? 'Average Rating' : 'Reports',
            ]}
          />
          <Bar dataKey="avgRating" fill="#1B59AE" name="Average Rating" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );

  const renderSideEffectsChart = () => (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={communityData.sideEffects} layout="horizontal">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" domain={[0, 20]} />
          <YAxis dataKey="effect" type="category" width={80} fontSize={12} />
          <Tooltip formatter={(value) => [`${value}%`, 'Reported by']} />
          <Bar dataKey="percentage" fill="#10B981" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );

  const renderAdherenceChart = () => (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={communityData.adherence}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timeframe" />
          <YAxis domain={[0, 100]} />
          <Tooltip formatter={(value) => [`${value}%`, 'Adherence Rate']} />
          <Line
            type="monotone"
            dataKey="percentage"
            stroke="#1B59AE"
            strokeWidth={3}
            dot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );

  const renderDemographicsChart = () => (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={communityData.demographics}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ ageRange, percentage }) => `${ageRange}: ${percentage}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="percentage"
          >
            {communityData.demographics?.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip formatter={(value) => [`${value}%`, 'of Community']} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );

  const tabs = [
    { id: 'effectiveness', label: 'Effectiveness', icon: '📊' },
    { id: 'sideEffects', label: 'Side Effects', icon: '⚠️' },
    { id: 'adherence', label: 'Adherence', icon: '📅' },
    { id: 'demographics', label: 'Demographics', icon: '👥' },
  ];

  const getTabContent = () => {
    switch (activeTab) {
      case 'effectiveness':
        return (
          <div>
            <h3 className="text-lg font-semibold mb-4">
              Medication Effectiveness Ratings
            </h3>
            <p className="text-gray-600 mb-4">
              Average effectiveness ratings from community members (1-10 scale)
            </p>
            {renderEffectivenessChart()}
            <div className="mt-4 text-sm text-gray-500">
              Based on{' '}
              {communityData.effectiveness?.reduce(
                (sum, item) => sum + item.reportCount,
                0,
              )}{' '}
              community reports
            </div>
          </div>
        );

      case 'sideEffects':
        return (
          <div>
            <h3 className="text-lg font-semibold mb-4">
              Most Common Side Effects
            </h3>
            <p className="text-gray-600 mb-4">
              Percentage of users reporting each side effect
            </p>
            {renderSideEffectsChart()}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              {communityData.sideEffects?.map((effect, index) => (
                <div key={effect.effect} className="bg-gray-50 p-3 rounded">
                  <div className="font-medium">{effect.effect}</div>
                  <div className="text-gray-600">
                    {effect.percentage}% report this
                  </div>
                  <div
                    className={`text-xs ${effect.severity === 'Mild' ? 'text-green-600' : 'text-orange-600'}`}
                  >
                    Usually {effect.severity.toLowerCase()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'adherence':
        return (
          <div>
            <h3 className="text-lg font-semibold mb-4">
              Medication Adherence Over Time
            </h3>
            <p className="text-gray-600 mb-4">
              Percentage of users consistently taking medications
            </p>
            {renderAdherenceChart()}
            <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-medium text-yellow-900 mb-2">
                💡 Adherence Insights
              </h4>
              <ul className="text-yellow-800 text-sm space-y-1">
                <li>• Most users maintain high adherence in the first month</li>
                <li>• Setting reminders improves long-term adherence by 23%</li>
                <li>
                  • Users who track side effects show better adherence patterns
                </li>
                <li>
                  • Community support groups improve 6-month adherence rates
                </li>
              </ul>
            </div>
          </div>
        );

      case 'demographics':
        return (
          <div>
            <h3 className="text-lg font-semibold mb-4">
              Community Demographics
            </h3>
            <p className="text-gray-600 mb-4">
              Age distribution of community members (anonymized)
            </p>
            {renderDemographicsChart()}
            <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              {communityData.demographics?.map((demo, index) => (
                <div key={demo.ageRange} className="text-center">
                  <div
                    className="text-lg font-bold"
                    style={{ color: COLORS[index % COLORS.length] }}
                  >
                    {demo.count.toLocaleString()}
                  </div>
                  <div className="text-gray-600">{demo.ageRange} years</div>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-[#1B59AE]">
                Community Trends
              </h2>
              <p className="text-gray-600 text-sm mt-1">
                Insights from anonymous community data
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'border-[#1B59AE] text-[#1B59AE]'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1B59AE] mx-auto mb-4"></div>
                <p className="text-gray-600">Loading community trends...</p>
              </div>
            </div>
          ) : (
            getTabContent()
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              🔒 All data is anonymized and aggregated from community members
            </div>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              <button className="px-4 py-2 bg-[#1B59AE] text-white rounded-lg hover:bg-[#48B4A2] transition-colors">
                Export Data
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
