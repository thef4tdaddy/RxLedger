// components/community/ShareProgressModal.jsx
import { useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db, createAnonymousShare } from '../../utils/firebase';
import useAuth from '../../hooks/useAuth';

export default function ShareProgressModal({
  medications,
  selectedMedication,
  onClose,
}) {
  const { user } = useAuth();
  const [selectedMed, setSelectedMed] = useState(
    selectedMedication || medications?.[0],
  );
  const [formData, setFormData] = useState({
    effectivenessRating: '',
    treatmentDuration: '',
    generalSatisfaction: '',
    wouldRecommend: false,
    qualityOfLife: '',
    sideEffects: [],
    shareAgeRange: true,
    shareCondition: false,
  });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const sideEffectOptions = [
    { value: 'headache', label: 'Headache' },
    { value: 'nausea', label: 'Nausea' },
    { value: 'dizziness', label: 'Dizziness' },
    { value: 'fatigue', label: 'Fatigue' },
    { value: 'drowsiness', label: 'Drowsiness' },
    { value: 'stomach_upset', label: 'Stomach Upset' },
    { value: 'dry_mouth', label: 'Dry Mouth' },
    { value: 'insomnia', label: 'Insomnia' },
  ];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSideEffectToggle = (effect) => {
    setFormData((prev) => ({
      ...prev,
      sideEffects: prev.sideEffects.includes(effect)
        ? prev.sideEffects.filter((e) => e !== effect)
        : [...prev.sideEffects, effect],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedMed || !user?.uid) return;

    setSaving(true);
    setError('');

    try {
      // Get user profile for demographics
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      const userProfile = userSnap.exists() ? userSnap.data() : {};

      // Prepare medication data
      const medicationData = {
        name: selectedMed.commonName || selectedMed.medicalName,
        dosage: selectedMed.doseAmount || selectedMed.dosage,
      };

      // Prepare experience data
      const experienceData = {
        effectivenessRating: parseInt(formData.effectivenessRating),
        duration: calculateDurationDays(formData.treatmentDuration),
        generalSatisfaction: parseInt(formData.generalSatisfaction),
        wouldRecommend: formData.wouldRecommend,
        qualityOfLife: parseInt(formData.qualityOfLife),
        sideEffects: formData.sideEffects,
        condition: 'not-specified', // User can choose not to share
      };

      // Prepare demographics (anonymized)
      const demographics = {
        birthYear: userProfile.profile?.age
          ? new Date().getFullYear() - userProfile.profile.age
          : null,
        gender: 'not-specified', // User can choose not to share
        location: 'not-specified',
      };

      // Call Firebase Cloud Function to create anonymous share
      const result = await createAnonymousShare({
        medicationData,
        experienceData,
        demographics,
        shareSettings: {
          shareAgeRange: formData.shareAgeRange,
          shareCondition: formData.shareCondition,
        },
      });

      if (result.data?.success) {
        setSuccess(true);
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        throw new Error('Failed to share progress');
      }
    } catch (err) {
      console.error('Error sharing progress:', err);
      setError('Failed to share your progress. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const calculateDurationDays = (duration) => {
    const durationMap = {
      'less-than-1-month': 15,
      '1-3-months': 60,
      '3-6-months': 135,
      '6-12-months': 270,
      'more-than-1-year': 400,
    };
    return durationMap[duration] || 30;
  };

  if (success) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg p-6 max-w-md w-full">
          <div className="text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-xl font-semibold text-green-600 mb-2">
              Thank You for Sharing!
            </h3>
            <p className="text-gray-600 mb-4">
              Your anonymous experience will help others in the community make
              informed decisions about their health.
            </p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-green-800 text-sm">
                🔒 Your identity remains completely anonymous. Only aggregated
                insights will be shared with the community.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-[#1B59AE]">
              Share Your Progress
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>
          <p className="text-gray-600 text-sm mt-2">
            Help others by sharing your anonymous medication experience
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Medication Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Medication
            </label>
            <select
              value={selectedMed?.id || ''}
              onChange={(e) => {
                const med = medications.find((m) => m.id === e.target.value);
                setSelectedMed(med);
              }}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B59AE] focus:border-transparent"
              required
            >
              {medications?.map((med) => (
                <option key={med.id} value={med.id}>
                  {med.commonName || med.medicalName} -{' '}
                  {med.doseAmount || med.dosage}
                </option>
              ))}
            </select>
          </div>

          {/* Effectiveness Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              How effective has this medication been? (1-10)
            </label>
            <select
              value={formData.effectivenessRating}
              onChange={(e) =>
                handleInputChange('effectivenessRating', e.target.value)
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B59AE] focus:border-transparent"
              required
            >
              <option value="">Select rating...</option>
              {[...Array(10)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1} -{' '}
                  {i + 1 <= 3
                    ? 'Not effective'
                    : i + 1 <= 6
                      ? 'Somewhat effective'
                      : 'Very effective'}
                </option>
              ))}
            </select>
          </div>

          {/* Treatment Duration */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              How long have you been taking this medication?
            </label>
            <select
              value={formData.treatmentDuration}
              onChange={(e) =>
                handleInputChange('treatmentDuration', e.target.value)
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B59AE] focus:border-transparent"
              required
            >
              <option value="">Select duration...</option>
              <option value="less-than-1-month">Less than 1 month</option>
              <option value="1-3-months">1-3 months</option>
              <option value="3-6-months">3-6 months</option>
              <option value="6-12-months">6-12 months</option>
              <option value="more-than-1-year">More than 1 year</option>
            </select>
          </div>

          {/* Side Effects */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Have you experienced any side effects?
            </label>
            <div className="grid grid-cols-2 gap-2">
              {sideEffectOptions.map((effect) => (
                <label key={effect.value} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.sideEffects.includes(effect.value)}
                    onChange={() => handleSideEffectToggle(effect.value)}
                    className="rounded border-gray-300 text-[#1B59AE] focus:ring-[#1B59AE]"
                  />
                  <span className="ml-2 text-sm">{effect.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* General Satisfaction */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Overall satisfaction (1-10)
            </label>
            <select
              value={formData.generalSatisfaction}
              onChange={(e) =>
                handleInputChange('generalSatisfaction', e.target.value)
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B59AE] focus:border-transparent"
              required
            >
              <option value="">Select rating...</option>
              {[...Array(10)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
          </div>

          {/* Would Recommend */}
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.wouldRecommend}
                onChange={(e) =>
                  handleInputChange('wouldRecommend', e.target.checked)
                }
                className="rounded border-gray-300 text-[#1B59AE] focus:ring-[#1B59AE]"
              />
              <span className="ml-2 text-sm font-medium text-gray-700">
                I would recommend this medication to others with similar
                conditions
              </span>
            </label>
          </div>

          {/* Privacy Settings */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-medium text-blue-900 mb-3">Privacy Settings</h3>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.shareAgeRange}
                  onChange={(e) =>
                    handleInputChange('shareAgeRange', e.target.checked)
                  }
                  className="rounded border-gray-300 text-[#1B59AE] focus:ring-[#1B59AE]"
                />
                <span className="ml-2 text-sm text-blue-800">
                  Share my age range (e.g., "25-35") - helps others find
                  relevant experiences
                </span>
              </label>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-4 py-3 bg-[#10B981] text-white rounded-lg hover:bg-[#0EA5E9] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Sharing...' : 'Share Anonymously'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
