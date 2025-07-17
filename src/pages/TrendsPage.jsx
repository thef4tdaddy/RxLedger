// pages/TrendsPage.jsx - Enhanced with Firebase integration and real data
import { useState, useEffect } from 'react';
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
} from 'firebase/firestore';
import { db } from '../utils/firebase';
import { encryptionService } from '../services/encryptionService';
import { useMedications } from '../context/useMedications';
import useAuth from '../hooks/useAuth';
import MoodTrendChart from '../components/trends/MoodTrendChart';
import SleepTrendChart from '../components/trends/SleepTrendChart';
import EnergyTrendChart from '../components/trends/EnergyTrendChart';
import LibidoTrendChart from '../components/trends/LibidoTrendChart';
import MedsTakenTimeChart from '../components/trends/MedsTakenTimeChart';
import SideEffectsHeatmap from '../components/trends/SideEffectsHeatmap';
import ComprehensiveReportModal from '../components/trends/ComprehensiveReportModal';

export default function TrendsPage() {
  const { user } = useAuth();
  const { medications } = useMedications();
  const [timeRange, setTimeRange] = useState('7'); // days
  const [trendsData, setTrendsData] = useState({
    healthStats: [],
    medicationLogs: [],
    loading: true,
    error: null,
  });
  const [exporting, setExporting] = useState(false);
  const [showComprehensiveReport, setShowComprehensiveReport] = useState(false);

  // Load trends data from Firebase
  useEffect(() => {
    if (!user?.uid) return;

    const loadTrendsData = async () => {
      try {
        setTrendsData((prev) => ({ ...prev, loading: true, error: null }));

        const days = parseInt(timeRange);
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        const startDateStr = startDate.toISOString().split('T')[0];

        const userKey = encryptionService.generateUserKey(
          user.uid,
          user.email || 'bypass@example.com',
        );

        // Load health stats
        const healthStatsRef = collection(db, 'users', user.uid, 'healthStats');
        const healthQuery = query(
          healthStatsRef,
          where('__name__', '>=', startDateStr),
          orderBy('__name__', 'asc'),
          limit(days),
        );

        // Load medication logs
        const medicationLogsRef = collection(
          db,
          'users',
          user.uid,
          'medicationLogs',
        );
        const logsQuery = query(
          medicationLogsRef,
          where('timestamp', '>=', startDate),
          orderBy('timestamp', 'asc'),
          limit(days * 10), // Assume max 10 logs per day
        );

        const [healthSnapshot, logsSnapshot] = await Promise.all([
          getDocs(healthQuery),
          getDocs(logsQuery),
        ]);

        // Process health stats
        const healthStats = [];
        healthSnapshot.docs.forEach((doc) => {
          try {
            const data = doc.data();
            let stats = {};

            if (data.encryptedData) {
              stats = encryptionService.decryptMedicalData(
                data.encryptedData,
                userKey,
              );
            } else {
              stats = {
                mood: data.mood || null,
                energy: data.energy || null,
                sleepHours: data.sleepHours || null,
                sideEffects: data.sideEffects || [],
              };
            }

            healthStats.push({
              date: doc.id, // Document ID is the date (YYYY-MM-DD)
              dateISO: doc.id,
              ...stats,
            });
          } catch (error) {
            console.error('Error decrypting health stat:', error);
          }
        });

        // Process medication logs
        const medicationLogs = [];
        logsSnapshot.docs.forEach((doc) => {
          try {
            const data = doc.data();
            let logData = {};

            if (data.encryptedData) {
              logData = encryptionService.decryptMedicalData(
                data.encryptedData,
                userKey,
              );
            } else {
              logData = data;
            }

            medicationLogs.push({
              id: doc.id,
              ...logData,
              timestamp: data.timestamp?.toDate() || new Date(),
            });
          } catch (error) {
            console.error('Error decrypting medication log:', error);
          }
        });

        setTrendsData({
          healthStats: healthStats.sort((a, b) => a.date.localeCompare(b.date)),
          medicationLogs: medicationLogs.sort(
            (a, b) => a.timestamp - b.timestamp,
          ),
          loading: false,
          error: null,
        });
      } catch (error) {
        console.error('Error loading trends data:', error);
        setTrendsData((prev) => ({
          ...prev,
          loading: false,
          error: 'Failed to load trends data. Please try again.',
        }));
      }
    };

    loadTrendsData();
  }, [user?.uid, user?.email, timeRange]);

  // Export data functionality
  const handleExportData = async () => {
    try {
      setExporting(true);

      // Prepare export data
      const exportData = {
        user: {
          id: user.uid,
          email: user.email,
          exportDate: new Date().toISOString(),
        },
        timeRange: `${timeRange} days`,
        medications:
          medications?.map((med) => ({
            name: med.commonName || med.medicalName,
            dosage: med.doseAmount || med.dosage,
            frequency: med.frequency,
            startDate: med.startDate,
          })) || [],
        healthStats: trendsData.healthStats,
        medicationLogs: trendsData.medicationLogs.map((log) => ({
          medicationName: log.medicationName,
          dosage: log.dosage,
          takenAt: log.timestamp.toISOString(),
          notes: log.notes,
        })),
        summary: {
          totalHealthEntries: trendsData.healthStats.length,
          totalMedicationLogs: trendsData.medicationLogs.length,
          avgMood:
            trendsData.healthStats.length > 0
              ? trendsData.healthStats
                  .filter((stat) => stat.mood !== null)
                  .reduce((sum, stat) => sum + stat.mood, 0) /
                trendsData.healthStats.filter((stat) => stat.mood !== null)
                  .length
              : null,
          avgSleep:
            trendsData.healthStats.length > 0
              ? trendsData.healthStats
                  .filter((stat) => stat.sleepHours !== null)
                  .reduce((sum, stat) => sum + stat.sleepHours, 0) /
                trendsData.healthStats.filter(
                  (stat) => stat.sleepHours !== null,
                ).length
              : null,
        },
      };

      // Download as JSON file
      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `rxledger-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting data:', error);
      alert('Failed to export data. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  // Generate full report
  const handleGenerateReport = () => {
    const { healthStats, medicationLogs } = trendsData;

    if (healthStats.length === 0 && medicationLogs.length === 0) {
      alert(
        'No data available for the selected time period. Start logging your health stats and medications to generate a report.',
      );
      return;
    }

    // Create a simple text report
    let report = `RxLedger Health Report - ${timeRange} Days\n`;
    report += `Generated: ${new Date().toLocaleString()}\n\n`;

    // Health summary
    if (healthStats.length > 0) {
      const avgMood =
        healthStats
          .filter((stat) => stat.mood !== null)
          .reduce((sum, stat) => sum + stat.mood, 0) /
        healthStats.filter((stat) => stat.mood !== null).length;

      const avgSleep =
        healthStats
          .filter((stat) => stat.sleepHours !== null)
          .reduce((sum, stat) => sum + stat.sleepHours, 0) /
        healthStats.filter((stat) => stat.sleepHours !== null).length;

      const avgEnergy =
        healthStats
          .filter((stat) => stat.energy !== null)
          .reduce((sum, stat) => sum + stat.energy, 0) /
        healthStats.filter((stat) => stat.energy !== null).length;

      const avgLibido =
        healthStats
          .filter((stat) => stat.libido !== null)
          .reduce((sum, stat) => sum + stat.libido, 0) /
        healthStats.filter((stat) => stat.libido !== null).length;

      report += `HEALTH SUMMARY:\n`;
      report += `- Health entries: ${healthStats.length}\n`;
      if (!isNaN(avgMood))
        report += `- Average mood: ${avgMood.toFixed(1)}/5\n`;
      if (!isNaN(avgSleep))
        report += `- Average sleep: ${avgSleep.toFixed(1)} hours\n`;
      if (!isNaN(avgEnergy))
        report += `- Average energy: ${avgEnergy.toFixed(1)}/5\n`;
      if (!isNaN(avgLibido))
        report += `- Average sexual health: ${avgLibido.toFixed(1)}/10\n\n`;
    }

    // Medication summary
    if (medicationLogs.length > 0) {
      report += `MEDICATION SUMMARY:\n`;
      report += `- Total doses logged: ${medicationLogs.length}\n`;

      const medicationCounts = {};
      medicationLogs.forEach((log) => {
        medicationCounts[log.medicationName] =
          (medicationCounts[log.medicationName] || 0) + 1;
      });

      report += `- Medications taken:\n`;
      Object.entries(medicationCounts).forEach(([name, count]) => {
        report += `  • ${name}: ${count} doses\n`;
      });
    }

    // Download report
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `rxledger-report-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (trendsData.loading) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-32 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white p-4 rounded-lg border border-gray-200"
              >
                <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
                <div className="h-56 bg-gray-100 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#1B59AE] mb-2">
            Health Trends
          </h1>
          <p className="text-gray-600">
            Visualize your health patterns and medication adherence over time
          </p>
        </div>
        <button
          onClick={handleExportData}
          disabled={exporting}
          className="px-4 py-2 bg-[#1B59AE] text-white rounded-lg font-medium hover:bg-[#48B4A2] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {exporting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              Exporting...
            </>
          ) : (
            <>
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
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Export Data
            </>
          )}
        </button>
      </div>

      {/* Time Range Selector */}
      <div className="mb-6 flex items-center gap-4">
        <label className="font-medium text-gray-700">Time Range:</label>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-[#1B59AE] focus:border-transparent"
        >
          <option value="7">Last 7 Days</option>
          <option value="14">Last 2 Weeks</option>
          <option value="30">Last Month</option>
          <option value="90">Last 3 Months</option>
        </select>
      </div>

      {/* Error State */}
      {trendsData.error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-red-700 font-medium">Error Loading Data</span>
          </div>
          <p className="text-red-600 mt-1">{trendsData.error}</p>
        </div>
      )}

      {/* No Data State */}
      {!trendsData.error &&
        trendsData.healthStats.length === 0 &&
        trendsData.medicationLogs.length === 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center mb-6">
            <div className="text-blue-500 text-4xl mb-4">📊</div>
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              No Data Available
            </h3>
            <p className="text-blue-700 mb-4">
              Start logging your health stats and medications to see trends
              here.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="#/log"
                className="px-4 py-2 bg-[#1B59AE] text-white rounded-lg font-medium hover:bg-[#48B4A2] transition-colors"
              >
                Log Health Stats
              </a>
              <a
                href="#/medications"
                className="px-4 py-2 border border-[#1B59AE] text-[#1B59AE] rounded-lg font-medium hover:bg-[#1B59AE] hover:text-white transition-colors"
              >
                Manage Medications
              </a>
            </div>
          </div>
        )}

      {/* Charts Grid */}
      {(trendsData.healthStats.length > 0 ||
        trendsData.medicationLogs.length > 0) && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <MoodTrendChart
              data={trendsData.healthStats}
              loading={trendsData.loading}
            />
            <SleepTrendChart
              data={trendsData.healthStats}
              loading={trendsData.loading}
            />
            <EnergyTrendChart
              data={trendsData.healthStats}
              loading={trendsData.loading}
            />
            <LibidoTrendChart
              data={trendsData.healthStats}
              loading={trendsData.loading}
            />
            <MedsTakenTimeChart
              data={trendsData.medicationLogs}
              loading={trendsData.loading}
            />
            <div className="md:col-span-1">
              <SideEffectsHeatmap
                data={trendsData.healthStats}
                loading={trendsData.loading}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setShowComprehensiveReport(true)}
              className="px-6 py-3 bg-[#1B59AE] text-white rounded-lg font-medium hover:bg-[#48B4A2] transition-colors flex items-center gap-2 justify-center"
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
                  d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a4 4 0 01-4-4V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Comprehensive Medical Report
            </button>

            <button
              onClick={handleGenerateReport}
              className="px-6 py-3 bg-[#10B981] text-white rounded-lg font-medium hover:bg-[#0EA5E9] transition-colors flex items-center gap-2 justify-center"
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
                  d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a4 4 0 01-4-4V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Quick Summary Report
            </button>
          </div>
        </>
      )}

      {/* Comprehensive Report Modal */}
      <ComprehensiveReportModal
        isOpen={showComprehensiveReport}
        onClose={() => setShowComprehensiveReport(false)}
        healthData={trendsData.healthStats}
        medicationLogs={trendsData.medicationLogs}
        timeRange={timeRange}
      />
    </div>
  );
}
