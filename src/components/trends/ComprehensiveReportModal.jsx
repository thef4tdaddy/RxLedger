// components/trends/ComprehensiveReportModal.jsx - Detailed medical report modal
import { useState, useMemo } from 'react';
import { useMedications } from '../../context/useMedications';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const COLORS = [
  '#1B59AE',
  '#48B4A2',
  '#10B981',
  '#F59E0B',
  '#EC4899',
  '#8B5CF6',
  '#EF4444',
  '#06B6D4',
];

export default function ComprehensiveReportModal({
  isOpen,
  onClose,
  healthData,
  medicationLogs,
  timeRange,
}) {
  const { medications } = useMedications();
  const [selectedPeriod, setSelectedPeriod] = useState('all'); // day, week, month, all
  const [reportType, setReportType] = useState('overview'); // overview, detailed, medical

  // Filter data based on selected period
  const filteredData = useMemo(() => {
    if (!healthData || selectedPeriod === 'all') return healthData || [];

    const now = new Date();
    let startDate;

    switch (selectedPeriod) {
      case 'day':
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        return healthData;
    }

    return healthData.filter((entry) => new Date(entry.dateISO) >= startDate);
  }, [healthData, selectedPeriod]);

  // Medication adherence analysis
  const medicationAnalysis = useMemo(() => {
    if (!medications || !medicationLogs) return {};

    const analysis = {};

    medications.forEach((med) => {
      const medLogs = medicationLogs.filter(
        (log) =>
          log.medicationId === med.id ||
          log.medicationName === (med.commonName || med.medicalName),
      );

      const expectedDoses = Math.ceil(
        parseInt(timeRange) *
          (med.frequency?.includes('daily')
            ? 1
            : med.frequency?.includes('twice')
              ? 2
              : 1),
      );
      const actualDoses = medLogs.length;
      const adherenceRate =
        expectedDoses > 0 ? (actualDoses / expectedDoses) * 100 : 0;

      analysis[med.id] = {
        medication: med,
        expectedDoses,
        actualDoses,
        adherenceRate: Math.min(adherenceRate, 100),
        logs: medLogs,
        missedDoses: Math.max(expectedDoses - actualDoses, 0),
      };
    });

    return analysis;
  }, [medications, medicationLogs, timeRange]);

  // Health metrics summary
  const healthSummary = useMemo(() => {
    if (!filteredData || filteredData.length === 0) return null;

    const validMood = filteredData.filter((d) => d.mood != null);
    const validEnergy = filteredData.filter((d) => d.energy != null);
    const validSleep = filteredData.filter((d) => d.sleepHours != null);
    const validLibido = filteredData.filter((d) => d.libido != null);

    return {
      totalEntries: filteredData.length,
      mood: {
        avg:
          validMood.length > 0
            ? validMood.reduce((sum, d) => sum + d.mood, 0) / validMood.length
            : null,
        min:
          validMood.length > 0
            ? Math.min(...validMood.map((d) => d.mood))
            : null,
        max:
          validMood.length > 0
            ? Math.max(...validMood.map((d) => d.mood))
            : null,
        entries: validMood.length,
      },
      energy: {
        avg:
          validEnergy.length > 0
            ? validEnergy.reduce((sum, d) => sum + d.energy, 0) /
              validEnergy.length
            : null,
        min:
          validEnergy.length > 0
            ? Math.min(...validEnergy.map((d) => d.energy))
            : null,
        max:
          validEnergy.length > 0
            ? Math.max(...validEnergy.map((d) => d.energy))
            : null,
        entries: validEnergy.length,
      },
      sleep: {
        avg:
          validSleep.length > 0
            ? validSleep.reduce((sum, d) => sum + d.sleepHours, 0) /
              validSleep.length
            : null,
        min:
          validSleep.length > 0
            ? Math.min(...validSleep.map((d) => d.sleepHours))
            : null,
        max:
          validSleep.length > 0
            ? Math.max(...validSleep.map((d) => d.sleepHours))
            : null,
        entries: validSleep.length,
      },
      libido: {
        avg:
          validLibido.length > 0
            ? validLibido.reduce((sum, d) => sum + d.libido, 0) /
              validLibido.length
            : null,
        min:
          validLibido.length > 0
            ? Math.min(...validLibido.map((d) => d.libido))
            : null,
        max:
          validLibido.length > 0
            ? Math.max(...validLibido.map((d) => d.libido))
            : null,
        entries: validLibido.length,
      },
    };
  }, [filteredData]);

  // Side effects analysis
  const sideEffectsAnalysis = useMemo(() => {
    if (!filteredData) return {};

    const effects = {};
    filteredData.forEach((entry) => {
      if (entry.sideEffects && Array.isArray(entry.sideEffects)) {
        entry.sideEffects.forEach((effect) => {
          effects[effect] = (effects[effect] || 0) + 1;
        });
      }
    });

    return Object.entries(effects)
      .map(([effect, count]) => ({
        effect,
        count,
        percentage: (count / filteredData.length) * 100,
      }))
      .sort((a, b) => b.count - a.count);
  }, [filteredData]);

  // Generate comprehensive medical report
  const generateMedicalReport = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const reportDate = new Date().toLocaleDateString();
    const periodLabel =
      selectedPeriod === 'all' ? `${timeRange} days` : selectedPeriod;

    let report = `COMPREHENSIVE MEDICAL REPORT\n`;
    report += `=====================================\n\n`;
    report += `Patient Health Summary\n`;
    report += `Generated: ${reportDate}\n`;
    report += `Reporting Period: ${periodLabel}\n`;
    report += `Data Source: RxLedger Digital Health Tracker\n\n`;

    // Patient Information
    report += `PATIENT INFORMATION:\n`;
    report += `- User ID: ${user.uid?.slice(0, 8) || 'Anonymous'}\n`;
    report += `- Report Period: ${filteredData?.length || 0} days of data\n`;
    report += `- Total Health Entries: ${healthSummary?.totalEntries || 0}\n\n`;

    // Medication Adherence Section
    report += `MEDICATION ADHERENCE ANALYSIS:\n`;
    report += `=================================\n`;
    Object.values(medicationAnalysis).forEach((analysis) => {
      const med = analysis.medication;
      report += `\n${med.commonName || med.medicalName}:\n`;
      report += `  - Generic Name: ${med.medicalName || 'N/A'}\n`;
      report += `  - Strength: ${med.doseAmount || med.dosage || 'N/A'}\n`;
      report += `  - Frequency: ${med.frequency || 'N/A'}\n`;
      report += `  - Manufacturer: ${med.manufacturer || 'N/A'}\n`;
      report += `  - Pharmacy: ${med.pharmacy || 'N/A'}\n`;
      report += `  - Expected Doses: ${analysis.expectedDoses}\n`;
      report += `  - Actual Doses: ${analysis.actualDoses}\n`;
      report += `  - Adherence Rate: ${analysis.adherenceRate.toFixed(1)}%\n`;
      report += `  - Missed Doses: ${analysis.missedDoses}\n`;

      if (analysis.adherenceRate < 80) {
        report += `  ⚠️  CLINICAL CONCERN: Below 80% adherence threshold\n`;
      }
    });

    // Health Metrics Section
    if (healthSummary) {
      report += `\n\nHEALTH METRICS SUMMARY:\n`;
      report += `========================\n`;

      if (healthSummary.mood.entries > 0) {
        report += `\nMood Assessment (1-5 scale):\n`;
        report += `  - Average: ${healthSummary.mood.avg.toFixed(1)}/5\n`;
        report += `  - Range: ${healthSummary.mood.min} - ${healthSummary.mood.max}\n`;
        report += `  - Entries: ${healthSummary.mood.entries}\n`;
        if (healthSummary.mood.avg < 3) {
          report += `  ⚠️  CLINICAL CONCERN: Below average mood scores\n`;
        }
      }

      if (healthSummary.energy.entries > 0) {
        report += `\nEnergy Levels (1-5 scale):\n`;
        report += `  - Average: ${healthSummary.energy.avg.toFixed(1)}/5\n`;
        report += `  - Range: ${healthSummary.energy.min} - ${healthSummary.energy.max}\n`;
        report += `  - Entries: ${healthSummary.energy.entries}\n`;
        if (healthSummary.energy.avg < 3) {
          report += `  ⚠️  CLINICAL CONCERN: Low energy levels reported\n`;
        }
      }

      if (healthSummary.sleep.entries > 0) {
        report += `\nSleep Duration (hours):\n`;
        report += `  - Average: ${healthSummary.sleep.avg.toFixed(1)} hours\n`;
        report += `  - Range: ${healthSummary.sleep.min} - ${healthSummary.sleep.max} hours\n`;
        report += `  - Entries: ${healthSummary.sleep.entries}\n`;
        if (healthSummary.sleep.avg < 6 || healthSummary.sleep.avg > 9) {
          report += `  ⚠️  CLINICAL CONCERN: Sleep duration outside recommended range (6-9 hours)\n`;
        }
      }

      if (healthSummary.libido.entries > 0) {
        report += `\nSexual Health Assessment (1-10 scale):\n`;
        report += `  - Average: ${healthSummary.libido.avg.toFixed(1)}/10\n`;
        report += `  - Range: ${healthSummary.libido.min} - ${healthSummary.libido.max}\n`;
        report += `  - Entries: ${healthSummary.libido.entries}\n`;
        if (healthSummary.libido.avg < 4) {
          report += `  ⚠️  CLINICAL CONCERN: Below average sexual health scores\n`;
        }
      }
    }

    // Side Effects Section
    if (sideEffectsAnalysis.length > 0) {
      report += `\n\nSIDE EFFECTS ANALYSIS:\n`;
      report += `======================\n`;
      sideEffectsAnalysis.forEach((effect, index) => {
        report += `${index + 1}. ${effect.effect}: ${effect.count} occurrences (${effect.percentage.toFixed(1)}%)\n`;
      });

      const frequentEffects = sideEffectsAnalysis.filter(
        (e) => e.percentage > 20,
      );
      if (frequentEffects.length > 0) {
        report += `\n⚠️  FREQUENT SIDE EFFECTS (>20% of days):\n`;
        frequentEffects.forEach((effect) => {
          report += `   - ${effect.effect} (${effect.percentage.toFixed(1)}%)\n`;
        });
      }
    }

    // Clinical Recommendations
    report += `\n\nCLINICAL RECOMMENDATIONS:\n`;
    report += `==========================\n`;

    const lowAdherence = Object.values(medicationAnalysis).filter(
      (a) => a.adherenceRate < 80,
    );
    if (lowAdherence.length > 0) {
      report += `- Review medication adherence strategies for: ${lowAdherence.map((a) => a.medication.commonName || a.medication.medicalName).join(', ')}\n`;
    }

    if (healthSummary?.mood.avg < 3) {
      report += `- Consider mood assessment and potential intervention\n`;
    }

    if (healthSummary?.sleep.avg < 6 || healthSummary?.sleep.avg > 9) {
      report += `- Evaluate sleep hygiene and consider sleep study\n`;
    }

    if (sideEffectsAnalysis.some((e) => e.percentage > 30)) {
      report += `- Review high-frequency side effects and consider medication adjustments\n`;
    }

    report += `\nThis report is generated from patient self-reported data via RxLedger digital health platform.\n`;
    report += `Please correlate with clinical observations and laboratory findings.\n`;

    return report;
  };

  const downloadMedicalReport = () => {
    const report = generateMedicalReport();
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `medical-report-${selectedPeriod}-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-7xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-[#1B59AE]">
              Comprehensive Medical Report
            </h2>
            <p className="text-gray-600">
              Detailed health analysis and medication tracking
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
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

        {/* Controls */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex flex-wrap gap-4 items-center">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Time Period:
              </label>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-[#1B59AE] focus:border-transparent"
              >
                <option value="day">Last 24 Hours</option>
                <option value="week">Last Week</option>
                <option value="month">Last Month</option>
                <option value="all">All Time ({timeRange} days)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Report Type:
              </label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-[#1B59AE] focus:border-transparent"
              >
                <option value="overview">Overview</option>
                <option value="detailed">Detailed Analysis</option>
                <option value="medical">Medical Professional</option>
              </select>
            </div>

            <button
              onClick={downloadMedicalReport}
              className="px-4 py-2 bg-[#1B59AE] text-white rounded-lg font-medium hover:bg-[#48B4A2] transition-colors flex items-center gap-2"
            >
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
              Download Medical Report
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {/* Medication Adherence Overview */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Medication Adherence Overview
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Adherence Chart */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-700 mb-3">
                  Adherence Rates
                </h4>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart
                    data={Object.values(medicationAnalysis).map((a) => ({
                      name: (
                        a.medication.commonName || a.medication.medicalName
                      ).substring(0, 10),
                      adherence: a.adherenceRate,
                    }))}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                    <YAxis domain={[0, 100]} />
                    <Tooltip formatter={(value) => `${value.toFixed(1)}%`} />
                    <Bar dataKey="adherence" fill="#1B59AE" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Medication List */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-700 mb-3">
                  Medication Details
                </h4>
                <div className="space-y-3 max-h-48 overflow-y-auto">
                  {Object.values(medicationAnalysis).map((analysis, index) => (
                    <div key={index} className="bg-white p-3 rounded border">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-sm">
                            {analysis.medication.commonName ||
                              analysis.medication.medicalName}
                          </p>
                          <p className="text-xs text-gray-600">
                            {analysis.medication.doseAmount ||
                              analysis.medication.dosage}
                          </p>
                        </div>
                        <span
                          className={`text-xs px-2 py-1 rounded ${
                            analysis.adherenceRate >= 80
                              ? 'bg-green-100 text-green-800'
                              : analysis.adherenceRate >= 60
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {analysis.adherenceRate.toFixed(1)}%
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {analysis.actualDoses}/{analysis.expectedDoses} doses
                        taken
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Health Metrics Grid */}
          {healthSummary && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Health Metrics Summary
              </h3>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {healthSummary.mood.entries > 0 && (
                  <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <div className="text-2xl mb-2">😊</div>
                    <p className="text-sm font-medium text-gray-700">Mood</p>
                    <p className="text-lg font-bold text-blue-700">
                      {healthSummary.mood.avg.toFixed(1)}/5
                    </p>
                    <p className="text-xs text-gray-600">
                      {healthSummary.mood.entries} entries
                    </p>
                  </div>
                )}

                {healthSummary.energy.entries > 0 && (
                  <div className="bg-orange-50 p-4 rounded-lg text-center">
                    <div className="text-2xl mb-2">⚡</div>
                    <p className="text-sm font-medium text-gray-700">Energy</p>
                    <p className="text-lg font-bold text-orange-700">
                      {healthSummary.energy.avg.toFixed(1)}/5
                    </p>
                    <p className="text-xs text-gray-600">
                      {healthSummary.energy.entries} entries
                    </p>
                  </div>
                )}

                {healthSummary.sleep.entries > 0 && (
                  <div className="bg-green-50 p-4 rounded-lg text-center">
                    <div className="text-2xl mb-2">😴</div>
                    <p className="text-sm font-medium text-gray-700">Sleep</p>
                    <p className="text-lg font-bold text-green-700">
                      {healthSummary.sleep.avg.toFixed(1)}h
                    </p>
                    <p className="text-xs text-gray-600">
                      {healthSummary.sleep.entries} entries
                    </p>
                  </div>
                )}

                {healthSummary.libido.entries > 0 && (
                  <div className="bg-pink-50 p-4 rounded-lg text-center">
                    <div className="text-2xl mb-2">💖</div>
                    <p className="text-sm font-medium text-gray-700">
                      Sexual Health
                    </p>
                    <p className="text-lg font-bold text-pink-700">
                      {healthSummary.libido.avg.toFixed(1)}/10
                    </p>
                    <p className="text-xs text-gray-600">
                      {healthSummary.libido.entries} entries
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Side Effects Analysis */}
          {sideEffectsAnalysis.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Side Effects Analysis
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Side Effects Chart */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-700 mb-3">
                    Frequency Distribution
                  </h4>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={sideEffectsAnalysis.slice(0, 6)}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ effect, percentage }) =>
                          `${effect} (${percentage.toFixed(1)}%)`
                        }
                        outerRadius={60}
                        fill="#8884d8"
                        dataKey="count"
                      >
                        {sideEffectsAnalysis.slice(0, 6).map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Side Effects List */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-700 mb-3">
                    Detailed Breakdown
                  </h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {sideEffectsAnalysis.map((effect, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center bg-white p-2 rounded"
                      >
                        <span className="text-sm font-medium capitalize">
                          {effect.effect}
                        </span>
                        <div className="text-right">
                          <span className="text-sm font-bold">
                            {effect.count}
                          </span>
                          <span className="text-xs text-gray-600 ml-2">
                            ({effect.percentage.toFixed(1)}%)
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Trend Charts */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Health Trends Over Time
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Combined Health Chart */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-700 mb-3">
                  Overall Health Trends
                </h4>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={filteredData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="dateISO"
                      tickFormatter={(date) => {
                        if (!date) return '';
                        const parsedDate = new Date(date);
                        if (isNaN(parsedDate.getTime())) return String(date);
                        return parsedDate.toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                        });
                      }}
                      tick={{ fontSize: 10 }}
                    />
                    <YAxis />
                    <Tooltip
                      labelFormatter={(date) => {
                        if (!date) return 'No date';
                        const parsedDate = new Date(date);
                        if (isNaN(parsedDate.getTime())) return String(date);
                        return parsedDate.toLocaleDateString();
                      }}
                      formatter={(value, name) => [
                        `${value}${name === 'sleep' ? 'h' : name === 'libido' ? '/10' : '/5'}`,
                        name.charAt(0).toUpperCase() + name.slice(1),
                      ]}
                    />
                    <Line
                      type="monotone"
                      dataKey="mood"
                      stroke="#1B59AE"
                      strokeWidth={2}
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="energy"
                      stroke="#F59E0B"
                      strokeWidth={2}
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="sleepHours"
                      stroke="#10B981"
                      strokeWidth={2}
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="libido"
                      stroke="#EC4899"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Daily Variations */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-700 mb-3">
                  Daily Health Scores
                </h4>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {filteredData
                    .slice(-10)
                    .reverse()
                    .map((entry, index) => (
                      <div key={index} className="bg-white p-3 rounded border">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium text-sm">
                            {(() => {
                              if (!entry.dateISO) return 'No date';
                              const parsedDate = new Date(entry.dateISO);
                              return isNaN(parsedDate.getTime())
                                ? String(entry.dateISO)
                                : parsedDate.toLocaleDateString();
                            })()}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          {entry.mood && <div>Mood: {entry.mood}/5</div>}
                          {entry.energy && <div>Energy: {entry.energy}/5</div>}
                          {entry.sleepHours && (
                            <div>Sleep: {entry.sleepHours}h</div>
                          )}
                          {entry.libido && <div>Libido: {entry.libido}/10</div>}
                        </div>
                        {entry.sideEffects && entry.sideEffects.length > 0 && (
                          <div className="mt-2 text-xs text-red-600">
                            Side Effects: {entry.sideEffects.join(', ')}
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
