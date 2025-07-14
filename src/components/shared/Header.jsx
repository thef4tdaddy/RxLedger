import logoIcon from '../../assets/branding/logo-512-tight-crop.png';
import { Link } from 'react-router-dom';
import { UserIcon } from '@heroicons/react/24/solid';
export default function Header() {
  return (
    <header
      className="flex items-center justify-between px-4 py-4 border-b shadow-sm"
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
        <nav className="hidden md:flex space-x-3 ml-auto">
          <Link
            to="/dashboard"
            className="px-3 py-2 rounded text-sm md:text-base font-semibold text-[#1B59AE] border-2 border-[#1B59AE] hover:bg-teal-500 hover:text-white transition"
          >
            Dashboard
          </Link>
          <Link
            to="/log"
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
          <Link to="/settings" className="text-sm text-gray-600 hover:text-gray-800">
            Settings
          </Link>
          <UserIcon className="w-8 h-8 text-gray-500" />
        </div>
      </div>
    </header>
  );
}
