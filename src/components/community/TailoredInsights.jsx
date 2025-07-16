// components/community/TailoredInsights.jsx
import { useState, useEffect, useMemo } from 'react';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '../../utils/firebase';
import { encryptionService } from '../../services/encryptionService';

export default function TailoredInsights({
  medications,
  selectedMedication,
  onMedicationSelect,
}) {
  const [communityData, setCommunityData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Generate medication hash for community lookup
  const selectedMedicationHash = useMemo(() => {
    if (!selectedMedication) return null;
    return encryptionService.createMedicationHash(
      selectedMedication.commonName || selectedMedication.medicalName,
      selectedMedication.doseAmount || selectedMedication.dosage,
    );
  }, [selectedMedication]);

  // Load community data for selected medication
  useEffect(() => {
    if (!selectedMedicationHash) return;

    const loadCommunityData = async () => {
      try {
        setLoading(true);

        // Query community shares for this medication
        const communityRef = collection(db, 'communityShares');
        const q = query(
          communityRef,
          where('medicationHash', '==', selectedMedicationHash),
          where('isVerified', '==', true),
          limit(50),
        );

        const snapshot = await getDocs(q);
        const shares = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setCommunityData(shares);
      } catch (error) {
        console.error('Error loading community data:', error);
        setCommunityData([]);
      } finally {
        setLoading(false);
      }
    };

    loadCommunityData();
  }, [selectedMedicationHash]);

  // Generate insights from community data
  const generateInsights = () => {
    if (!selectedMedication) return [];

    // If we have real community data, analyze it
    if (communityData.length > 0) {
      const insights = [];

      // Calculate average effectiveness
      const effectivenessRatings = communityData
        .filter((share) => share.effectivenessRating !== null)
        .map((share) => share.effectivenessRating);

      if (effectivenessRatings.length > 0) {
        const avgEffectiveness =
          effectivenessRatings.reduce((a, b) => a + b, 0) /
          effectivenessRatings.length;
        insights.push(
          `Community reports average effectiveness of ${avgEffectiveness.toFixed(1)}/10 for this medication`,
        );
      }

      // Analyze side effects
      const allSideEffects = communityData.flatMap(
        (share) => share.sideEffectsCategories || [],
      );

      if (allSideEffects.length > 0) {
        const sideEffectCounts = allSideEffects.reduce((acc, effect) => {
          acc[effect] = (acc[effect] || 0) + 1;
          return acc;
        }, {});

        const mostCommon = Object.entries(sideEffectCounts).sort(
          ([, a], [, b]) => b - a,
        )[0];

        if (mostCommon) {
          const percentage = Math.round(
            (mostCommon[1] / communityData.length) * 100,
          );
          insights.push(
            `${percentage}% of users report ${mostCommon[0]} as a side effect`,
          );
        }
      }

      // Analyze treatment duration
      const durations = communityData
        .map((share) => share.treatmentDuration)
        .filter(Boolean);

      if (durations.length > 0) {
        const longTermUsers = durations.filter(
          (d) => d.includes('1-year') || d.includes('more-than'),
        ).length;

        if (longTermUsers > 0) {
          const percentage = Math.round(
            (longTermUsers / durations.length) * 100,
          );
          insights.push(
            `${percentage}% of users have been taking this medication for over a year`,
          );
        }
      }

      return insights.length > 0
        ? insights
        : ['Limited community data available for this medication'];
    }

    // Fallback to demo insights based on medication name
    const medicationName = (
      selectedMedication.commonName ||
      selectedMedication.medicalName ||
      ''
    ).toLowerCase();

    const demoInsights = {
      lisinopril: [
        '89% of users report effective blood pressure control',
        'Most common side effect: dry cough (reported by 15% of users)',
        'Best taken in the morning to avoid nighttime bathroom trips',
        'Generic versions show equivalent effectiveness to brand name',
      ],
      metformin: [
        '92% of users see improved blood sugar control within 3 months',
        'Taking with food reduces stomach upset for 78% of users',
        'Extended-release version has fewer gastrointestinal side effects',
        'Most effective when combined with lifestyle changes',
      ],
      adderall: [
        '85% report improved focus and concentration',
        'Morning dosing prevents sleep disturbances for most users',
        'Appetite suppression is temporary for 70% of users',
        'Regular monitoring with healthcare provider is essential',
      ],
    };

    // Find matching insights or use generic ones
    for (const [key, insights] of Object.entries(demoInsights)) {
      if (medicationName.includes(key)) {
        return insights;
      }
    }

    return [
      'This medication shows positive outcomes for most users',
      'Regular monitoring and communication with your doctor is recommended',
      'Side effects typically decrease over time as your body adjusts',
      'Community members suggest taking with food if stomach upset occurs',
    ];
  };

  const insights = generateInsights();

  if (!medications || medications.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
        <h2 className="text-xl font-semibold text-[#1B59AE] mb-4 flex items-center gap-2">
          <span>🎯</span>
          Tailored Insights
        </h2>
        <div className="text-center py-8">
          <div className="text-4xl mb-4">💊</div>
          <p className="text-gray-500 mb-2">No medications to analyze</p>
          <p className="text-sm text-gray-400">
            Add medications to see personalized community insights
          </p>
          <a
            href="#/medications"
            className="inline-block mt-4 px-4 py-2 bg-[#1B59AE] text-white rounded-lg hover:bg-[#10B981] transition-colors"
          >
            Add Medications
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
      <h2 className="text-xl font-semibold text-[#1B59AE] mb-4 flex items-center gap-2">
        <span>🎯</span>
        Tailored Insights
      </h2>

      {/* Medication selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Medication for Insights:
        </label>
        <div className="flex flex-wrap gap-2">
          {medications.map((medication) => (
            <button
              key={medication.id}
              onClick={() => onMedicationSelect(medication)}
              className={`px-4 py-2 rounded-lg border font-medium transition-colors ${
                selectedMedication?.id === medication.id
                  ? 'bg-[#1B59AE] text-white border-[#1B59AE]'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-[#1B59AE] hover:text-[#1B59AE]'
              }`}
            >
              {medication.commonName || medication.medicalName}
            </button>
          ))}
        </div>
      </div>

      {/* Selected medication insights */}
      {selectedMedication && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Insights for{' '}
              {selectedMedication.commonName || selectedMedication.medicalName}
            </h3>
            <div className="flex items-center gap-2">
              {loading && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#1B59AE]"></div>
              )}
              {communityData.length === 0 && !loading && (
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  Demo Data
                </span>
              )}
              {communityData.length > 0 && (
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                  {communityData.length} Community Reports
                </span>
              )}
            </div>
          </div>

          <div className="space-y-3">
            {insights.map((insight, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border border-blue-200"
              >
                <div className="text-[#1B59AE] mt-1">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-gray-800 flex-1">{insight}</p>
              </div>
            ))}
          </div>

          {/* Medication details */}
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">
              Your Medication Details:
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Dosage:</span>
                <span className="ml-2 font-medium">
                  {selectedMedication.doseAmount ||
                    selectedMedication.dosage ||
                    'Not specified'}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Schedule:</span>
                <span className="ml-2 font-medium">
                  {selectedMedication.schedule ||
                    selectedMedication.frequency ||
                    'Not specified'}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Manufacturer:</span>
                <span className="ml-2 font-medium">
                  {selectedMedication.manufacturer || 'Not specified'}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Type:</span>
                <span className="ml-2 font-medium">
                  {selectedMedication.brandGeneric || 'Not specified'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
