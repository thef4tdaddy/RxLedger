import { useEffect, useState } from 'react';
/** TODO: Font Color: #1B59AE  */
export default function Footer() {
  const [version, setVersion] = useState('Loading...');

  useEffect(() => {
    fetch('https://api.github.com/repos/thef4tdaddy/RxLedger/releases/latest')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.tag_name) {
          setVersion(data.tag_name);
        } else {
          setVersion('Unknown');
        }
      })
      .catch(() => setVersion('Unknown'));
  }, []);

  return (
    <footer
      className="mt-auto py-4 text-center text-xs font-semibold text-[#1B59AE] border-t-2"
      style={{ backgroundColor: '#A3B5AC' }}
    >
      <p>© {new Date().getFullYear()} RxLedger. All rights reserved.</p>
      {/* TODO: Fetch version dynamically from GitHub releases */}
      <p className="mt-1">Version {version}</p>
      <div className="mt-2 space-x-4">
        <a href="/privacy" className="hover:underline">
          Privacy Policy
        </a>
        <a href="/terms" className="hover:underline">
          Terms of Service
        </a>
      </div>
    </footer>
  );
}
