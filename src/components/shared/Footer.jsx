import { useState, useEffect } from 'react';

export function Footer() {
  const [version, setVersion] = useState('Loading...');

  useEffect(() => {
    fetch('https://api.github.com/repos/thef4tdaddy/RxLedger/releases/latest')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.tag_name) {
          setVersion(data.tag_name);
        } else {
          setVersion('v1.0.0');
        }
      })
      .catch(() => setVersion('v1.0.0'));
  }, []);

  return (
    <footer
      className="mt-auto py-6 text-center text-xs font-semibold text-[#1B59AE] border-t-2"
      style={{ backgroundColor: '#A3B5AC' }}
    >
      <div className="max-w-6xl mx-auto px-4">
        <p className="mb-2">
          © {new Date().getFullYear()} RxLedger. All rights reserved.
        </p>
        <p className="mb-3">Version {version}</p>

        {/* Legal Links */}
        <div className="flex flex-wrap justify-center gap-6 mb-4">
          <a href="#/privacy" className="hover:underline transition-colors">
            Privacy Policy
          </a>
          <a href="#/terms" className="hover:underline transition-colors">
            Terms of Service
          </a>
          <a
            href="mailto:support@rxledger.app"
            className="hover:underline transition-colors"
          >
            Support
          </a>
          <a
            href="mailto:legal@rxledger.app"
            className="hover:underline transition-colors"
          >
            Legal
          </a>
        </div>

        {/* Medical Disclaimer */}
        <div className="bg-white/20 rounded-lg p-3 mb-4 text-xs">
          <p className="font-medium mb-1">⚕️ Medical Disclaimer</p>
          <p>
            RxLedger is for tracking purposes only. Not medical advice. Always
            consult your healthcare provider. Emergency? Call 911.
          </p>
        </div>

        {/* Certifications/Compliance */}
        <div className="flex flex-wrap justify-center gap-4 text-xs opacity-75">
          <span>🔒 End-to-End Encrypted</span>
          <span>🇪🇺 GDPR Compliant</span>
          <span>🏥 HIPAA Aligned</span>
          <span>🛡️ Zero Knowledge</span>
        </div>
      </div>
    </footer>
  );
}
