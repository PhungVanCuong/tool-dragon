import React from 'react';
import {
  Home,
  User,
  Shield,
  BookOpen,
  MapPin,
  Coins,
  Swords,
  Sparkles,
  RefreshCw,
  History,
  Settings,
  ChevronLeft,
  ChevronRight,
  Play,
  LogOut,
  LogIn
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({
  activeTab,
  setActiveTab,
  isCollapsed,
  setIsCollapsed,
  onOpenConnectModal,
  onOpenLauncherModal
}) {
  const { isConnected, isDemo, session, disconnect } = useAuth();

  const navGroups = [
    {
      group: 'Tổng quan',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: Home, badge: null },
        { id: 'account', label: 'Hồ Sơ Tài Khoản', icon: User, badge: isConnected ? 'Đã kết nối' : 'Chưa kết nối' },
      ]
    },
    {
      group: 'Rồng & Thế Giới',
      items: [
        { id: 'collection', label: 'Bộ Sưu Tập Rồng', icon: Shield, badge: null },
        { id: 'database', label: 'Bách Khoa Rồng', icon: BookOpen, badge: 'Full Dex' },
        { id: 'islands', label: 'Quản Lý Đảo', icon: MapPin, badge: null },
      ]
    },
    {
      group: 'Tài Nguyên & Chiến Đấu',
      items: [
        { id: 'resources', label: 'Tài Nguyên & Nông Trại', icon: Coins, badge: null },
        { id: 'statistics', label: 'Thống Kê & Đấu Trường', icon: Swords, badge: null },
        { id: 'heroic', label: 'Đua Rồng Heroic', icon: Sparkles, badge: 'Sự kiện' },
      ]
    },
    {
      group: 'Hệ Thống & Dữ Liệu',
      items: [
        { id: 'sync', label: 'Đồng Bộ Dữ Liệu', icon: RefreshCw, badge: null },
        { id: 'history', label: 'Lịch Sử Hoạt Động', icon: History, badge: null },
        { id: 'settings', label: 'Cài Đặt', icon: Settings, badge: null },
      ]
    }
  ];

  return (
    <aside
      className={`fixed top-0 left-0 bottom-0 z-30 bg-slate-900 border-r border-slate-800 transition-all duration-300 flex flex-col ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800 bg-slate-950/40">
        <div
          onClick={() => setActiveTab('dashboard')}
          className="flex items-center space-x-3 cursor-pointer overflow-hidden"
        >
          <div className="w-10 h-10 min-w-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 flex items-center justify-center text-xl shadow-lg shadow-cyan-500/20">
            🐉
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="font-extrabold text-sm tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 whitespace-nowrap">
                DRAGON CITY
              </span>
              <span className="text-[10px] font-semibold text-emerald-400 tracking-wider">
                COMPANION HUB
              </span>
            </div>
          )}
        </div>

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title={isCollapsed ? 'Mở rộng sidebar' : 'Thu gọn sidebar'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Quick Launch CTA Button */}
      <div className="p-3 border-b border-slate-800/80">
        <button
          onClick={onOpenLauncherModal}
          className={`w-full py-2.5 px-3 bg-gradient-to-r from-amber-500 hover:from-amber-400 to-orange-500 hover:to-orange-400 text-slate-950 font-bold rounded-xl shadow-md shadow-orange-500/20 flex items-center justify-center transition-all ${
            isCollapsed ? 'px-0' : 'space-x-2'
          }`}
          title="Mở trực tiếp trò chơi Dragon City"
        >
          <Play className="w-4 h-4 fill-current flex-shrink-0" />
          {!isCollapsed && <span className="text-xs uppercase tracking-wider font-extrabold">Open Dragon City</span>}
        </button>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto py-3 px-2 space-y-4">
        {navGroups.map((group, gIdx) => (
          <div key={gIdx} className="space-y-1">
            {!isCollapsed && (
              <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                {group.group}
              </div>
            )}
            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  title={item.label}
                  className={`w-full flex items-center rounded-xl text-xs font-medium transition-all ${
                    isCollapsed ? 'justify-center p-3' : 'justify-between px-3 py-2.5'
                  } ${
                    isActive
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm shadow-cyan-500/10 font-semibold'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                    {!isCollapsed && <span className="truncate">{item.label}</span>}
                  </div>
                  {!isCollapsed && item.badge && (
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${
                        item.badge === 'Đã kết nối'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : item.badge === 'Sự kiện'
                          ? 'bg-purple-500/20 text-purple-300'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* User Session Footer */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/40">
        {isConnected ? (
          <div className="flex items-center justify-between">
            <div
              onClick={() => setActiveTab('account')}
              className={`flex items-center space-x-2.5 cursor-pointer overflow-hidden ${
                isCollapsed ? 'w-full justify-center' : ''
              }`}
            >
              <div className="w-8 h-8 min-w-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center font-bold text-cyan-400 text-xs">
                {session?.name ? session.name.charAt(0).toUpperCase() : 'U'}
              </div>
              {!isCollapsed && (
                <div className="overflow-hidden">
                  <div className="text-xs font-semibold text-slate-200 truncate">
                    {session?.name || 'Dragon Master'}
                  </div>
                  <div className="text-[10px] font-mono text-emerald-400 truncate">
                    UID: {session?.userId}
                  </div>
                </div>
              )}
            </div>

            {!isCollapsed && (
              <button
                onClick={disconnect}
                title="Đăng xuất"
                className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        ) : (
          <button
            onClick={onOpenConnectModal}
            className={`w-full py-2 bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-cyan-500/30 rounded-xl text-xs font-semibold flex items-center justify-center transition-colors ${
              isCollapsed ? 'px-0' : 'space-x-1.5'
            }`}
          >
            <LogIn className="w-4 h-4" />
            {!isCollapsed && <span>Kết Nối Ngay</span>}
          </button>
        )}
      </div>
    </aside>
  );
}
