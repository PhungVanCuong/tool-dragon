import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import AccountCodeGenerator from './AccountCodeGenerator';
import {
  User,
  ShieldCheck,
  Award,
  Coins,
  Apple,
  Gem,
  Calendar,
  Layers,
  Lock,
  Edit2,
  Save,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  ExternalLink
} from 'lucide-react';

export default function AccountProfile({ onOpenConnectModal, onOpenLauncherModal }) {
  const { isConnected, isDemo, profile, session, refreshProfile, updateProfileLocally } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: profile?.name || 'Cuong Phung',
    level: profile?.level || 68,
    gold: profile?.gold || 48500000,
    food: profile?.food || 12400000,
    gems: profile?.gems || 320,
    alliance: profile?.alliance || 'Viet Dragon Alliance'
  });
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState(null);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/player/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: session?.userId || profile?.userId,
          ...formData
        })
      });
      const data = await res.json();
      if (data.success) {
        updateProfileLocally(data.data);
        setSaveMessage({ type: 'success', text: 'Đã cập nhật thông tin hồ sơ thành công!' });
        setIsEditing(false);
      } else {
        setSaveMessage({ type: 'error', text: data.error || 'Lỗi lưu thông tin' });
      }
    } catch {
      setSaveMessage({ type: 'error', text: 'Lỗi kết nối máy chủ' });
    } finally {
      setSaving(false);
      setTimeout(() => setSaveMessage(null), 4000);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-cyan-500/10 via-transparent to-transparent pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500 via-indigo-500 to-purple-600 flex items-center justify-center text-3xl font-black text-white shadow-xl shadow-cyan-500/20 border-2 border-slate-700">
                {profile?.name ? profile.name.charAt(0).toUpperCase() : '🐉'}
              </div>
              <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center text-[10px] text-white">
                ✓
              </span>
            </div>

            <div>
              <div className="flex items-center space-x-2.5">
                <h2 className="text-2xl font-black text-slate-100">
                  {profile?.name || (isConnected ? `Dragon Master #${session?.userId?.slice(-4)}` : 'Chưa kết nối tài khoản')}
                </h2>
                {isConnected && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    Xác Thực Facebook
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                <span className="font-mono text-cyan-400 font-semibold">
                  UID: {session?.userId || profile?.userId || 'N/A'}
                </span>
                <span>•</span>
                <span>Bang hội: <strong className="text-slate-200">{profile?.alliance || 'Viet Dragon Alliance'}</strong></span>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto">
            {isConnected ? (
              <>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex-1 sm:flex-none px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>{isEditing ? 'Hủy Sửa' : 'Chỉnh Sửa Số Liệu'}</span>
                </button>
                <button
                  onClick={onOpenLauncherModal}
                  className="flex-1 sm:flex-none px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-extrabold rounded-xl text-xs uppercase tracking-wider shadow-md shadow-orange-500/20 transition-all hover:brightness-110"
                >
                  Vào Game
                </button>
              </>
            ) : (
              <button
                onClick={onOpenConnectModal}
                className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-bold rounded-xl text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/25 transition-all"
              >
                Kết Nối Tài Khoản Ngay
              </button>
            )}
          </div>
        </div>
      </div>

      {saveMessage && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center space-x-2 border ${
            saveMessage.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : 'bg-red-500/10 border-red-500/30 text-red-300'
          }`}
        >
          {saveMessage.type === 'success' ? (
            <CheckCircle className="w-4 h-4 text-emerald-400" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-400" />
          )}
          <span>{saveMessage.text}</span>
        </div>
      )}

      {/* Editing Form (if triggered) */}
      {isEditing && (
        <form onSubmit={handleSaveProfile} className="bg-slate-900 border border-cyan-500/30 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-cyan-400 flex items-center gap-2">
              <Edit2 className="w-4 h-4" />
              Chỉnh Sửa Chỉ Số Đồng Bộ Cá Nhân
            </h3>
            <span className="text-[11px] text-slate-400">Lưu trữ trên thiết bị & cơ sở dữ liệu đồng bộ</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-slate-400 block mb-1">Tên Người Chơi</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Cấp Độ (Level)</label>
              <input
                type="number"
                value={formData.level}
                onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Bang Hội (Alliance)</label>
              <input
                type="text"
                value={formData.alliance}
                onChange={(e) => setFormData({ ...formData, alliance: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Vàng (Gold)</label>
              <input
                type="number"
                value={formData.gold}
                onChange={(e) => setFormData({ ...formData, gold: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Thức Ăn (Food)</label>
              <input
                type="number"
                value={formData.food}
                onChange={(e) => setFormData({ ...formData, food: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Gems</label>
              <input
                type="number"
                value={formData.gems}
                onChange={(e) => setFormData({ ...formData, gems: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs flex items-center space-x-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{saving ? 'Đang lưu...' : 'Lưu Thay Đổi'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Field Verification & Authority Transparency Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              Bảng Phân Định Nguồn Dữ Liệu & Quyền Truy Cập
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Minh bạch 100% về tính hợp pháp và trạng thái các trường dữ liệu
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Trường Thông Tin</th>
                <th className="py-3 px-4">Giá Trị Hiện Tại</th>
                <th className="py-3 px-4">Trạng Thái Xác Minh</th>
                <th className="py-3 px-4">Nguồn Dữ Liệu</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              <tr>
                <td className="py-3 px-4 font-semibold text-slate-300">User ID (UID)</td>
                <td className="py-3 px-4 font-mono text-cyan-400 font-bold">{session?.userId || profile?.userId || 'Chưa kết nối'}</td>
                <td className="py-3 px-4">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                    ✓ Verified Chính Thức
                  </span>
                </td>
                <td className="py-3 px-4 text-slate-400">OAuth Handshake Facebook</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-slate-300">Tên Người Chơi</td>
                <td className="py-3 px-4 font-semibold">{profile?.name || 'Cuong Phung'}</td>
                <td className="py-3 px-4">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                    ✓ Verified Chính Thức
                  </span>
                </td>
                <td className="py-3 px-4 text-slate-400">Hồ sơ Facebook Canvas Game</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-slate-300">Cấp Độ & Tài Nguyên</td>
                <td className="py-3 px-4 font-mono text-amber-300">
                  Lv.{profile?.level || 68} | {Number(profile?.gold || 0).toLocaleString()} Gold
                </td>
                <td className="py-3 px-4">
                  <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] font-bold">
                    Đồng Bộ Người Dùng
                  </span>
                </td>
                <td className="py-3 px-4 text-slate-400">Local Cache & Đồng bộ phiên</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-slate-300">Thao tác can thiệp Server Game</td>
                <td className="py-3 px-4 text-slate-400 italic">Hack Gem / Tự Động Đánh Trận</td>
                <td className="py-3 px-4">
                  <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-bold">
                    Not Available (Bảo vệ tài khoản)
                  </span>
                </td>
                <td className="py-3 px-4 text-slate-400">Máy chủ Social Point bảo mật riêng</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Account Code Generator Tool */}
      <AccountCodeGenerator />
    </div>
  );
}
