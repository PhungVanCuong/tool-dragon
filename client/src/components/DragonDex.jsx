import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Search,
  Filter,
  Sparkles,
  Heart,
  Swords,
  Clock,
  Egg,
  Star,
  Zap
} from 'lucide-react';

export default function DragonDex() {
  const [dragons, setDragons] = useState([]);
  const [elements, setElements] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRarity, setSelectedRarity] = useState('ALL');
  const [selectedElement, setSelectedElement] = useState('ALL');

  // Stat previewer state
  const [previewLevel, setPreviewLevel] = useState(40);
  const [previewStars, setPreviewStars] = useState(0);

  useEffect(() => {
    fetchDragons();
    fetch('/api/database/elements')
      .then(res => res.json())
      .then(data => {
        if (data.success) setElements(data.elements);
      });
  }, [searchQuery, selectedRarity, selectedElement]);

  const fetchDragons = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.append('query', searchQuery);
    if (selectedRarity !== 'ALL') params.append('rarity', selectedRarity);
    if (selectedElement !== 'ALL') params.append('element', selectedElement);

    fetch(`/api/database/dragons?${params.toString()}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) setDragons(data.dragons);
      });
  };

  const getRarityBadge = (rarity) => {
    switch (rarity) {
      case 'H': return <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/30">HEROIC</span>;
      case 'M': return <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-rose-500/20 text-rose-300 border border-rose-500/30">MYTHIC</span>;
      case 'L': return <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-yellow-500/20 text-yellow-300 border border-yellow-500/30">LEGEND</span>;
      case 'E': return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">EPIC</span>;
      case 'VR': return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">V.RARE</span>;
      case 'R': return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">RARE</span>;
      default: return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-700 text-slate-300">COMMON</span>;
    }
  };

  const calculateScaledStat = (base, level, stars) => {
    const levelMultiplier = 1 + (level - 1) * 0.12;
    const starMultiplier = 1 + (stars * 0.38); // 38% stat boost per empower star
    return Math.round(base * levelMultiplier * starMultiplier);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-xl font-extrabold text-white flex items-center space-x-2">
          <BookOpen className="w-6 h-6 text-cyan-400" />
          <span>Bách khoa Toàn thư Rồng (Dragon Dex)</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Tra cứu toàn bộ thông số rồng, nguyên tố, kỹ năng đặc biệt và giả lập chỉ số HP/Attack theo cấp độ & số sao kích hoạt.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm rồng theo tên tiếng Anh hoặc tiếng Việt (Karma, Vampire, Apocalypse, Terra...)"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none"
          />
        </div>

        {/* Filter Rarity */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-slate-400 font-bold mr-1 flex items-center space-x-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Độ hiếm:</span>
          </span>
          {['ALL', 'H', 'M', 'L', 'E', 'VR', 'R', 'C'].map(r => (
            <button
              key={r}
              onClick={() => setSelectedRarity(r)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all border ${
                selectedRarity === r
                  ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {r === 'ALL' ? 'Tất cả' : r}
            </button>
          ))}
        </div>

        {/* Stat Previewer Controller */}
        <div className="pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs bg-slate-950/40 p-3 rounded-xl">
          <div className="flex items-center space-x-2">
            <span className="text-slate-400 font-bold">Giả lập Cấp độ:</span>
            <input
              type="range"
              min="1"
              max="70"
              value={previewLevel}
              onChange={(e) => setPreviewLevel(Number(e.target.value))}
              className="accent-cyan-500 w-32"
            />
            <span className="font-extrabold text-cyan-400 font-mono">Lv. {previewLevel}</span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-slate-400 font-bold">Sao kích hoạt:</span>
            <div className="flex items-center space-x-1">
              {[0, 1, 2, 3, 4, 5].map(st => (
                <button
                  key={st}
                  onClick={() => setPreviewStars(st)}
                  className={`w-6 h-6 rounded text-xs font-bold transition-all ${
                    previewStars === st
                      ? 'bg-amber-500 text-slate-950'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {st}★
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Dragon Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {dragons.map(dragon => {
          const scaledHp = calculateScaledStat(dragon.baseHp, previewLevel, previewStars);
          const scaledAtk = calculateScaledStat(dragon.baseAtk, previewLevel, previewStars);

          return (
            <div
              key={dragon.id}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all shadow-xl space-y-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      {getRarityBadge(dragon.rarity)}
                      <span className="text-[10px] text-slate-500 font-mono">Cat. {dragon.category}</span>
                    </div>
                    <h3 className="text-sm font-bold text-white">{dragon.name}</h3>
                    <p className="text-xs text-slate-400">{dragon.nameVi}</p>
                  </div>

                  <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 flex items-center justify-center text-2xl shrink-0">
                    🐲
                  </div>
                </div>

                {/* Elements */}
                <div className="flex flex-wrap gap-1 mt-3">
                  {dragon.elements.map(el => (
                    <span
                      key={el}
                      className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-950 border border-slate-800 text-cyan-300"
                    >
                      {el}
                    </span>
                  ))}
                </div>

                {/* Scaled Combat Stats */}
                <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-800/80 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center space-x-2">
                    <Heart className="w-4 h-4 text-rose-400" />
                    <div>
                      <span className="text-[10px] text-slate-500 block">HP (Máu)</span>
                      <span className="font-extrabold text-white font-mono">{scaledHp.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center space-x-2">
                    <Swords className="w-4 h-4 text-amber-400" />
                    <div>
                      <span className="text-[10px] text-slate-500 block">Tấn công</span>
                      <span className="font-extrabold text-white font-mono">{scaledAtk.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Special Skills */}
                {dragon.skills && (
                  <div className="mt-3 text-[11px] text-slate-400">
                    <span className="font-bold text-slate-300">Kỹ năng đặc biệt: </span>
                    <span className="text-purple-300">{dragon.skills.join(' • ')}</span>
                  </div>
                )}

                <p className="text-[11px] text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                  {dragon.description}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                <span>Ấp: {dragon.hatchTime} giờ</span>
                <span>Lai: {dragon.breedTime} giờ</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
