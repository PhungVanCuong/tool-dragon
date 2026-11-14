import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Settings,
  Moon,
  Sun,
  Play,
  Bell,
  RefreshCw,
  Trash2,
  CheckCircle,
  Shield,
  Save
} from 'lucide-react';

export default function SettingsView({ darkMode, setDarkMode }) {
  const { session, profile, disconnect } = useAuth();
  const [settings, setSettings] = useState({
    theme: darkMode ? 'dark' : 'light',
    autoSync: false,
    syncIntervalMinutes: 30,
    notificationsEnabled: true,
    launcherPreference: 'auto'
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const userId = session?.userId || '3560321594852606595';
      const res = await fetch(`/api/player/settings?userId=${userId}`);
      const data = await res.json();
      if (data.success && data.settings) {
        setSettings(data.settings);
      }
    } catch (err) {
      console.error('Lỗi tải settings:', err);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const userId = session?.userId || '3560321594852606595';
      const res = await fetch('/api/player/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, settings })
      });
      const data = await res.json();
      if (data.success) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (err) {
      console.error('Lỗi lưu cài đặt:', err);
    }
  };

  const handleClearCache = () => {
    if (confirm('Bạn có chắc muốn xóa bộ nhớ đệm trình duyệt và đăng xuất?')) {
      disconnect();
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-100 flex items-center gap-2.5">
            <Settings className="w-6 h-6 text-indigo-400" />
            Cài Đặt Hệ Thống (Settings)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Tùy biến giao diện, phương thức khởi chạy game và chu kỳ đồng bộ dữ liệu.
          </p>
        </div>

        {saved && (
          <div className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center space-x-1.5">
            <CheckCircle className="w-4 h-4" />
            <span>Đã lưu cài đặt!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Appearance Settings */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-3">
            <Sun className="w-4 h-4 text-amber-400" />
            Giao Diện & Hiển Thị
          </h3>

          <div className="space-y-3">
            <div>
              <label className="text-xs text-slate-400 block mb-1.5">Chế Độ Màu Sắc</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setDarkMode(true);
                    setSettings({ ...settings, theme: 'dark' });
                  }}
                  className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center space-x-2 transition-all ${
                    darkMode
                      ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  <Moon className="w-4 h-4" />
                  <span>Giao Diện Tối (Dark)</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setDarkMode(false);
                    setSettings({ ...settings, theme: 'light' });
                  }}
                  className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center space-x-2 transition-all ${
                    !darkMode
                      ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  <Sun className="w-4 h-4" />
                  <span>Giao Diện Sáng (Light)</span>
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Tùy Chọn Thông Báo</label>
              <label className="flex items-center space-x-2 text-xs text-slate-300 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={settings.notificationsEnabled}
                  onChange={(e) => setSettings({ ...settings, notificationsEnabled: e.target.checked })}
                  className="rounded border-slate-700 bg-slate-950 text-cyan-500 focus:ring-0"
                />
                <span>Bật thông báo Toast khi hoàn thành thao tác</span>
              </label>
            </div>
          </div>
        </div>

        {/* Launcher Preference */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-3">
            <Play className="w-4 h-4 text-emerald-400" />
            Cấu Hình Mở Game (Game Launcher)
          </h3>

          <div className="space-y-3">
            <div>
              <label className="text-xs text-slate-400 block mb-1.5">Ưu Tiên Khởi Chạy Mặc Định</label>
              <select
                value={settings.launcherPreference}
                onChange={(e) => setSettings({ ...settings, launcherPreference: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
              >
                <option value="auto">Tự Động Nhận Diện Thiết Bị (Khuyên Dùng)</option>
                <option value="deep_link">Giao Thức Deep Link (dragoncity://)</option>
                <option value="windows_store">Microsoft Store (Windows App)</option>
                <option value="web">Trình Duyệt Web (Facebook Canvas)</option>
                <option value="google_play">Google Play Store (Android)</option>
                <option value="app_store">Apple App Store (iOS)</option>
              </select>
              <p className="text-[11px] text-slate-400 mt-1">
                Khi nhấn "Open Dragon City", hệ thống sẽ kích hoạt phương thức này đầu tiên.
              </p>
            </div>

            <div className="pt-2">
              <label className="text-xs text-slate-400 block mb-1">Tự Động Đồng Bộ (Auto Sync)</label>
              <label className="flex items-center space-x-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.autoSync}
                  onChange={(e) => setSettings({ ...settings, autoSync: e.target.checked })}
                  className="rounded border-slate-700 bg-slate-950 text-cyan-500 focus:ring-0"
                />
                <span>Tự động làm mới dữ liệu tài khoản khi mở trang web</span>
              </label>
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div className="md:col-span-2 flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={handleClearCache}
            className="px-4 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Xóa Cache & Đăng Xuất</span>
          </button>

          <button
            type="submit"
            className="px-6 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs flex items-center space-x-2 shadow-lg shadow-cyan-500/20 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Lưu Toàn Bộ Cài Đặt</span>
          </button>
        </div>
      </form>
    </div>
  );
}
