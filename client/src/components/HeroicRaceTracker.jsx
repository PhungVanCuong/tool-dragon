import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Trophy,
  Clock,
  Egg,
  HeartHandshake,
  Apple,
  Coins,
  Swords,
  Shield,
  HelpCircle,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Lightbulb
} from 'lucide-react';

export default function HeroicRaceTracker() {
  const [raceData, setRaceData] = useState(null);
  const [selectedLap, setSelectedLap] = useState(3);
  const [selectedNode, setSelectedNode] = useState(1);
  const [activeTimers, setActiveTimers] = useState({});

  useEffect(() => {
    fetch('/api/database/heroic-race')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setRaceData(data.race);
        }
      })
      .catch(err => console.error('Lỗi tải dữ liệu Heroic Race:', err));
  }, []);

  // Timer countdown ticker
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTimers(prev => {
        const next = { ...prev };
        let changed = false;
        Object.keys(next).forEach(key => {
          if (next[key] > 0) {
            next[key] -= 1;
            changed = true;
          }
        });
        return changed ? next : prev;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const startTimer = (taskId, minutes) => {
    setActiveTimers(prev => ({
      ...prev,
      [taskId]: minutes * 60
    }));
  };

  const resetTimer = (taskId) => {
    setActiveTimers(prev => {
      const copy = { ...prev };
      delete copy[taskId];
      return copy;
    });
  };

  const formatTimer = (seconds) => {
    if (!seconds || seconds <= 0) return 'Hồi chiêu hoàn tất!';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}h ${m}m ${s}s`;
    return `${m}m ${s}s`;
  };

  const getTaskIcon = (type) => {
    switch (type) {
      case 'COLLECT_GOLD': return <Coins className="w-5 h-5 text-amber-400" />;
      case 'HARVEST_FOOD': return <Apple className="w-5 h-5 text-rose-400" />;
      case 'BREED_DRAGONS': return <HeartHandshake className="w-5 h-5 text-pink-400" />;
      case 'HATCH_EGGS': return <Egg className="w-5 h-5 text-cyan-400" />;
      case 'FEED_DRAGONS': return <Apple className="w-5 h-5 text-emerald-400" />;
      case 'BATTLE_DRAGONS': return <Swords className="w-5 h-5 text-orange-400" />;
      case 'LEAGUE_BATTLES': return <Trophy className="w-5 h-5 text-yellow-400" />;
      default: return <Sparkles className="w-5 h-5 text-cyan-400" />;
    }
  };

  const currentLapData = raceData?.laps?.find(l => l.lap === selectedLap) || raceData?.laps?.[0];
  const currentNodeData = currentLapData?.nodes?.find(n => n.node === selectedNode) || currentLapData?.nodes?.[0];

  return (
    <div className="space-y-6">
      {/* Heroic Race Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-950/60 via-slate-900 to-indigo-950/60 border border-purple-500/30 p-6 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-400 via-pink-500 to-purple-600 flex items-center justify-center text-3xl shadow-lg shadow-purple-500/25 border border-purple-400/30">
              🏆
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-extrabold text-white">
                  {raceData?.raceName || 'Heroic Race Marathon'}
                </h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Phần thưởng Lap 15
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Trợ lý tính toán vật phẩm, bộ đếm Cooldown bể chứa (Pool) và thủ thuật về đích Top 1
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 bg-slate-950/70 border border-slate-800 px-4 py-2 rounded-xl text-xs">
            <div>
              <span className="text-[10px] text-slate-500 block uppercase font-mono">Đích đến tối thiểu</span>
              <span className="text-sm font-bold text-amber-400">Lap 15 (Chắc chắn nhận Rồng Heroic)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Lap & Node Selector */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        {/* Lap selector */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Chọn Vòng Đua (Lap):
            </span>
            <span className="text-xs text-cyan-400 font-semibold">
              Vòng {selectedLap} / {raceData?.totalLaps || 25}
            </span>
          </div>

          <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-thin">
            {Array.from({ length: 15 }, (_, i) => i + 1).map(lapNum => (
              <button
                key={lapNum}
                onClick={() => {
                  setSelectedLap(lapNum);
                  setSelectedNode(1);
                }}
                className={`px-3.5 py-1.5 rounded-xl font-bold text-xs shrink-0 transition-all ${
                  selectedLap === lapNum
                    ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-md shadow-purple-500/25 scale-105'
                    : lapNum === 15
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
                    : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Lap {lapNum} {lapNum === 15 ? '👑' : ''}
              </button>
            ))}
          </div>
        </div>

        {/* Node selector */}
        <div>
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">
            Chọn Trạm dừng (Node):
          </span>
          <div className="grid grid-cols-5 gap-2">
            {[1, 2, 3, 4, 5].map(nodeNum => (
              <button
                key={nodeNum}
                onClick={() => setSelectedNode(nodeNum)}
                className={`py-2 rounded-xl text-center text-xs font-bold transition-all border ${
                  selectedNode === nodeNum
                    ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300 shadow-md shadow-cyan-500/10'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Node {nodeNum}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Node Tasks & Items */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Nhiệm vụ: Vòng {selectedLap} • Node {selectedNode}</span>
          </h2>
          <span className="text-xs text-slate-400">
            {currentNodeData?.tasks?.length || 0} yêu cầu cần hoàn thành
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentNodeData?.tasks?.map((task, idx) => {
            const taskId = `task_${selectedLap}_${selectedNode}_${idx}`;
            const remainingTimer = activeTimers[taskId];
            const isRunning = remainingTimer > 0;

            return (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4 flex flex-col justify-between"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                      {getTaskIcon(task.type)}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">{task.name}</h3>
                      <p className="text-[11px] text-slate-400">Mã nhiệm vụ: {task.type}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 block uppercase font-mono">Yêu cầu</span>
                    <span className="text-base font-extrabold text-cyan-400 font-mono">
                      {task.required} vật phẩm
                    </span>
                  </div>
                </div>

                {/* Pool & Cooldown Stats */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
                    <span className="text-[10px] text-slate-500 block mb-0.5">Dung lượng Bể (Pool)</span>
                    <span className="font-extrabold text-emerald-400 font-mono">
                      {task.pool} / {task.required} ngay lập tức
                    </span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">
                      {task.pool < task.required
                        ? `Thiếu ${task.required - task.pool} cần chờ hồi chiêu`
                        : 'Làm xong ngay không cần chờ'}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
                    <span className="text-[10px] text-slate-500 block mb-0.5">Thời gian Hồi chiêu</span>
                    <span className="font-extrabold text-amber-400 font-mono flex items-center space-x-1">
                      <Clock className="w-3 h-3 inline" />
                      <span>{task.waitMinutes > 0 ? `${task.waitMinutes} phút` : '0 phút (Ăn ngay)'}</span>
                    </span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">
                      {task.waitMinutes > 0 ? 'Thời gian chờ bể nạp đầy' : 'Không có hồi chiêu'}
                    </span>
                  </div>
                </div>

                {/* Pro Tip */}
                <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-500/20 text-xs text-indigo-200 flex items-start space-x-2">
                  <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-amber-300">Mẹo thực hiện nhanh: </span>
                    <span>{task.tip}</span>
                  </div>
                </div>

                {/* Cooldown Timer Tool */}
                {task.waitMinutes > 0 && (
                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Clock className={`w-4 h-4 ${isRunning ? 'text-amber-400 animate-spin' : 'text-slate-500'}`} />
                      <span className="text-xs font-mono font-bold text-white">
                        {isRunning ? formatTimer(remainingTimer) : 'Chưa đặt hẹn giờ'}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      {!isRunning ? (
                        <button
                          onClick={() => startTimer(taskId, task.waitMinutes)}
                          className="px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-xs font-semibold border border-cyan-500/30 flex items-center space-x-1 transition-all"
                        >
                          <Play className="w-3 h-3" />
                          <span>Hẹn giờ {task.waitMinutes}p</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => resetTimer(taskId)}
                          className="px-3 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 text-xs font-semibold border border-red-500/30 flex items-center space-x-1 transition-all"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Hủy hẹn giờ</span>
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Pro Strategy Guide */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center space-x-2">
          <Lightbulb className="w-5 h-5 text-amber-400" />
          <span>Bí kíp Đua Rồng Heroic từ các Cao thủ (Chiến lược 0 Gems)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-300">
          {(raceData?.tipsAndTricks || [
            "Luôn dùng Terra Dragon + Terra Dragon (15 giây) để làm nhiệm vụ Lai và Ấp trứng nhanh gấp 100 lần.",
            "Chọn loại hạt giống rẻ nhất (Bluebell 30 giây) để spam thu hoạch thức ăn không tốn chi phí.",
            "Mua trứng Terra trong Shop giá 100 vàng và ấp ngay tại lò ấp.",
            "Kiểm tra Pool trước khi làm: nếu Pool đã hết, hãy đợi hết thời gian Cooldown trước khi tiếp tục thực hiện hành động.",
            "Tiết kiệm vé League trước khi đến các chặng yêu cầu League Battles để tránh bị nghẽn 6 tiếng."
          ]).map((tip, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-start space-x-2.5">
              <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 font-bold flex items-center justify-center shrink-0 text-[11px]">
                {idx + 1}
              </span>
              <p className="leading-relaxed">{tip}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
