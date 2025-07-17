// components/shared/PrivacyPolicy.jsx - Enhanced
import { useEffect, useState } from 'react';
import { marked } from 'marked';

export default function PrivacyPolicy() {
  const [content, setContent] = useState('Loading...');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try to fetch from GitHub first, fallback to local content
    fetch(
      'https://raw.githubusercontent.com/thef4tdaddy/RxLedger/main/docs/Privacy.md',
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.text();
      })
      .then((markdown) => {
        setContent(marked.parse(markdown));
      })
      .catch((error) => {
        console.error('Error fetching Privacy Policy from GitHub:', error);
        // Fallback to enhanced privacy policy
        setContent(getEnhancedPrivacyPolicy());
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const getEnhancedPrivacyPolicy = () => {
    // This would contain the enhanced privacy policy content
    // For now, return a medical-focused version
    return marked.parse(`
# Privacy Policy

*Last updated: ${new Date().toLocaleDateString()}*

## 🔒 Medical Data Protection

**Your health information is protected with enterprise-grade encryption:**

- All medication data encrypted on your device before transmission
- Zero-knowledge architecture - we cannot read your medical information
- HIPAA-aligned practices for medical data protection
- Complete user control over data sharing

## Information We Collect

### Encrypted Medical Data:
- Medication names, dosages, and schedules (encrypted)
- Health tracking data (mood, energy, sleep) (encrypted)
- Side effects and personal notes (encrypted)

### Standard App Data:
- Email address and display name
- Device and usage analytics (anonymized)
- Technical logs for app functionality

## Community Features

- **Completely anonymous** medication experience sharing
- **No personal identifiers** in community data
- **You control** what gets shared through privacy settings

## Your Rights

- Export all your data at any time
- Delete your account and all associated data
- Control community sharing preferences
- Access and correct your information

## Medical Disclaimers

- This app is for tracking only, not medical advice
- Always consult your healthcare provider for medical decisions
- Do not stop or change medications without doctor approval

## Contact Us

**Email:** privacy@rxledger.app
**For medical emergencies:** Contact emergency services, not us.
    `);
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto pt-8 pb-16 px-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-4 bg-gray-200 rounded w-full"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto pt-8 pb-16 px-6">
      {/* Medical Warning Banner */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
        <div className="flex items-start gap-3">
          <div className="text-red-500 text-xl">⚕️</div>
          <div>
            <h3 className="font-semibold text-red-900 mb-1">
              Important Medical Disclaimer
            </h3>
            <p className="text-red-800 text-sm">
              RxLedger is for medication tracking only. Always consult your
              healthcare provider for medical advice. In emergencies, contact
              emergency services immediately.
            </p>
          </div>
        </div>
      </div>

      {/* Privacy Policy Content */}
      <section className="prose prose-lg max-w-none">
        <div
          className="[&_*]:text-gray-800 [&_h1]:text-[#1B59AE] [&_h2]:text-[#1B59AE] [&_h3]:text-[#1B59AE] [&_a]:text-[#10B981] [&_a:hover]:underline"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </section>

      {/* Last Updated Notice */}
      <div className="mt-8 p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <p className="text-sm text-gray-600">
          📅 This privacy policy was last updated on{' '}
          {new Date().toLocaleDateString()}. We&#39;ll notify you of any
          significant changes via email and in-app notifications.
        </p>
      </div>
    </div>
  );
}
