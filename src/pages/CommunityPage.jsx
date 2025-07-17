// Enhanced CommunityPage.jsx with integrated warning
import { useState, useEffect } from 'react';
import { useMedications } from '../context/useMedications';
import { CommunityHeader } from '../components/community/CommunityHeader';
import BroadInsights from '../components/community/BroadInsights';
import TailoredInsights from '../components/community/TailoredInsights';
import CommunityActions from '../components/community/CommunityActions';
import ShareProgressModal from '../components/community/ShareProgressModal';
import CommunityTrendsModal from '../components/community/CommunityTrendsModal';
import useAuth from '../hooks/useAuth';

export default function CommunityPage() {
  useAuth();
  const { medications, loading } = useMedications();
  const [selectedMedication, setSelectedMedication] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showTrendsModal, setShowTrendsModal] = useState(false);

  // Set initial medication selection when medications load
  useEffect(() => {
    if (medications && medications.length > 0 && !selectedMedication) {
      setSelectedMedication(medications[0]);
    }
  }, [medications, selectedMedication]);

  const handleMedicationSelect = (medication) => {
    setSelectedMedication(medication);
  };

  const handleShareProgress = () => {
    setShowShareModal(true);
  };

  const handleViewTrends = () => {
    setShowTrendsModal(true);
  };

  if (loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-96 mb-6"></div>
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white p-4 rounded-lg border border-gray-200"
              >
                <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <CommunityHeader />

      <BroadInsights />

      <TailoredInsights
        medications={medications}
        selectedMedication={selectedMedication}
        onMedicationSelect={handleMedicationSelect}
      />

      <CommunityActions
        onShareProgress={handleShareProgress}
        onViewTrends={handleViewTrends}
        hasMedications={medications && medications.length > 0}
      />

      {/* Modals */}
      {showShareModal && (
        <ShareProgressModal
          medications={medications}
          selectedMedication={selectedMedication}
          onClose={() => setShowShareModal(false)}
        />
      )}

      {showTrendsModal && (
        <CommunityTrendsModal
          medications={medications}
          onClose={() => setShowTrendsModal(false)}
        />
      )}
    </div>
  );
}
