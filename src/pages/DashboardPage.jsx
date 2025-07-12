import React from 'react';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import StatsRow from '../components/dashboard/StatsRow';
import ManufacturerChart from '../components/dashboard/ManufacturerChart';
import MoodEnergyChart from '../components/dashboard/MoodEnergyChart';
import SideEffectsChart from '../components/dashboard/SideEffectsChart';
import QuickLogEntry from '../components/dashboard/QuickLogEntry';
import RecentActivity from '../components/dashboard/RecentActivity';

export default function EnhancedDashboard() {
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <DashboardHeader />

      <StatsRow />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <ManufacturerChart />
        <MoodEnergyChart />
      </div>

      <SideEffectsChart />

      <QuickLogEntry />

      <RecentActivity />
    </div>
  );
}
