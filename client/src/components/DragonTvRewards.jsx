import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Tv,
  Gift,
  Calendar,
  Gem,
  Apple,
  Coins,
  CheckCircle,
  Sparkles,
  Award
} from 'lucide-react';

export default function DragonTvRewards({ onOpenConnectModal }) {
  const { isConnected, profile, updateProfileLocally } = useAuth();
  const [loadingAction, setLoadingAction] = useState(null);
  const [msg, setMsg] = useState(null);

  const showMsg = (text, type = 'success') => {
    setMsg({ text, type });
    setTimeout(() => setMsg(null), 4000);
  };

  const handleClaimTv = async () => {
    if (!isConnected) return onOpenConnectModal();
    setLoadingAction('tv');
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
          gems: prev.gems + data.rewards.gems,
          dragonTv: {
            ...prev.dragonTv,
            videosWatchedToday: data.videosCompleted
          }
        }));
        showMsg(data.message, 'success');
      } else {
        showMsg(data.message, 'error');
      }
    } catch {
      showMsg('Lỗi kết nối máy chủ', 'error');
    } finally {
      setLoadingAction(null);
    }
  };

  const handleClaimStreak = async () => {
    if (!isConnected) return onOpenConnectModal();
    setLoadingAction('streak');
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
          gold: prev.gold + data.rewards.gold,
          dragonTv: {
            ...prev.dragonTv,
            streakDays: data.currentStreak
          }
        }));
        showMsg(data.message, 'success');
      } else {
        showMsg(data.message, 'error');
      }
    } catch {
      showMsg('Lỗi kết nối máy chủ', 'error');
    } finally {
      setLoadingAction(null);
    }
  };

  const watched = profile?.dragonTv?.videosWatchedToday || 8;
  const milestone = profile?.dragonTv?.totalMilestone || 15;
  const streak = profile?.dragonTv?.streakDays || 14;

  return (
    <div className="space-y-6">
      {/* Message alert */}
      {msg && (
        <div className={`p-3.5 rounded-xl border text-xs font-bold flex items-center space-x-2 ${
          msg.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-red-500/10 border-red-500/30 text-red-300'
        }`}>
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{msg.text}</span>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-xl font-extrabold text-white flex items-center space-x-2">
          <Tv className="w-6 h-6 text-purple-400" />
          <span>Dragon TV & Chuỗi Thưởng Đăng nhập Hàng ngày</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Tự động ghi nhận mốc xem video Dragon TV, nhận rương bí ẩn và tích lũy chuỗi đăng nhập nhận Đá quý.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Dragon TV Tracker */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <Tv className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white">Mốc xem Dragon TV hôm nay</h2>
                <p className="text-xs text-slate-400">Hoàn thành mốc video nhận rương bí ẩn</p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-lg border border-purple-500/20">
              {watched} / {milestone} Video
            </span>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="w-full bg-slate-950 rounded-full h-3 border border-slate-800 overflow-hidden">
              <div
                className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (watched / milestone) * 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>Rương 1: 5 Video</span>
              <span>Rương 2: 10 Video</span>
              <span>Rương Vàng: 15 Video</span>
            </div>
          </div>

          {/* Milestone Chests */}
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <Gift className="w-5 h-5 mx-auto text-amber-400 mb-1" />
              <p className="font-bold text-white text-[11px]">Rương Đồng</p>
              <span className="text-[10px] text-emerald-400">+50,000 Food</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <Gift className="w-5 h-5 mx-auto text-cyan-400 mb-1" />
              <p className="font-bold text-white text-[11px]">Rương Bạc</p>
              <span className="text-[10px] text-emerald-400">+100,000 Food</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <Gift className="w-5 h-5 mx-auto text-purple-400 mb-1" />
              <p className="font-bold text-white text-[11px]">Rương Vàng</p>
              <span className="text-[10px] text-purple-300">+5 Gems & Heroic Orb</span>
            </div>
          </div>

          <button
            onClick={handleClaimTv}
            disabled={loadingAction === 'tv' || watched >= milestone}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-500 via-indigo-600 to-blue-600 hover:from-purple-400 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-500/20 transition-all disabled:opacity-40"
          >
            {loadingAction === 'tv'
              ? 'Đang nhận phần thưởng...'
              : watched >= milestone
              ? 'Đã Hoàn Thành Toàn Bộ Mốc Hôm Nay'
              : 'Nhận Thưởng Dragon TV Ngay (+5 Video)'}
          </button>
        </div>

        {/* Daily Streak Tracker */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white">Chuỗi Ngày Đăng nhập Liên tiếp</h2>
                <p className="text-xs text-slate-400">Duy trì liên tục để nhận thưởng lớn</p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
              Ngày thứ {streak}
            </span>
          </div>

          {/* 7 Days Preview Cards */}
          <div className="grid grid-cols-7 gap-1.5 text-center text-xs">
            {[1, 2, 3, 4, 5, 6, 7].map(day => (
              <div
                key={day}
                className={`p-2 rounded-xl border transition-all ${
                  day <= 5
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                    : 'bg-slate-950 border-slate-800 text-slate-500'
                }`}
              >
                <span className="text-[10px] block font-mono">D{day}</span>
                <Gem className="w-3.5 h-3.5 mx-auto my-1 text-emerald-400" />
                <span className="text-[10px] font-bold">+{day * 2}G</span>
              </div>
            ))}
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
            <div>
              <span className="text-slate-400 block text-[11px]">Phần thưởng hôm nay:</span>
              <span className="font-extrabold text-white text-sm">+10 Gems & +1,000,000 Vàng</span>
            </div>
            <Award className="w-6 h-6 text-amber-400" />
          </div>

          <button
            onClick={handleClaimStreak}
            disabled={loadingAction === 'streak'}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all disabled:opacity-50"
          >
            {loadingAction === 'streak' ? 'Đang điểm danh...' : 'Điểm danh Nhận Thưởng Ngày Mới'}
          </button>
        </div>
      </div>
    </div>
  );
}
