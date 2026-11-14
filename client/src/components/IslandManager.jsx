import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  MapPin,
  Lock,
  Unlock,
  Coins,
  Gem,
  Award,
  Layers,
  Sparkles,
  CheckCircle,
  HelpCircle,
  Home
} from 'lucide-react';

export default function IslandManager({ onOpenConnectModal }) {
  const { isConnected, profile, session } = useAuth();
  const [islands, setIslands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIsland, setSelectedIsland] = useState(null);

  useEffect(() => {
    fetchIslands();
  }, [isConnected, profile]);

  const fetchIslands = async () => {
    try {
      const userId = session?.userId || profile?.userId;
      const res = await fetch(`/api/player/islands?userId=${userId || ''}`);
      const data = await res.json();
      if (data.success) {
        setIslands(data.islands);
        if (data.islands.length > 0) setSelectedIsland(data.islands[0]);
      }
    } catch (err) {
      console.error('Lỗi tải dữ liệu đảo:', err);
    } finally {
      setLoading(false);
    }
  };

  const playerLevel = profile?.level || 68;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <div>
          <h2 className="text-xl font-extrabold text-slate-100 flex items-center gap-2.5">
            <MapPin className="w-6 h-6 text-emerald-400" />
            Quản Lý Quần Đảo Dragon City
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Cấp độ tài khoản của bạn: <strong className="text-amber-400 font-mono">Lv.{playerLevel}</strong> • Đã mở khóa{' '}
            <strong className="text-emerald-400 font-mono">
              {islands.filter(i => i.unlocked).length}/{islands.length}
            </strong>{' '}
            hòn đảo
          </p>
        </div>

        <div className="px-4 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-xs flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span className="text-slate-300">
            Tổng Sức Chứa Môi Trường:{' '}
            <strong className="text-cyan-400">
              {islands.filter(i => i.unlocked).reduce((sum, i) => sum + i.maxHabitats, 0)} Habitat
            </strong>
          </span>
        </div>
      </div>

      {/* Islands Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {islands.map((island) => {
          const isUnlocked = island.unlocked;
          const isSelected = selectedIsland?.id === island.id;

          return (
            <div
              key={island.id}
              onClick={() => setSelectedIsland(island)}
              className={`cursor-pointer rounded-2xl p-5 border transition-all duration-200 relative overflow-hidden flex flex-col justify-between ${
                isUnlocked
                  ? isSelected
                    ? 'bg-slate-850 border-cyan-500 shadow-xl shadow-cyan-500/10'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
                  : 'bg-slate-950/70 border-slate-850 opacity-70 hover:opacity-90'
              }`}
            >
              {/* Badge & Lock status */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-bold text-slate-400">
                  #{island.id} {island.name}
                </span>

                {isUnlocked ? (
                  <span className="flex items-center space-x-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                    <Unlock className="w-3 h-3" />
                    <span>Đã Mở Khóa</span>
                  </span>
                ) : (
                  <span className="flex items-center space-x-1 px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-bold">
                    <Lock className="w-3 h-3" />
                    <span>Cần Lv.{island.requiredLevel}</span>
                  </span>
                )}
              </div>

              {/* Island Visual & Name */}
              <div className="my-2">
                <h3 className="text-lg font-black text-slate-100 flex items-center gap-2">
                  <span>🏝️</span>
                  <span>{island.nameVi}</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">{island.description}</p>
              </div>

              {/* Stats Bar */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center space-x-1.5 text-slate-300">
                  <Home className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Max: <strong>{island.maxHabitats}</strong> Chuồng</span>
                </div>

                <div className="flex items-center space-x-1.5 text-slate-300">
                  <Layers className="w-3.5 h-3.5 text-amber-400" />
                  <span>Chướng ngại: <strong>{island.obstaclesRemaining}</strong></span>
                </div>
              </div>

              {/* Elements Affinity */}
              <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
                <span>Hệ phù hợp:</span>
                <div className="flex items-center gap-1 font-mono uppercase text-cyan-300">
                  {island.elements?.join(', ')}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Island Detail Inspector */}
      {selectedIsland && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <span>🏝️</span>
              <span>Chi Tiết Đảo: {selectedIsland.nameVi} ({selectedIsland.name})</span>
            </h3>
            <span className="text-xs font-mono text-cyan-400">
              Yêu cầu cấp độ: Lv.{selectedIsland.requiredLevel}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <span className="text-slate-400 block mb-1">Chi Phí Mua Đảo</span>
              <div className="text-sm font-bold text-yellow-400 flex items-center gap-1.5">
                <Coins className="w-4 h-4" />
                <span>{selectedIsland.costGold > 0 ? selectedIsland.costGold.toLocaleString() + ' Vàng' : 'Miễn phí'}</span>
              </div>
              {selectedIsland.costGems > 0 && (
                <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 mt-1">
                  <Gem className="w-3.5 h-3.5" />
                  <span>{selectedIsland.costGems} Gems</span>
                </div>
              )}
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <span className="text-slate-400 block mb-1">Quy Mô Xây Dựng</span>
              <div className="text-sm font-bold text-cyan-400 flex items-center gap-1.5">
                <Home className="w-4 h-4" />
                <span>Tối đa {selectedIsland.maxHabitats} Môi Trường Rồng</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Giúp gia tăng sản lượng vàng thu hoạch mỗi giờ</p>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <span className="text-slate-400 block mb-1">Dọn Dẹp Đảo</span>
              <div className="text-sm font-bold text-amber-400 flex items-center gap-1.5">
                <Layers className="w-4 h-4" />
                <span>Tổng {selectedIsland.totalObstacles} Chướng Ngại Vật</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Cây cổ thụ, tảng đá lớn, rương ma thuật</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
