import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Shield,
  Star,
  Plus,
  Trash2,
  Heart,
  Search,
  Filter,
  Sparkles,
  Award,
  Layers
} from 'lucide-react';

const rarityColors = {
  H: 'from-amber-400 via-rose-500 to-purple-600 text-amber-300 border-amber-500/50',
  M: 'from-purple-500 to-indigo-600 text-purple-300 border-purple-500/50',
  L: 'from-yellow-400 to-amber-600 text-yellow-300 border-yellow-500/50',
  E: 'from-teal-400 to-emerald-600 text-teal-300 border-teal-500/50',
  VR: 'from-cyan-400 to-blue-600 text-cyan-300 border-cyan-500/50',
  R: 'from-slate-400 to-slate-600 text-slate-300 border-slate-500/50',
  C: 'from-stone-400 to-stone-600 text-stone-300 border-stone-500/50'
};

const elementIcons = {
  terra: '🌍',
  flame: '🔥',
  sea: '💧',
  nature: '🍃',
  electric: '⚡',
  ice: '❄️',
  metal: '🔩',
  dark: '🌑',
  light: '✨',
  war: '⚔️',
  pure: '💎',
  legend: '👑',
  chaos: '🌀',
  magic: '🔮',
  time: '⏳'
};

export default function DragonCollection({ onOpenConnectModal }) {
  const { isConnected, session } = useAuth();
  const [collection, setCollection] = useState([]);
  const [allDragons, setAllDragons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedRarity, setSelectedRarity] = useState('ALL');
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedDragonToAdd, setSelectedDragonToAdd] = useState('');
  const [addLevel, setAddLevel] = useState(30);
  const [addStars, setAddStars] = useState(0);

  useEffect(() => {
    fetchCollection();
    fetchAllDragons();
  }, [isConnected, session]);

  const fetchCollection = async () => {
    try {
      const userId = session?.userId || '3560321594852606595';
      const res = await fetch(`/api/player/collection?userId=${userId}`);
      const data = await res.json();
      if (data.success) {
        setCollection(data.collection);
      }
    } catch (err) {
      console.error('Lỗi tải bộ sưu tập:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllDragons = async () => {
    try {
      const res = await fetch('/api/database/dragons');
      const data = await res.json();
      if (data.success) {
        setAllDragons(data.dragons);
      }
    } catch (err) {
      console.error('Lỗi tải danh mục rồng:', err);
    }
  };

  const handleToggleFavorite = async (dragonId) => {
    try {
      const userId = session?.userId || '3560321594852606595';
      const res = await fetch(`/api/player/collection/${dragonId}/favorite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
      const data = await res.json();
      if (data.success) {
        setCollection(prev =>
          prev.map(d => (d.dragonId === dragonId ? { ...d, isFavorite: data.isFavorite } : d))
        );
      }
    } catch (err) {
      console.error('Lỗi toggle favorite:', err);
    }
  };

  const handleRemove = async (dragonId) => {
    if (!confirm('Bạn có chắc muốn xóa rồng này khỏi bộ sưu tập?')) return;
    try {
      const userId = session?.userId || '3560321594852606595';
      const res = await fetch(`/api/player/collection/${dragonId}?userId=${userId}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        setCollection(data.collection);
      }
    } catch (err) {
      console.error('Lỗi xóa rồng:', err);
    }
  };

  const handleAddDragon = async (e) => {
    e.preventDefault();
    if (!selectedDragonToAdd) return;
    try {
      const userId = session?.userId || '3560321594852606595';
      const res = await fetch('/api/player/collection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          dragonId: selectedDragonToAdd,
          level: addLevel,
          stars: addStars
        })
      });
      const data = await res.json();
      if (data.success) {
        setCollection(data.collection);
        setAddModalOpen(false);
        setSelectedDragonToAdd('');
      }
    } catch (err) {
      console.error('Lỗi thêm rồng:', err);
    }
  };

  const filteredCollection = collection.filter(d => {
    const matchesSearch =
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      (d.nameVi && d.nameVi.toLowerCase().includes(search.toLowerCase()));
    const matchesRarity = selectedRarity === 'ALL' || d.rarity === selectedRarity;
    const matchesFav = !onlyFavorites || d.isFavorite;
    return matchesSearch && matchesRarity && matchesFav;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <div>
          <h2 className="text-xl font-extrabold text-slate-100 flex items-center gap-2.5">
            <Shield className="w-6 h-6 text-cyan-400" />
            Bộ Sưu Tập Rồng Cá Nhân
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Tổng cộng: <strong className="text-cyan-400">{collection.length}</strong> rồng đang sở hữu trong hồ sơ
          </p>
        </div>

        <button
          onClick={() => setAddModalOpen(true)}
          className="px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold rounded-xl text-xs flex items-center space-x-2 shadow-lg shadow-cyan-500/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Rồng Sở Hữu</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-3 bg-slate-900/60 border border-slate-800 p-4 rounded-xl text-xs">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm kiếm rồng theo tên Anh hoặc Việt..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Rarity filter */}
        <select
          value={selectedRarity}
          onChange={(e) => setSelectedRarity(e.target.value)}
          className="px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-200 focus:outline-none focus:border-cyan-500"
        >
          <option value="ALL">Mọi Độ Hiếm</option>
          <option value="H">Heroic (H)</option>
          <option value="M">Mythical (M)</option>
          <option value="L">Legendary (L)</option>
          <option value="E">Epic (E)</option>
          <option value="VR">Very Rare (VR)</option>
        </select>

        {/* Favorite toggle button */}
        <button
          onClick={() => setOnlyFavorites(!onlyFavorites)}
          className={`px-3 py-2 rounded-xl flex items-center space-x-1.5 transition-colors border ${
            onlyFavorites
              ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
              : 'bg-slate-950 border-slate-700 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Heart className={`w-3.5 h-3.5 ${onlyFavorites ? 'fill-current' : ''}`} />
          <span>Rồng Yêu Thích</span>
        </button>
      </div>

      {/* Dragon Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(n => (
            <div key={n} className="h-48 bg-slate-900 animate-pulse rounded-2xl border border-slate-800" />
          ))}
        </div>
      ) : filteredCollection.length === 0 ? (
        <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
          <div className="text-4xl">🐉</div>
          <p className="text-sm text-slate-300 font-semibold">Chưa có rồng nào phù hợp với bộ lọc</p>
          <p className="text-xs text-slate-500">Hãy thử đổi từ khóa tìm kiếm hoặc nhấn Thêm Rồng Sở Hữu.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredCollection.map((dragon) => (
            <div
              key={dragon.dragonId}
              className="bg-slate-900/90 border border-slate-800 hover:border-cyan-500/40 rounded-2xl p-4 transition-all hover:shadow-xl hover:shadow-cyan-500/5 group relative flex flex-col justify-between"
            >
              {/* Top Bar inside card */}
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border bg-gradient-to-r ${
                    rarityColors[dragon.rarity] || 'from-slate-600 to-slate-800 text-white'
                  }`}
                >
                  {dragon.rarity}
                </span>

                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => handleToggleFavorite(dragon.dragonId)}
                    className="p-1.5 text-slate-400 hover:text-rose-400 transition-colors"
                  >
                    <Heart className={`w-4 h-4 ${dragon.isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
                  </button>
                  <button
                    onClick={() => handleRemove(dragon.dragonId)}
                    className="p-1.5 text-slate-500 hover:text-red-400 transition-colors"
                    title="Xóa khỏi bộ sưu tập"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Elements & Avatar */}
              <div className="flex items-center space-x-3 my-2">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-tr from-cyan-950 via-slate-900 to-indigo-950 border border-slate-700 flex items-center justify-center text-2xl shadow-inner">
                  🐉
                </div>
                <div className="flex-1 overflow-hidden">
                  <h4 className="text-sm font-bold text-slate-100 truncate group-hover:text-cyan-400 transition-colors">
                    {dragon.nameVi || dragon.name}
                  </h4>
                  <div className="text-[11px] text-slate-400 truncate">{dragon.name}</div>
                  <div className="flex items-center gap-1 mt-1 text-xs">
                    {dragon.elements?.map(el => (
                      <span key={el} title={el}>
                        {elementIcons[el] || '✨'}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Stats Footer */}
              <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-1 text-amber-400 font-semibold font-mono">
                  <Award className="w-3.5 h-3.5" />
                  <span>Lv.{dragon.level || 30}</span>
                </div>

                {/* Stars */}
                <div className="flex items-center text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3 h-3 ${
                        i < (dragon.stars || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-slate-700'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Dragon Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-cyan-500/30 rounded-2xl w-full max-w-md p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Plus className="w-4 h-4 text-cyan-400" />
              Thêm Rồng Vào Bộ Sưu Tập
            </h3>

            <form onSubmit={handleAddDragon} className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Chọn Rồng</label>
                <select
                  value={selectedDragonToAdd}
                  onChange={(e) => setSelectedDragonToAdd(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                >
                  <option value="">-- Chọn rồng từ cơ sở dữ liệu --</option>
                  {allDragons.map(d => (
                    <option key={d.id} value={d.id}>
                      [{d.rarity}] {d.nameVi || d.name} ({d.name})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Cấp Độ (Level)</label>
                  <input
                    type="number"
                    min="1"
                    max="70"
                    value={addLevel}
                    onChange={(e) => setAddLevel(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Số Sao (Stars)</label>
                  <select
                    value={addStars}
                    onChange={(e) => setAddStars(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="0">0 Sao</option>
                    <option value="1">1 Sao ⭐</option>
                    <option value="2">2 Sao ⭐⭐</option>
                    <option value="3">3 Sao ⭐⭐⭐</option>
                    <option value="4">4 Sao ⭐⭐⭐⭐</option>
                    <option value="5">5 Sao ⭐⭐⭐⭐⭐</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs"
                >
                  Thêm Ngay
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
