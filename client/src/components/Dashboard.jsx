import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import AccountCodeGenerator from './AccountCodeGenerator';
import {
  Coins,
  Apple,
  Gem,
  Award,
  Crown,
  Sparkles,
  Zap,
  Trash2,
  Tv,
  Calendar,
  Swords,
  TrendingUp,
  Shield,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Play,
  MapPin,
  RefreshCw
} from 'lucide-react';

export default function Dashboard({ setActiveTab, onOpenConnectModal, onOpenLauncherModal }) {
  const { isConnected, isDemo, profile, updateProfileLocally } = useAuth();
  const [actionLoading, setActionLoading] = useState(null);
  const [notification, setNotification] = useState(null);

  const showToast = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4500);
  };

  const handleQuickHarvest = async () => {
    if (!isConnected) return onOpenConnectModal();
    setActionLoading('harvest');
    try {
      const res = await fetch('/api/tools/greenhouse/harvest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: profile?.userId })
      });
      const data = await res.json();
      if (data.success) {
        updateProfileLocally(prev => ({ ...prev, food: data.newTotalFood }));
        showToast(data.message, 'success');
      } else {
        showToast(data.message || 'Lỗi thu hoạch', 'error');
      }
    } catch {
      showToast('Lỗi kết nối máy chủ', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const handleQuickBoost = async () => {
    if (!isConnected) return onOpenConnectModal();
    setActionLoading('boost');
    try {
      const res = await fetch('/api/tools/greenhouse/boost', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: profile?.userId })
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message, 'success');
      } else {
        showToast(data.message || 'Lỗi kích hoạt boost', 'error');
      }
    } catch {
      showToast('Lỗi kết nối máy chủ', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const handleQuickClearIsland = async () => {
    if (!isConnected) return onOpenConnectModal();
    setActionLoading('clean');
    try {
      const res = await fetch('/api/tools/island/clear-obstacles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: profile?.userId, islandId: 2 })
      });
      const data = await res.json();
      if (data.success) {
        updateProfileLocally(prev => ({
          ...prev,
          gold: prev.gold - data.goldSpent
        }));
        showToast(data.message, 'success');
      } else {
        showToast(data.message || 'Đã dọn sạch hoặc không đủ vàng', 'error');
      }
    } catch {
      showToast('Lỗi kết nối máy chủ', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const handleQuickDragonTv = async () => {
    if (!isConnected) return onOpenConnectModal();
    setActionLoading('tv');
    try {
      const res = await fetch('/api/tools/dragon-tv/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: profile?.userId })
      });
      const data = await res.json();
      if (data.success) {
        updateProfileLocally(prev => ({
          ...prev,
          food: prev.food + data.rewards.food,
          gems: prev.gems + data.rewards.gems
        }));
        showToast(data.message, 'success');
      } else {
        showToast(data.message || 'Không thể nhận quà', 'error');
      }
    } catch {
      showToast('Lỗi kết nối máy chủ', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const handleQuickDailyStreak = async () => {
    if (!isConnected) return onOpenConnectModal();
    setActionLoading('streak');
    try {
      const res = await fetch('/api/tools/streak/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: profile?.userId })
      });
      const data = await res.json();
      if (data.success) {
        updateProfileLocally(prev => ({
          ...prev,
          gems: prev.gems + data.rewards.gems,
          gold: prev.gold + data.rewards.gold
        }));
        showToast(data.message, 'success');
      } else {
        showToast(data.message || 'Lỗi điểm danh', 'error');
      }
    } catch {
      showToast('Lỗi kết nối máy chủ', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl shadow-2xl border flex items-center space-x-3 text-xs font-semibold animate-bounce ${
            notification.type === 'success'
              ? 'bg-slate-900 border-emerald-500/40 text-emerald-400'
              : 'bg-slate-900 border-red-500/40 text-red-400'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle className="w-5 h-5 text-emerald-400" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-400" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* When not connected, show the full Account Code Generator (Vina-Full Style) */}
      {!isConnected && (
        <AccountCodeGenerator />
      )}

      {/* Account Overview Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 p-6 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 flex items-center justify-center text-3xl shadow-lg shadow-cyan-500/25 border border-cyan-400/30">
              🐲
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-extrabold text-white">
                  {isConnected ? profile?.name : 'Khách vãng lai'}
                </h1>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  isConnected
                    ? isDemo
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-slate-800 text-slate-400'
                }`}>
                  {isConnected ? (isDemo ? 'Tài khoản Demo' : 'Đã kết nối') : 'Chưa kết nối'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {isConnected
                  ? `Bang hội: ${profile?.alliance || 'Chưa tham gia'} • Master Points: ${profile?.masterPoints?.toLocaleString() || '0'}`
                  : 'Hãy kết nối mã Dragon City để đồng bộ dữ liệu và sử dụng đầy đủ các công cụ.'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onOpenLauncherModal}
              className="px-4 py-2 bg-gradient-to-r from-amber-500 hover:from-amber-400 to-orange-500 hover:to-orange-400 text-slate-950 font-extrabold rounded-xl text-xs uppercase tracking-wider shadow-md shadow-orange-500/20 flex items-center space-x-1.5 transition-all"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Open Dragon City</span>
            </button>

            {!isConnected ? (
              <button
                onClick={onOpenConnectModal}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/25 transition-all"
              >
                Kết nối Tài khoản Ngay
              </button>
            ) : (
              <div className="flex items-center space-x-3 bg-slate-950/60 border border-slate-800 px-3.5 py-1.5 rounded-xl text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase font-mono">Cấp độ</span>
                  <span className="text-sm font-bold text-cyan-400">Lv. {profile?.level || 1}</span>
                </div>
                <div className="w-px h-6 bg-slate-800" />
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase font-mono">Hạng VIP</span>
                  <span className="text-sm font-bold text-purple-400">{profile?.vipPoints || 0} Pts</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Resource Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mt-6 pt-6 border-t border-slate-800/80">
          <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800 flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-mono">Vàng (Gold)</span>
              <p className="text-sm font-extrabold text-amber-400 font-mono">
                {profile?.gold ? profile.gold.toLocaleString() : '---'}
              </p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800 flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400">
              <Apple className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-mono">Thức ăn (Food)</span>
              <p className="text-sm font-extrabold text-rose-400 font-mono">
                {profile?.food ? profile.food.toLocaleString() : '---'}
              </p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800 flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Gem className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-mono">Đá quý (Gems)</span>
              <p className="text-sm font-extrabold text-emerald-400 font-mono">
                {profile?.gems ? profile.gems.toLocaleString() : '---'}
              </p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800 flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-mono">Master Points</span>
              <p className="text-sm font-extrabold text-indigo-400 font-mono">
                {profile?.masterPoints ? profile.masterPoints.toLocaleString() : '---'}
              </p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800 flex items-center space-x-3 col-span-2 sm:col-span-1">
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-mono">Số Rồng sở hữu</span>
              <p className="text-sm font-extrabold text-purple-400 font-mono">
                {profile?.totalDragons ? `${profile.totalDragons} con` : '---'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Hub */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-2">
            <Zap className="w-4 h-4 text-cyan-400" />
            <span>Thao tác nhanh (1-Click Actions)</span>
          </h2>
          <span className="text-[11px] text-slate-500">
            {isConnected ? 'Sẵn sàng thực hiện' : 'Cần kết nối tài khoản'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Action 1: Harvest Greenhouse */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-3">
            <div className="flex items-start justify-between">
              <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                <Apple className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
                Nhà kính
              </span>
            </div>
            <div>
              <h3 className="text-xs font-bold text-white">Thu hoạch Thức ăn Nhà kính</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Tự động thu hoạch toàn bộ thức ăn đã tích lũy trong nhà kính.
              </p>
            </div>
            <button
              onClick={handleQuickHarvest}
              disabled={actionLoading === 'harvest'}
              className="w-full py-2 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-semibold text-xs border border-rose-500/30 transition-all"
            >
              {actionLoading === 'harvest' ? 'Đang thu hoạch...' : 'Thu hoạch Ngay'}
            </button>
          </div>

          {/* Action 2: Boost Greenhouse */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-3">
            <div className="flex items-start justify-between">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Zap className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
                +3 Giờ
              </span>
            </div>
            <div>
              <h3 className="text-xs font-bold text-white">Kích hoạt Tăng tốc +3h</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Tăng 50% sản lượng sản xuất thức ăn cho Nhà kính trong 3 giờ.
              </p>
            </div>
            <button
              onClick={handleQuickBoost}
              disabled={actionLoading === 'boost'}
              className="w-full py-2 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-semibold text-xs border border-amber-500/30 transition-all"
            >
              {actionLoading === 'boost' ? 'Đang kích hoạt...' : 'Tăng tốc +3h'}
            </button>
          </div>

          {/* Action 3: Clear Island Obstacles */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-3">
            <div className="flex items-start justify-between">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Trash2 className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
                Dọn Đảo
              </span>
            </div>
            <div>
              <h3 className="text-xs font-bold text-white">Dọn dẹp Chướng ngại vật</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Quét và tự động phá dọn đá, cây cối để giải phóng diện tích đảo.
              </p>
            </div>
            <button
              onClick={handleQuickClearIsland}
              disabled={actionLoading === 'clean'}
              className="w-full py-2 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-semibold text-xs border border-emerald-500/30 transition-all"
            >
              {actionLoading === 'clean' ? 'Đang dọn dẹp...' : 'Dọn dẹp Đảo'}
            </button>
          </div>

          {/* Action 4: Dragon TV Rewards */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-3">
            <div className="flex items-start justify-between">
              <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <Tv className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
                Phần thưởng
              </span>
            </div>
            <div>
              <h3 className="text-xs font-bold text-white">Nhận Thưởng Dragon TV</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Nhận rương bí ẩn và hoàn thành mốc quảng cáo Dragon TV trong ngày.
              </p>
            </div>
            <button
              onClick={handleQuickDragonTv}
              disabled={actionLoading === 'tv'}
              className="w-full py-2 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 font-semibold text-xs border border-purple-500/30 transition-all"
            >
              {actionLoading === 'tv' ? 'Đang nhận...' : 'Nhận Thưởng TV'}
            </button>
          </div>
        </div>
      </div>

      {/* Heroic Race Spotlight & Feature Teasers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Heroic Race Banner */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-gradient-to-br from-indigo-950/50 via-slate-900 to-slate-900 border border-indigo-500/30 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                  Sự kiện Đua Rồng Đang Diễn Ra
                </span>
              </div>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-semibold">
                Heroic Marathon
              </span>
            </div>
            <h3 className="text-lg font-extrabold text-white">
              High Master Karma Marathon • Chinh phục Lap 15
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-xl">
              Hệ thống theo dõi chi tiết từng trạm (Node), thời gian hồi chiêu (Cooldown), dung lượng túi (Pool) và thủ thuật lai ghép Terra + Terra để hoàn thành nhanh nhất.
            </p>
          </div>

          <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-800">
            <div className="flex items-center space-x-4 text-xs text-slate-300">
              <div>
                <span className="text-[10px] text-slate-500 block">Mục tiêu</span>
                <span className="font-bold text-cyan-400">Lap 15 (Nhận Heroic)</span>
              </div>
              <div className="w-px h-6 bg-slate-800" />
              <div>
                <span className="text-[10px] text-slate-500 block">Mẹo tối ưu</span>
                <span className="font-bold text-amber-400">Lai Terra 15s</span>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('heroic')}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 font-semibold text-xs border border-indigo-500/30 transition-all"
            >
              <span>Xem Trợ lý Đua</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Daily Streak & Arena Card */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 text-amber-400 mb-2">
              <Calendar className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Điểm danh Hàng ngày</span>
            </div>
            <h4 className="text-sm font-bold text-white">Chuỗi ngày đăng nhập: 14 ngày</h4>
            <p className="text-xs text-slate-400 mt-1">
              Duy trì chuỗi đăng nhập liên tục để nhận thưởng Đá quý, Vàng và Rương báu vật phẩm hàng tuần.
            </p>
          </div>

          <button
            onClick={handleQuickDailyStreak}
            disabled={actionLoading === 'streak'}
            className="w-full mt-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-semibold text-xs border border-amber-500/30 transition-all"
          >
            {actionLoading === 'streak' ? 'Đang điểm danh...' : 'Điểm danh Nhận Gems & Vàng'}
          </button>
        </div>
      </div>
    </div>
  );
}
