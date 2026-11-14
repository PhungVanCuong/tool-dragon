import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Apple,
  Coins,
  Zap,
  Trash2,
  TrendingUp,
  Clock,
  Sparkles,
  CheckCircle,
  AlertCircle,
  Layers,
  ArrowRight
} from 'lucide-react';

export default function ResourceHub({ onOpenConnectModal }) {
  const { isConnected, profile, updateProfileLocally } = useAuth();
  const [selectedIslandId, setSelectedIslandId] = useState(2);
  const [goldToConvert, setGoldToConvert] = useState(5000000);
  const [loadingAction, setLoadingAction] = useState(null);
  const [message, setMessage] = useState(null);

  const showMsg = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 4000);
  };

  const handleHarvest = async () => {
    if (!isConnected) return onOpenConnectModal();
    setLoadingAction('harvest');
    try {
      const res = await fetch('/api/tools/greenhouse/harvest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: profile?.userId })
      });
      const data = await res.json();
      if (data.success) {
        updateProfileLocally(prev => ({ ...prev, food: data.newTotalFood }));
        showMsg(data.message, 'success');
      } else {
        showMsg(data.message || 'Lỗi thu hoạch', 'error');
      }
    } catch {
      showMsg('Lỗi kết nối máy chủ', 'error');
    } finally {
      setLoadingAction(null);
    }
  };

  const handleBoost = async () => {
    if (!isConnected) return onOpenConnectModal();
    setLoadingAction('boost');
    try {
      const res = await fetch('/api/tools/greenhouse/boost', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: profile?.userId })
      });
      const data = await res.json();
      if (data.success) {
        showMsg(data.message, 'success');
      } else {
        showMsg(data.message || 'Lỗi kích hoạt boost', 'error');
      }
    } catch {
      showMsg('Lỗi kết nối máy chủ', 'error');
    } finally {
      setLoadingAction(null);
    }
  };

  const handleClearIsland = async () => {
    if (!isConnected) return onOpenConnectModal();
    setLoadingAction('clean');
    try {
      const res = await fetch('/api/tools/island/clear-obstacles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: profile?.userId, islandId: selectedIslandId })
      });
      const data = await res.json();
      if (data.success) {
        updateProfileLocally(prev => {
          const updatedIslands = prev.islands.map(isl =>
            isl.id === selectedIslandId ? { ...isl, obstaclesRemaining: 0 } : isl
          );
          return {
            ...prev,
            gold: prev.gold - data.goldSpent,
            islands: updatedIslands
          };
        });
        showMsg(data.message, 'success');
      } else {
        showMsg(data.message || 'Lỗi dọn đảo', 'error');
      }
    } catch {
      showMsg('Lỗi kết nối máy chủ', 'error');
    } finally {
      setLoadingAction(null);
    }
  };

  const handleConvertGold = async () => {
    if (!isConnected) return onOpenConnectModal();
    setLoadingAction('convert');
    try {
      const res = await fetch('/api/tools/resource/convert-gold', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: profile?.userId, goldAmount: goldToConvert })
      });
      const data = await res.json();
      if (data.success) {
        updateProfileLocally(prev => ({
          ...prev,
          gold: data.newGold,
          food: data.newFood
        }));
        showMsg(data.message, 'success');
      } else {
        showMsg(data.message || 'Lỗi quy đổi', 'error');
      }
    } catch {
      showMsg('Lỗi kết nối máy chủ', 'error');
    } finally {
      setLoadingAction(null);
    }
  };

  const estimatedFoodOutput = Math.round((goldToConvert / 100000) * 12500 * (1 + Math.min(0.2, (goldToConvert / 10000000) * 0.1)));

  const currentIsland = profile?.islands?.find(i => i.id === selectedIslandId) || {
    name: 'Đảo lựa chọn',
    obstaclesRemaining: 2,
    unlocked: true
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {message && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl shadow-2xl border flex items-center space-x-3 text-xs font-semibold ${
            message.type === 'success'
              ? 'bg-slate-900 border-emerald-500/40 text-emerald-400'
              : 'bg-slate-900 border-red-500/40 text-red-400'
          }`}
        >
          {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Page Title */}
      <div>
        <h1 className="text-xl font-extrabold text-white flex items-center space-x-2">
          <Zap className="w-6 h-6 text-cyan-400" />
          <span>Trung tâm Quản lý Tài nguyên & Đảo</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Tối ưu hóa sản lượng thức ăn, quản lý nhà kính, dọn sạch đá cây cối và quy đổi tài nguyên tự động.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Module 1: Greenhouse Manager */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                <Apple className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white">Quản lý Nhà kính (Greenhouse)</h2>
                <p className="text-xs text-slate-400">Tự động tích lũy và boost sản lượng thức ăn</p>
              </div>
            </div>
            <span className="text-[10px] px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
              Đang hoạt động
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-slate-500 block text-[11px] mb-1">Sản lượng cơ bản</span>
              <p className="font-extrabold text-white text-sm font-mono">75,000 / giờ</p>
              <span className="text-[10px] text-emerald-400">+50% khi có Boost</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-slate-500 block text-[11px] mb-1">Trạng thái Boost</span>
              <p className="font-extrabold text-amber-400 text-sm font-mono flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5" />
                <span>+3 giờ hiệu lực</span>
              </p>
              <span className="text-[10px] text-slate-400">Tăng tốc sản xuất</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={handleHarvest}
              disabled={loadingAction === 'harvest'}
              className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-400 hover:to-pink-500 text-white font-bold text-xs shadow-lg shadow-rose-500/20 transition-all disabled:opacity-50"
            >
              {loadingAction === 'harvest' ? 'Đang thu hoạch...' : 'Thu hoạch Thức ăn'}
            </button>
            <button
              onClick={handleBoost}
              disabled={loadingAction === 'boost'}
              className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all disabled:opacity-50"
            >
              {loadingAction === 'boost' ? 'Đang kích hoạt...' : 'Kích hoạt Boost +3h'}
            </button>
          </div>
        </div>

        {/* Module 2: Island Obstacle Cleaner */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white">Dọn sạch Chướng ngại vật Đảo</h2>
                <p className="text-xs text-slate-400">Quét và dọn đá, cây cối để lấy đất trống</p>
              </div>
            </div>
            <span className="text-[10px] px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-semibold">
              Quét tự động
            </span>
          </div>

          {/* Island selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Chọn đảo cần dọn dẹp:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {(profile?.islands || [
                { id: 1, name: 'Lush Island', obstaclesRemaining: 0 },
                { id: 2, name: 'Lava Island', obstaclesRemaining: 1 },
                { id: 3, name: 'Desert Island', obstaclesRemaining: 4 },
                { id: 4, name: 'Magic Island', obstaclesRemaining: 6 }
              ]).map(island => (
                <button
                  key={island.id}
                  onClick={() => setSelectedIslandId(island.id)}
                  className={`p-2 rounded-xl text-left border transition-all text-xs ${
                    selectedIslandId === island.id
                      ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <p className="font-bold truncate">{island.name}</p>
                  <p className="text-[10px] mt-0.5 opacity-80">
                    {island.obstaclesRemaining > 0
                      ? `Còn ${island.obstaclesRemaining} vật cản`
                      : 'Đã sạch 100%'}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs">
            <div>
              <span className="text-slate-500 block text-[11px]">Đảo: {currentIsland.name}</span>
              <span className="text-white font-bold">
                {currentIsland.obstaclesRemaining > 0
                  ? `Chi phí: ${(currentIsland.obstaclesRemaining * 75000).toLocaleString()} Vàng`
                  : 'Không có vật cản nào cần dọn'}
              </span>
            </div>
            <span className="text-[11px] text-emerald-400 font-semibold">
              +{currentIsland.obstaclesRemaining * 45000} EXP
            </span>
          </div>

          <button
            onClick={handleClearIsland}
            disabled={loadingAction === 'clean' || currentIsland.obstaclesRemaining === 0}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-40"
          >
            {loadingAction === 'clean'
              ? 'Đang phá dọn vật cản...'
              : currentIsland.obstaclesRemaining === 0
              ? 'Đảo Đã Sạch Hoàn Toàn'
              : `Dọn Sạch ${currentIsland.obstaclesRemaining} Vật Cản Ngay`}
          </button>
        </div>
      </div>

      {/* Module 3: Gold to Food Converter */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Coins className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Quy đổi Vàng sang Thức ăn (Gold to Food)</h2>
              <p className="text-xs text-slate-400">
                Chuyển đổi lượng vàng dư thừa thành thức ăn nuôi rồng với ưu đãi cộng thêm số lượng lớn
              </p>
            </div>
          </div>
          <span className="text-[10px] px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 font-semibold">
            Tối ưu tỷ giá
          </span>
        </div>

        {/* Conversion Calculator */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          {/* Input Gold */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
            <span className="text-xs font-semibold text-slate-400">Số Vàng muốn quy đổi:</span>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                step="500000"
                min="500000"
                value={goldToConvert}
                onChange={(e) => setGoldToConvert(Math.max(500000, Number(e.target.value)))}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm font-mono text-amber-400 font-bold focus:border-amber-500 focus:outline-none"
              />
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {[1000000, 5000000, 10000000, 25000000].map(val => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setGoldToConvert(val)}
                  className={`px-2 py-0.5 rounded text-[10px] font-mono border transition-colors ${
                    goldToConvert === val
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  {(val / 1000000).toFixed(0)}M
                </button>
              ))}
            </div>
          </div>

          {/* Arrow indicator */}
          <div className="hidden md:flex flex-col items-center justify-center text-slate-500">
            <ArrowRight className="w-6 h-6 text-cyan-400 animate-pulse" />
            <span className="text-[10px] text-cyan-400 mt-1 font-semibold">+10% Thưởng mốc lớn</span>
          </div>

          {/* Output Food */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
            <span className="text-xs font-semibold text-slate-400">Thức ăn nhận được ước tính:</span>
            <div className="py-2 text-lg font-mono font-extrabold text-rose-400 flex items-center space-x-2">
              <Apple className="w-5 h-5 text-rose-400" />
              <span>+{estimatedFoodOutput.toLocaleString()} Food</span>
            </div>
            <p className="text-[10px] text-slate-500">
              Đủ để nuôi 1 Rồng Heroic từ Level 1 lên Level 32 ngay tức khắc.
            </p>
          </div>
        </div>

        <button
          onClick={handleConvertGold}
          disabled={loadingAction === 'convert'}
          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-white font-bold text-xs shadow-lg shadow-orange-500/20 transition-all disabled:opacity-50"
        >
          {loadingAction === 'convert'
            ? 'Đang thực hiện quy đổi...'
            : `Quy đổi ${goldToConvert.toLocaleString()} Vàng Ngay`}
        </button>
      </div>
    </div>
  );
}
