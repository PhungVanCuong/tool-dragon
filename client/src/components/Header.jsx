import React from 'react';
import {
  Play,
  Sun,
  Moon,
  Coins,
  Apple,
  Gem,
  Award,
  RefreshCw,
  Bell,
  Menu,
  ShieldCheck,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Header({
  activeTab,
  onOpenConnectModal,
  onOpenLauncherModal,
  isCollapsed,
  onToggleMobileSidebar,
  darkMode,
  setDarkMode,
  onQuickSync
}) {
  const { isConnected, isDemo, profile, session } = useAuth();

  const tabTitles = {
    dashboard: 'Tổng Quan Hệ Thống (Dashboard)',
    account: 'Hồ Sơ & Xác Thực Tài Khoản',
    collection: 'Bộ Sưu Tập Rồng Cá Nhân',
    database: 'Bách Khoa Rồng Toàn Thư (Dragon Database)',
    islands: 'Quản Lý Đảo & Công Trình',
    resources: 'Tổng Quan Tài Nguyên & Nhà Kính',
    statistics: 'Thống Kê Chiến Đấu & Đấu Trường',
    heroic: 'Đua Rồng Heroic Race Tracker',
    sync: 'Trung Tâm Đồng Bộ Dữ Liệu (Sync Center)',
    history: 'Lịch Sử Thao Tác & Hoạt Động',
    settings: 'Cài Đặt Hệ Thống'
  };

  return (
    <header className="sticky top-0 z-20 h-16 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 flex items-center justify-between">
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center space-x-3">
        <button
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-sm sm:text-base font-extrabold text-slate-100 flex items-center gap-2">
            <span>{tabTitles[activeTab] || 'Dragon City Hub'}</span>
            <span className="hidden md:inline-flex text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              100% Free • No Ads
            </span>
          </h1>
        </div>
      </div>

      {/* Right: Quick Resources & Actions */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* Quick In-game Stats if Connected */}
        {isConnected && profile && (
          <div className="hidden xl:flex items-center space-x-3 bg-slate-950/70 border border-slate-800 px-3 py-1.5 rounded-xl text-xs font-semibold">
            {/* Level */}
            <div className="flex items-center space-x-1.5 text-amber-400">
              <Award className="w-3.5 h-3.5" />
              <span>Lv.{profile.level || 68}</span>
            </div>
            <div className="w-px h-3 bg-slate-800" />

            {/* Gold */}
            <div className="flex items-center space-x-1 text-yellow-400">
              <Coins className="w-3.5 h-3.5" />
              <span>{Number(profile.gold || 0).toLocaleString()}</span>
            </div>
            <div className="w-px h-3 bg-slate-800" />

            {/* Food */}
            <div className="flex items-center space-x-1 text-red-400">
              <Apple className="w-3.5 h-3.5" />
              <span>{Number(profile.food || 0).toLocaleString()}</span>
            </div>
            <div className="w-px h-3 bg-slate-800" />

            {/* Gems */}
            <div className="flex items-center space-x-1 text-emerald-400">
              <Gem className="w-3.5 h-3.5" />
              <span>{Number(profile.gems || 0).toLocaleString()}</span>
            </div>
          </div>
        )}

        {/* Sync Button */}
        {isConnected && (
          <button
            onClick={onQuickSync}
            title="Đồng bộ nhanh dữ liệu"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 hover:border-cyan-500/40 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        )}

        {/* Prominent OPEN DRAGON CITY Button */}
        <button
          onClick={onOpenLauncherModal}
          className="flex items-center space-x-1.5 sm:space-x-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-amber-500 hover:from-amber-400 via-orange-500 hover:via-orange-400 to-amber-600 hover:to-amber-500 text-slate-950 font-extrabold rounded-xl text-xs uppercase tracking-wider shadow-md shadow-orange-500/20 transition-all transform hover:-translate-y-0.5"
        >
          <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" />
          <span className="hidden sm:inline">Open Dragon City</span>
          <span className="sm:hidden">Vào Game</span>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          title={darkMode ? 'Chuyển sang giao diện Sáng' : 'Chuyển sang giao diện Tối'}
          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
        >
          {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
        </button>

        {/* Connect Button (if not connected) */}
        {!isConnected && (
          <button
            onClick={onOpenConnectModal}
            className="px-3 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs transition-colors shadow-sm shadow-cyan-500/20"
          >
            Kết Nối Game
          </button>
        )}
      </div>
    </header>
  );
}
