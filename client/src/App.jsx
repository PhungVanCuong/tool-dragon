import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import AccountConnectModal from './components/AccountConnectModal';
import Dashboard from './components/Dashboard';
import ResourceHub from './components/ResourceHub';
import HeroicRaceTracker from './components/HeroicRaceTracker';
import ArenaTactics from './components/ArenaTactics';
import BreedingCalculator from './components/BreedingCalculator';
import DragonDex from './components/DragonDex';
import DragonTvRewards from './components/DragonTvRewards';
import FeatureListComparison from './components/FeatureListComparison';

function MainApp() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [connectModalOpen, setConnectModalOpen] = useState(false);
  const { isConnected, isDemo, session } = useAuth();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-black">
      {/* Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenConnectModal={() => setConnectModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'dashboard' && (
          <Dashboard
            setActiveTab={setActiveTab}
            onOpenConnectModal={() => setConnectModalOpen(true)}
          />
        )}
        {activeTab === 'resources' && (
          <ResourceHub onOpenConnectModal={() => setConnectModalOpen(true)} />
        )}
        {activeTab === 'heroic' && <HeroicRaceTracker />}
        {activeTab === 'arena' && (
          <ArenaTactics onOpenConnectModal={() => setConnectModalOpen(true)} />
        )}
        {activeTab === 'breeding' && <BreedingCalculator />}
        {activeTab === 'dex' && <DragonDex />}
        {activeTab === 'dragontv' && (
          <DragonTvRewards onOpenConnectModal={() => setConnectModalOpen(true)} />
        )}
        {activeTab === 'comparison' && <FeatureListComparison />}
      </main>

      {/* Account Connection Modal */}
      <AccountConnectModal
        isOpen={connectModalOpen}
        onClose={() => setConnectModalOpen(false)}
      />

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/80 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2 text-slate-400">
            <span className="text-base">🐉</span>
            <span className="font-extrabold text-slate-300">Dragon City Free Tool Hub</span>
            <span>•</span>
            <span className="text-emerald-400 font-semibold">100% Free & No Ads</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px]">
            <button onClick={() => setActiveTab('dashboard')} className="hover:text-slate-300">Tổng quan</button>
            <button onClick={() => setActiveTab('resources')} className="hover:text-slate-300">Tài nguyên</button>
            <button onClick={() => setActiveTab('heroic')} className="hover:text-slate-300">Heroic Race</button>
            <button onClick={() => setActiveTab('breeding')} className="hover:text-slate-300">Phối giống</button>
            <button onClick={() => setActiveTab('arena')} className="hover:text-slate-300">Đấu trường</button>
            <button onClick={() => setActiveTab('dex')} className="hover:text-slate-300">Dragon Dex</button>
            <button onClick={() => setActiveTab('comparison')} className="hover:text-slate-300">So sánh</button>
          </div>

          <p className="text-[10px] text-slate-600 text-center sm:text-right">
            Dự án cộng đồng độc lập phi lợi nhuận. Không liên kết với Social Point.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
