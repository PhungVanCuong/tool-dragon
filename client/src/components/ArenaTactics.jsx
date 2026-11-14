import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Swords,
  Shield,
  Zap,
  Sparkles,
  Trophy,
  CheckCircle,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';

export default function ArenaTactics({ onOpenConnectModal }) {
  const { isConnected, profile, updateProfileLocally } = useAuth();
  const [dragonsList, setDragonsList] = useState([]);
  const [elementsList, setElementsList] = useState([]);

  // Opponents selection
  const [opp1, setOpp1] = useState('h_master_karma');
  const [opp2, setOpp2] = useState('m_prideful_vampire');
  const [opp3, setOpp3] = useState('l_apocalypse');
  const [counterResults, setCounterResults] = useState(null);
  const [counterLoading, setCounterLoading] = useState(false);

  // Selected element for matrix viewer
  const [selectedElem, setSelectedElem] = useState('pure');

  // Battle simulator state
  const [battleLoading, setBattleLoading] = useState(false);
  const [battleReport, setBattleReport] = useState(null);

  useEffect(() => {
    Promise.all([
      fetch('/api/database/dragons').then(res => res.json()),
      fetch('/api/database/elements').then(res => res.json())
    ]).then(([dData, eData]) => {
      if (dData.success) setDragonsList(dData.dragons);
      if (eData.success) setElementsList(eData.elements);
    });
  }, []);

  const handleAnalyzeCounters = async () => {
    setCounterLoading(true);
    try {
      const res = await fetch('/api/tools/arena/counter-pick', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ opponentDragonIds: [opp1, opp2, opp3].filter(Boolean) })
      });
      const data = await res.json();
      if (data.success) {
        setCounterResults(data);
      }
    } catch (err) {
      console.error('Lỗi phân tích khắc chế:', err);
    } finally {
      setCounterLoading(false);
    }
  };

  const handleSimulateArena = async () => {
    if (!isConnected) return onOpenConnectModal();
    setBattleLoading(true);
    try {
      const res = await fetch('/api/tools/arena/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: profile?.userId,
          myTeam: ['h_master_karma', 'h_corrupted_time', 'm_blood_god_vampire'],
          opponentTeam: [opp1, opp2, opp3]
        })
      });
      const data = await res.json();
      if (data.success) {
        setBattleReport(data);
        updateProfileLocally(prev => ({
          ...prev,
          arena: {
            ...prev.arena,
            trophies: data.newTrophies,
            winStreak: data.winStreak
          }
        }));
      }
    } catch (err) {
      console.error('Lỗi mô phỏng trận đánh:', err);
    } finally {
      setBattleLoading(false);
    }
  };

  useEffect(() => {
    handleAnalyzeCounters();
  }, [opp1, opp2, opp3]);

  const activeElementData = elementsList.find(e => e.id === selectedElem) || elementsList[0];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-xl font-extrabold text-white flex items-center space-x-2">
          <Swords className="w-6 h-6 text-orange-400" />
          <span>Chiến thuật Đấu trường & Khắc chế Nguyên tố</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Hệ thống đề xuất đội hình khắc chế sát thương x2, giảm thiểu sát thương nhận vào và phân tích tương khắc nguyên tố.
        </p>
      </div>

      {/* Opponent Selection & Counter Pick Advisor */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/20">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Đội hình Đối thủ (Opponent Squad)</h2>
              <p className="text-xs text-slate-400">Chọn 3 rồng trong đội hình đối thủ để tìm quân khắc chế</p>
            </div>
          </div>
          <button
            onClick={handleAnalyzeCounters}
            disabled={counterLoading}
            className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 font-bold text-xs shadow-md shadow-orange-500/20 transition-all shrink-0"
          >
            {counterLoading ? 'Đang phân tích...' : 'Phân tích Đối sách'}
          </button>
        </div>

        {/* 3 Opponents Selectors */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { label: 'Đối thủ 1 (Tiên phong)', val: opp1, set: setOpp1 },
            { label: 'Đối thủ 2 (Trung phong)', val: opp2, set: setOpp2 },
            { label: 'Đối thủ 3 (Hậu vệ)', val: opp3, set: setOpp3 }
          ].map((slot, idx) => (
            <div key={idx} className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-slate-300 block">{slot.label}:</span>
              <select
                value={slot.val}
                onChange={(e) => slot.set(e.target.value)}
                className="w-full px-2.5 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:border-orange-500 focus:outline-none"
              >
                {dragonsList.map(d => (
                  <option key={d.id} value={d.id}>
                    [{d.rarity}] {d.name} ({d.elements[0].toUpperCase()})
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>

        {/* Counter Recommendations Display */}
        {counterResults?.recommendations && (
          <div className="space-y-4 pt-2">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Đề xuất Khắc chế Từng Vị trí:</span>
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {counterResults.recommendations.map((rec, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 shadow-md"
                >
                  <div className="border-b border-slate-800/80 pb-2">
                    <span className="text-[10px] text-slate-500 block">Khắc chế:</span>
                    <h4 className="text-xs font-bold text-orange-400">
                      {rec.opponent.name} ({rec.opponent.primaryElement.toUpperCase()})
                    </h4>
                    <span className="text-[10px] text-slate-400">
                      Điểm yếu nhận x2: {rec.opponent.vulnerabilities.join(', ')}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {rec.topCounters.map((counter, cIdx) => (
                      <div
                        key={cIdx}
                        className="p-2.5 rounded-lg bg-slate-900 border border-slate-800/60 flex items-center justify-between text-xs"
                      >
                        <div>
                          <p className="font-bold text-white text-[11px]">{counter.name}</p>
                          <span className="text-[10px] text-emerald-400">
                            Chí mạng x2 • {counter.incomingDamage}
                          </span>
                        </div>
                        <span className="text-[11px] font-mono font-bold text-cyan-400">
                          {counter.counterEffectivenessScore} điểm
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Arena Battle Simulator Action */}
        <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <span className="text-xs font-bold text-white block">Thử nghiệm Đấu trường với đội hình đề xuất</span>
            <span className="text-[11px] text-slate-400">Mô phỏng tỷ lệ chiến thắng và cộng Cúp trực tiếp</span>
          </div>

          <button
            onClick={handleSimulateArena}
            disabled={battleLoading}
            className="w-full sm:w-auto px-5 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-lg shadow-orange-500/20 transition-all disabled:opacity-50"
          >
            {battleLoading ? 'Đang giao tranh...' : 'Giao chiến Ngay (Simulate)'}
          </button>
        </div>

        {battleReport && (
          <div className={`p-4 rounded-xl border text-xs font-bold flex items-center space-x-3 ${
            battleReport.victory ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-red-500/10 border-red-500/30 text-red-300'
          }`}>
            <Trophy className="w-5 h-5 shrink-0" />
            <span>{battleReport.message}</span>
          </div>
        )}
      </div>

      {/* Elemental Advantage Matrix Viewer */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Bảng Tra cứu Tương khắc 20 Nguyên tố</h2>
              <p className="text-xs text-slate-400">Bấm vào bất kỳ nguyên tố nào để xem bảng sát thương chí mạng x2</p>
            </div>
          </div>
        </div>

        {/* Elements Grid Selector */}
        <div className="flex flex-wrap gap-1.5">
          {elementsList.map(elem => (
            <button
              key={elem.id}
              onClick={() => setSelectedElem(elem.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border flex items-center space-x-1.5 ${
                selectedElem === elem.id
                  ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 shadow-md shadow-cyan-500/20 scale-105'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <span>{elem.icon}</span>
              <span>{elem.name}</span>
            </button>
          ))}
        </div>

        {/* Selected Element Detail */}
        {activeElementData && (
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <span className="text-[10px] text-slate-500 uppercase font-mono block">Nguyên tố</span>
              <div className="flex items-center space-x-2">
                <span className="text-2xl">{activeElementData.icon}</span>
                <span className="text-lg font-extrabold text-white">{activeElementData.name} ({activeElementData.nameVi})</span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] text-emerald-400 uppercase font-mono block font-bold">
                Gây Sát thương x2 (Chí mạng lên):
              </span>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {activeElementData.strongAgainst?.map(id => (
                  <span key={id} className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                    {id.toUpperCase()}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] text-red-400 uppercase font-mono block font-bold">
                Bị Khắc chế (Nhận x2 từ):
              </span>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {activeElementData.weakTo?.map(id => (
                  <span key={id} className="px-2 py-0.5 rounded bg-red-500/20 text-red-300 text-xs font-bold border border-red-500/30">
                    {id.toUpperCase()}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
