import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import GameLauncherModal from './components/GameLauncherModal';
import AccountConnectModal from './components/AccountConnectModal';

import Dashboard from './components/Dashboard';
import AccountProfile from './components/AccountProfile';
import DragonCollection from './components/DragonCollection';
import DragonDex from './components/DragonDex';
import IslandManager from './components/IslandManager';
import ResourceHub from './components/ResourceHub';
import ArenaTactics from './components/ArenaTactics';
import HeroicRaceTracker from './components/HeroicRaceTracker';
import BreedingCalculator from './components/BreedingCalculator';
import SyncCenter from './components/SyncCenter';
import ActivityHistory from './components/ActivityHistory';
import SettingsView from './components/SettingsView';
import DragonTvRewards from './components/DragonTvRewards';
import FeatureListComparison from './components/FeatureListComparison';

function MainApp() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [connectModalOpen, setConnectModalOpen] = useState(false);
  const [launcherModalOpen, setLauncherModalOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [quickSyncNotification, setQuickSyncNotification] = useState(null);

  const { isConnected, refreshProfile } = useAuth();

  const handleQuickSync = async () => {
    try {
      await refreshProfile();
      setQuickSyncNotification('Đã đồng bộ nhanh thành công!');
      setTimeout(() => setQuickSyncNotification(null), 3000);
    } catch {
      setQuickSyncNotification('Đồng bộ thất bại');
      setTimeout(() => setQuickSyncNotification(null), 3000);
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'} font-sans flex`}>
      {/* Desktop Collapsible Sidebar */}
      <div className="hidden lg:block">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isCollapsed={isSidebarCollapsed}
          setIsCollapsed={setIsSidebarCollapsed}
          onOpenConnectModal={() => setConnectModalOpen(true)}
          onOpenLauncherModal={() => setLauncherModalOpen(true)}
        />
      </div>

      {/* Mobile Drawer Sidebar */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="relative z-10 w-72 max-w-xs h-full">
            <Sidebar
              activeTab={activeTab}
              setActiveTab={(tab) => {
                setActiveTab(tab);
                setMobileSidebarOpen(false);
              }}
              isCollapsed={false}
              setIsCollapsed={() => setMobileSidebarOpen(false)}
              onOpenConnectModal={() => {
                setMobileSidebarOpen(false);
                setConnectModalOpen(true);
              }}
              onOpenLauncherModal={() => {
                setMobileSidebarOpen(false);
                setLauncherModalOpen(true);
              }}
            />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 min-w-0 ${
          isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'
        }`}
      >
        {/* Top Header */}
        <Header
          activeTab={activeTab}
          onOpenConnectModal={() => setConnectModalOpen(true)}
          onOpenLauncherModal={() => setLauncherModalOpen(true)}
          isCollapsed={isSidebarCollapsed}
          onToggleMobileSidebar={() => setMobileSidebarOpen(true)}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          onQuickSync={handleQuickSync}
        />

        {/* Quick Sync Toast */}
        {quickSyncNotification && (
          <div className="fixed top-20 right-6 z-50 px-4 py-2 bg-emerald-500 text-slate-950 font-bold rounded-xl shadow-lg text-xs animate-bounce">
            {quickSyncNotification}
          </div>
        )}

        {/* Body Pages */}
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
          {activeTab === 'dashboard' && (
            <Dashboard
              setActiveTab={setActiveTab}
              onOpenConnectModal={() => setConnectModalOpen(true)}
              onOpenLauncherModal={() => setLauncherModalOpen(true)}
            />
          )}

          {activeTab === 'account' && (
            <AccountProfile
              onOpenConnectModal={() => setConnectModalOpen(true)}
              onOpenLauncherModal={() => setLauncherModalOpen(true)}
            />
          )}

          {activeTab === 'collection' && (
            <DragonCollection onOpenConnectModal={() => setConnectModalOpen(true)} />
          )}

          {activeTab === 'database' && <DragonDex />}

          {activeTab === 'islands' && (
            <IslandManager onOpenConnectModal={() => setConnectModalOpen(true)} />
          )}

          {activeTab === 'resources' && (
            <ResourceHub onOpenConnectModal={() => setConnectModalOpen(true)} />
          )}

          {activeTab === 'statistics' && (
            <ArenaTactics onOpenConnectModal={() => setConnectModalOpen(true)} />
          )}

          {activeTab === 'heroic' && <HeroicRaceTracker />}

          {activeTab === 'breeding' && <BreedingCalculator />}

          {activeTab === 'dragontv' && (
            <DragonTvRewards onOpenConnectModal={() => setConnectModalOpen(true)} />
          )}

          {activeTab === 'sync' && (
            <SyncCenter onOpenConnectModal={() => setConnectModalOpen(true)} />
          )}

          {activeTab === 'history' && <ActivityHistory />}

          {activeTab === 'settings' && (
            <SettingsView darkMode={darkMode} setDarkMode={setDarkMode} />
          )}

          {activeTab === 'comparison' && <FeatureListComparison />}
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-800/80 bg-slate-950/80 py-6 px-4 sm:px-8 text-xs text-slate-500">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-2 text-slate-400">
              <span className="text-base">🐉</span>
              <span className="font-extrabold text-slate-300">Dragon City Companion Platform</span>
              <span>•</span>
              <span className="text-emerald-400 font-semibold">100% Free & No Ads</span>
            </div>

            <p className="text-[11px] text-slate-500 text-center sm:text-right">
              Phiên bản độc lập phục vụ cộng đồng người chơi. Không can thiệp mã độc quyền hoặc vi phạm API.
            </p>
          </div>
        </footer>
      </div>

      {/* Account Connect Modal */}
      <AccountConnectModal
        isOpen={connectModalOpen}
        onClose={() => setConnectModalOpen(false)}
      />

      {/* Game Launcher Modal */}
      <GameLauncherModal
        isOpen={launcherModalOpen}
        onClose={() => setLauncherModalOpen(false)}
      />
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
