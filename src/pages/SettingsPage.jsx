import { Link } from 'react-router-dom';
import {
  demoAccountInfo,
  demoNotificationSettings,
  demoSharingSettings,
  demoIntegrationSettings,
} from '../demo-data/settings/SettingsData';

export default function SettingsPage() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Account Settings</h1>

      <section className="bg-white p-4 rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold mb-2">Profile</h2>
        <div className="flex items-center space-x-4">
          <div className="h-12 w-12 rounded-full bg-gray-300" />
          <div className="flex-1">
            <p className="font-medium">{demoAccountInfo.name}</p>
            <p className="text-sm text-gray-600">{demoAccountInfo.email}</p>
          </div>
          <button className="text-sm text-blue-600">Edit Profile</button>
        </div>
      </section>

      <section className="bg-white p-4 rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold mb-2">Notifications</h2>
        <ul className="space-y-2">
          {Object.entries(demoNotificationSettings).map(([key, value]) => (
            <li key={key} className="flex justify-between items-center">
              <span className="capitalize">
                {key.replace(/([A-Z])/g, ' $1')}
              </span>
              <span className="text-sm text-gray-600">
                {value ? 'On' : 'Off'}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-white p-4 rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold mb-2">Community Sharing</h2>
        <p className="flex justify-between items-center">
          <span>Share anonymized insights</span>
          <span className="text-sm text-gray-600">
            {demoSharingSettings.shareInsights ? 'On' : 'Off'}
          </span>
        </p>
      </section>

      <section className="bg-white p-4 rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold mb-2">Integrations</h2>
        <ul className="space-y-2">
          {Object.entries(demoIntegrationSettings).map(([key, value]) => (
            <li key={key} className="flex justify-between items-center">
              <span className="capitalize">
                {key.replace(/([A-Z])/g, ' $1')}
              </span>
              <span className="text-sm text-gray-600">
                {value ? 'Connected' : 'Not Connected'}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-white p-4 rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold mb-2 text-red-600">Danger Zone</h2>
        <button className="text-red-600 text-sm">Delete My Account</button>
      </section>

      <div className="flex justify-between items-center mt-8">
        <Link to="/admin" className="text-sm text-blue-600 underline">
          Admin
        </Link>
        <button className="text-sm text-gray-600">Logout</button>
      </div>
    </div>
  );
}
