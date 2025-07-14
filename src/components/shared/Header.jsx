import logoIcon from '../../assets/branding/logo-512-tight-crop.png';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Bars3Icon, XMarkIcon, UserIcon } from '@heroicons/react/24/solid';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header
      className="relative flex items-center justify-between px-4 py-4 border-b shadow-sm"
      style={{ backgroundColor: '#A3B5AC' }}
    >
      <div className="flex items-center space-x-3">
        <img src={logoIcon} alt="RxLedger Logo" className="h-16 w-16" />
        <a
          href="https://rxledger.app"
          className="text-2xl font-semibold text-[#1B59AE]"
        >
          RxLedger
        </a>
      </div>
      <div className="flex items-center space-x-3 md:space-x-8">
        <button
          className="md:hidden p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <XMarkIcon className="w-6 h-6 text-[#1B59AE]" />
          ) : (
            <Bars3Icon className="w-6 h-6 text-[#1B59AE]" />
          )}
        </button>

        <nav className="hidden md:flex space-x-3 ml-auto">
          <Link
            to="/dashboard"
            className="px-3 py-2 rounded text-sm md:text-base font-semibold text-[#1B59AE] border-2 border-[#1B59AE] hover:bg-teal-500 hover:text-white transition"
          >
            Dashboard
          </Link>
          <Link
            to="/log-entry"
            className="px-3 py-2 rounded text-sm md:text-base font-semibold text-[#1B59AE] border-2 border-[#1B59AE] hover:bg-teal-500 hover:text-white transition"
          >
            Log Entry
          </Link>
          <Link
            to="/medications"
            className="px-3 py-2 rounded text-sm md:text-base font-semibold text-[#1B59AE] border-2 border-[#1B59AE] hover:bg-teal-500 hover:text-white transition"
          >
            My Medications
          </Link>
          <Link
            to="/trends"
            className="px-3 py-2 rounded text-sm md:text-base font-semibold text-[#1B59AE] border-2 border-[#1B59AE] hover:bg-teal-500 hover:text-white transition"
          >
            Trends
          </Link>
          <Link
            to="/community"
            className="px-3 py-2 rounded text-sm md:text-base font-semibold text-[#1B59AE] border-2 border-[#1B59AE] hover:bg-teal-500 hover:text-white transition"
          >
            Community
          </Link>
        </nav>
        <div className="flex items-center space-x-2">
          <button className="text-sm text-gray-600 hover:text-gray-800">
            Settings
          </button>
          <UserIcon className="w-8 h-8 text-gray-500" />
        </div>
      </div>
      {/* Mobile navigation */}
      <nav
        className={`md:hidden ${
          menuOpen ? 'flex' : 'hidden'
        } flex-col space-y-2 px-4 pb-4 bg-[#A3B5AC] border-b shadow-sm w-full absolute left-0 top-full`}
      >
        <Link
          to="/dashboard"
          onClick={() => setMenuOpen(false)}
          className="px-3 py-2 rounded text-sm font-semibold text-[#1B59AE] border-2 border-[#1B59AE] hover:bg-teal-500 hover:text-white transition"
        >
          Dashboard
        </Link>
        <Link
          to="/log-entry"
          onClick={() => setMenuOpen(false)}
          className="px-3 py-2 rounded text-sm font-semibold text-[#1B59AE] border-2 border-[#1B59AE] hover:bg-teal-500 hover:text-white transition"
        >
          Log Entry
        </Link>
        <Link
          to="/medications"
          onClick={() => setMenuOpen(false)}
          className="px-3 py-2 rounded text-sm font-semibold text-[#1B59AE] border-2 border-[#1B59AE] hover:bg-teal-500 hover:text-white transition"
        >
          My Medications
        </Link>
        <Link
          to="/trends"
          onClick={() => setMenuOpen(false)}
          className="px-3 py-2 rounded text-sm font-semibold text-[#1B59AE] border-2 border-[#1B59AE] hover:bg-teal-500 hover:text-white transition"
        >
          Trends
        </Link>
        <Link
          to="/community"
          onClick={() => setMenuOpen(false)}
          className="px-3 py-2 rounded text-sm font-semibold text-[#1B59AE] border-2 border-[#1B59AE] hover:bg-teal-500 hover:text-white transition"
        >
          Community
        </Link>
      </nav>
    </header>
  );
}
