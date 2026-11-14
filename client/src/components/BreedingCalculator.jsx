import React, { useState, useEffect } from 'react';
import {
  Egg,
  HeartHandshake,
  Sparkles,
  ArrowRight,
  Apple,
  Search,
  Star,
  ShieldAlert,
  Percent,
  Clock,
  RotateCcw
} from 'lucide-react';

export default function BreedingCalculator() {
  const [activeSubTab, setActiveSubTab] = useState('forward');
  const [dragonsList, setDragonsList] = useState([]);
  
  // Forward breeding state
  const [parent1, setParent1] = useState('c_flame');
  const [parent2, setParent2] = useState('c_sea');
  const [sanctuaryLevel, setSanctuaryLevel] = useState(8);
  const [empower1, setEmpower1] = useState(0);
  const [empower2, setEmpower2] = useState(0);
  const [breedingResult, setBreedingResult] = useState(null);
  const [breedingLoading, setBreedingLoading] = useState(false);

  // Reverse breeding state
  const [targetDragon, setTargetDragon] = useState('l_apocalypse');
  const [reverseResult, setReverseResult] = useState(null);
  const [reverseLoading, setReverseLoading] = useState(false);

  // Feeding calculator state
  const [fromLevel, setFromLevel] = useState(1);
  const [toLevel, setToLevel] = useState(40);
  const [feedingResult, setFeedingResult] = useState(null);

  useEffect(() => {
    fetch('/api/database/dragons')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setDragonsList(data.dragons);
        }
      });
  }, []);

  const handleCalculateBreeding = async () => {
    setBreedingLoading(true);
    try {
      const res = await fetch('/api/tools/breeding/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          parent1Id: parent1,
          parent2Id: parent2,
          sanctuaryLevel,
          empower1,
          empower2
        })
      });
      const data = await res.json();
      if (data.success) {
        setBreedingResult(data);
      }
    } catch (err) {
      console.error('Lỗi tính toán phối giống:', err);
    } finally {
      setBreedingLoading(false);
    }
  };

  const handleReverseBreeding = async () => {
    setReverseLoading(true);
    try {
      const res = await fetch('/api/tools/breeding/reverse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetDragonId: targetDragon })
      });
      const data = await res.json();
      if (data.success) {
        setReverseResult(data);
      }
    } catch (err) {
      console.error('Lỗi tra cứu lai ngược:', err);
    } finally {
      setReverseLoading(false);
    }
  };

  const handleCalculateFeeding = async () => {
    try {
      const res = await fetch('/api/tools/feeding/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fromLevel, toLevel })
      });
      const data = await res.json();
      if (data.success) {
        setFeedingResult(data);
      }
    } catch (err) {
      console.error('Lỗi tính toán thức ăn:', err);
    }
  };

  useEffect(() => {
    handleCalculateBreeding();
  }, [parent1, parent2, sanctuaryLevel, empower1, empower2]);

  useEffect(() => {
    handleCalculateFeeding();
  }, [fromLevel, toLevel]);

  const getRarityBadge = (rarity) => {
    switch (rarity) {
      case 'H': return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">HEROIC</span>;
      case 'M': return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">MYTHIC</span>;
      case 'L': return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-yellow-500/20 text-yellow-300 border border-yellow-500/30">LEGEND</span>;
      case 'E': return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">EPIC</span>;
      case 'VR': return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">V.RARE</span>;
      case 'R': return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">RARE</span>;
      default: return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-700 text-slate-300">COMMON</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-xl font-extrabold text-white flex items-center space-x-2">
          <Egg className="w-6 h-6 text-pink-400" />
          <span>Máy tính Phối giống & Chi phí Nuôi Rồng</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Thuật toán phối giống chuẩn xác theo cơ chế Dragon City: Sanctuary, Sao kích hoạt (Empower), và bảng tính thức ăn.
        </p>
      </div>

      {/* Sub Tabs */}
      <div className="flex border-b border-slate-800 space-x-2">
        <button
          onClick={() => setActiveSubTab('forward')}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center space-x-1.5 ${
            activeSubTab === 'forward'
              ? 'border-pink-500 text-pink-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <HeartHandshake className="w-4 h-4" />
          <span>Phối giống Rồng (Bố + Mẹ)</span>
        </button>

        <button
          onClick={() => {
            setActiveSubTab('reverse');
            if (!reverseResult) handleReverseBreeding();
          }}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center space-x-1.5 ${
            activeSubTab === 'reverse'
              ? 'border-cyan-500 text-cyan-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <RotateCcw className="w-4 h-4" />
          <span>Tra cứu Lai ngược (Tìm Bố Mẹ)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('feeding')}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center space-x-1.5 ${
            activeSubTab === 'feeding'
              ? 'border-rose-500 text-rose-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Apple className="w-4 h-4" />
          <span>Bảng tính Thức ăn (Level 1 - 70)</span>
        </button>
      </div>

      {/* Tab 1: Forward Breeding */}
      {activeSubTab === 'forward' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Parent 1 */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <label className="block text-xs font-bold text-slate-200">
                Chọn Rồng Bố (Parent 1):
              </label>
              <select
                value={parent1}
                onChange={(e) => setParent1(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:border-pink-500 focus:outline-none"
              >
                {dragonsList.map(d => (
                  <option key={d.id} value={d.id}>
                    [{d.rarity}] {d.name} ({d.nameVi || d.name})
                  </option>
                ))}
              </select>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-slate-400">Số sao kích hoạt (Empower):</span>
                <div className="flex items-center space-x-1">
                  {[0, 1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setEmpower1(star)}
                      className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold transition-all ${
                        empower1 === star
                          ? 'bg-amber-500 text-slate-950 font-extrabold'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {star}★
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Parent 2 */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <label className="block text-xs font-bold text-slate-200">
                Chọn Rồng Mẹ (Parent 2):
              </label>
              <select
                value={parent2}
                onChange={(e) => setParent2(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:border-pink-500 focus:outline-none"
              >
                {dragonsList.map(d => (
                  <option key={d.id} value={d.id}>
                    [{d.rarity}] {d.name} ({d.nameVi || d.name})
                  </option>
                ))}
              </select>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-slate-400">Số sao kích hoạt (Empower):</span>
                <div className="flex items-center space-x-1">
                  {[0, 1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setEmpower2(star)}
                      className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold transition-all ${
                        empower2 === star
                          ? 'bg-amber-500 text-slate-950 font-extrabold'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {star}★
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sanctuary Level Config */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-white">Cấp Đền Thánh (Breeding Sanctuary Level):</span>
              <span className="text-slate-400">Mở khóa các rồng hiếm</span>
            </div>
            <div className="flex items-center space-x-1.5">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(lvl => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setSanctuaryLevel(lvl)}
                  className={`w-7 h-7 rounded-lg font-bold transition-all ${
                    sanctuaryLevel === lvl
                      ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md'
                      : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Results Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-pink-400" />
                <span>Kết quả Lai tạo có thể sinh ra: ({breedingResult?.possibleOffspring?.length || 0} loài)</span>
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {breedingResult?.possibleOffspring?.map((dragon, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between space-x-3 shadow-md"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      {getRarityBadge(dragon.rarity)}
                      <h4 className="text-xs font-bold text-white">{dragon.name}</h4>
                    </div>
                    <p className="text-[11px] text-slate-400">{dragon.nameVi}</p>
                    <div className="flex items-center space-x-3 text-[10px] text-slate-500 font-mono">
                      <span>Lai: {dragon.breedTimeHours}h</span>
                      <span>Ấp: {dragon.hatchTimeHours}h</span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-base font-extrabold text-pink-400 font-mono">
                      {dragon.percentage}%
                    </span>
                    <span className="text-[10px] text-slate-500 block">Tỷ lệ ra</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Reverse Breeding */}
      {activeSubTab === 'reverse' && (
        <div className="space-y-5">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <label className="block text-xs font-bold text-slate-200">
              Chọn Rồng mong muốn nhận được (Target Dragon):
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <select
                value={targetDragon}
                onChange={(e) => setTargetDragon(e.target.value)}
                className="flex-1 px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:border-cyan-500 focus:outline-none"
              >
                {dragonsList.map(d => (
                  <option key={d.id} value={d.id}>
                    [{d.rarity}] {d.name} ({d.nameVi || d.name})
                  </option>
                ))}
              </select>
              <button
                onClick={handleReverseBreeding}
                disabled={reverseLoading}
                className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/20 transition-all shrink-0"
              >
                {reverseLoading ? 'Đang phân tích...' : 'Tìm cặp bố mẹ'}
              </button>
            </div>
          </div>

          {/* Reverse pairs recommendations */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <RotateCcw className="w-4 h-4 text-cyan-400" />
              <span>Các cặp Bố Mẹ đề xuất tốt nhất cho: {reverseResult?.target?.name}</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {reverseResult?.recommendedPairs?.map((pair, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between shadow-md"
                >
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center space-x-1.5 font-bold text-white">
                      <span>{pair.parent1.name}</span>
                      <span className="text-pink-400">+</span>
                      <span>{pair.parent2.name}</span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Điểm hiệu quả tốc độ: {pair.efficiencyScore}/100
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-bold text-cyan-400 font-mono">
                      {pair.estimatedChance}
                    </span>
                    <span className="text-[10px] text-slate-500 block">Tỷ lệ ước tính</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Feeding Calculator */}
      {activeSubTab === 'feeding' && (
        <div className="space-y-5">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white">Tính toán Lượng Thức Ăn cần thiết:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Cấp độ ban đầu:</label>
                <input
                  type="number"
                  min="1"
                  max="69"
                  value={fromLevel}
                  onChange={(e) => setFromLevel(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm font-bold text-white"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Cấp độ mục tiêu:</label>
                <input
                  type="number"
                  min={fromLevel + 1}
                  max="70"
                  value={toLevel}
                  onChange={(e) => setToLevel(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm font-bold text-rose-400"
                />
              </div>
            </div>

            {feedingResult && (
              <div className="p-4 rounded-xl bg-gradient-to-r from-rose-950/40 via-purple-950/30 to-slate-900 border border-rose-500/30 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 block">Tổng lượng thức ăn cần:</span>
                  <span className="text-xl font-extrabold text-rose-400 font-mono">
                    {feedingResult.formattedTotal} Food
                  </span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">
                    ({feedingResult.totalFeeds} lần cho ăn • 4 lần / level)
                  </span>
                </div>
                <Apple className="w-10 h-10 text-rose-400/80" />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
