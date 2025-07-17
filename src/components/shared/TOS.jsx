// components/shared/TermsOfService.jsx - Enhanced
import { useState, useEffect } from 'react';
import { marked } from 'marked';

export function TermsOfService() {
  const [content, setContent] = useState('Loading...');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(
      'https://raw.githubusercontent.com/thef4tdaddy/RxLedger/main/docs/TOS.md',
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
        console.error('Error fetching Terms of Service from GitHub:', error);
        setContent(getEnhancedTermsOfService());
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const getEnhancedTermsOfService = () => {
    return marked.parse(`
# Terms of Service

*Last updated: ${new Date().toLocaleDateString()}*

## ⚕️ Medical Disclaimers - CRITICAL

**RxLedger is NOT a medical device or healthcare provider:**

- This app provides tracking tools only - not medical advice
- Always consult your healthcare provider for medical decisions
- Never replace professional medical advice with app information
- Call emergency services (911) for medical emergencies

## Acceptable Use

### Permitted Uses:
- Personal medication tracking and management
- Recording health observations for personal use
- Anonymous community participation

### Prohibited Uses:
- Using app for medical diagnosis or treatment
- Sharing others' medical information
- Attempting to identify community users
- Reverse engineering security measures

## Data Ownership

- You own all your medical and personal data
- We store only encrypted versions we cannot read
- You control sharing through privacy settings
- Export or delete your data at any time

## Account Responsibilities

- Keep account credentials secure
- Provide accurate information
- Report security issues immediately
- Use real identity (no fake accounts)

## Service Availability

- Service provided "AS IS" and "AS AVAILABLE"
- Scheduled maintenance may cause outages
- We maintain backups but recommend personal backups

## Limitation of Liability

- Not liable for medical decisions made using the app
- Not responsible for medication adherence or health outcomes
- Maximum liability limited to fees paid (if any)

## Contact Information

**Support:** support@rxledger.app
**Legal:** legal@rxledger.app
**Medical Emergencies:** Call emergency services, NOT us

*These terms protect both users and RxLedger while enabling safe medication tracking.*
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
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
        <div className="flex items-start gap-3">
          <div className="text-yellow-600 text-xl">⚠️</div>
          <div>
            <h3 className="font-semibold text-yellow-900 mb-1">
              Medical App Terms
            </h3>
            <p className="text-yellow-800 text-sm">
              By using RxLedger, you acknowledge this is a tracking tool only.
              Always follow your healthcare provider&#39;s instructions for
              medications.
            </p>
          </div>
        </div>
      </div>

      {/* Terms Content */}
      <section className="prose prose-lg max-w-none">
        <div
          className="[&_*]:text-gray-800 [&_h1]:text-[#1B59AE] [&_h2]:text-[#1B59AE] [&_h3]:text-[#1B59AE] [&_a]:text-[#10B981] [&_a:hover]:underline"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </section>

      {/* Agreement Notice */}
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          ✅ By using RxLedger, you agree to these terms and our Privacy Policy.
          If you don&#39;t agree, please discontinue use of the service.
        </p>
      </div>
    </div>
  );
}
