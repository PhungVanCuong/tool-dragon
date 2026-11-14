import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  ShieldCheck,
  Zap,
  Menu,
  X,
  Sparkles,
  Swords,
  Egg,
  BookOpen,
  Tv,
  Scale,
  LogOut,
  LogIn,
  Home
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, onOpenConnectModal }) {
  const { isConnected, isDemo, session, disconnect } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Tổng quan', icon: Home },
    { id: 'resources', label: 'Tài nguyên & Đảo', icon: Zap },
    { id: 'heroic', label: 'Đua Rồng Heroic', icon: Sparkles },
    { id: 'arena', label: 'Đấu trường', icon: Swords },
    { id: 'breeding', label: 'Phối giống & Nuôi', icon: Egg },
    { id: 'dex', label: 'Bách khoa Rồng', icon: BookOpen },
    { id: 'dragontv', label: 'Dragon TV', icon: Tv },
    { id: 'comparison', label: 'So sánh Nền tảng', icon: Scale },
  ];

  return (
    <nav className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 text-white font-bold text-xl">
              🐉
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400 text-lg tracking-wide">
                  DRAGON CITY HUB
                </span>
                <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  FREE & NO ADS
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Nền tảng Quản lý & Hỗ trợ Game Dragon City
              </p>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shadow-sm shadow-cyan-500/10'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Right Action / Auth Status */}
          <div className="hidden sm:flex items-center space-x-3">
            {isConnected ? (
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-slate-800/90 border border-slate-700 text-xs">
                  <span className={`w-2 h-2 rounded-full animate-pulse ${isDemo ? 'bg-amber-400' : 'bg-emerald-400'}`} />
                  <span className="text-slate-300 font-mono">
                    {isDemo ? 'Chế độ Demo' : `UID: ${session?.userId}`}
                  </span>
                </div>
                <button
                  onClick={disconnect}
                  title="Thoát tài khoản"
                  className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenConnectModal}
                className="flex items-center space-x-2 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-medium text-xs shadow-md shadow-cyan-500/25 transition-all"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Kết nối Tài khoản</span>
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden items-center space-x-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-4 space-y-1">
          <div className="mb-3 pt-2">
            {isConnected ? (
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-800/80 border border-slate-700">
                <div className="flex items-center space-x-2 text-xs">
                  <span className={`w-2 h-2 rounded-full ${isDemo ? 'bg-amber-400' : 'bg-emerald-400'}`} />
                  <span className="text-slate-200 font-mono">
                    {isDemo ? 'Demo Mode' : `UID: ${session?.userId}`}
                  </span>
                </div>
                <button
                  onClick={() => {
                    disconnect();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center space-x-1 text-xs text-red-400 hover:text-red-300"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Thoát</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  onOpenConnectModal();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center space-x-2 py-2 rounded-lg bg-cyan-500 text-white font-medium text-xs shadow-md shadow-cyan-500/25"
              >
                <LogIn className="w-4 h-4" />
                <span>Kết nối Dragon City</span>
              </button>
            )}
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </nav>
  );
}
