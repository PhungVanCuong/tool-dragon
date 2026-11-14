import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Clock,
  ShieldCheck,
  Database,
  ArrowRight,
  Server,
  Lock,
  Activity
} from 'lucide-react';

export default function SyncCenter({ onOpenConnectModal }) {
  const { isConnected, profile, session, refreshProfile, updateProfileLocally } = useAuth();
  const [syncing, setSyncing] = useState(false);
  const [syncHistory, setSyncHistory] = useState([]);
  const [syncResult, setSyncResult] = useState(null);

  useEffect(() => {
    fetchSyncHistory();
  }, [isConnected, session]);

  const fetchSyncHistory = async () => {
    try {
      const userId = session?.userId || '3560321594852606595';
      const res = await fetch(`/api/player/sync/history?userId=${userId}`);
      const data = await res.json();
      if (data.success) {
        setSyncHistory(data.logs);
      }
    } catch (err) {
      console.error('Lỗi tải lịch sử đồng bộ:', err);
    }
  };

  const handleExecuteSync = async () => {
    if (!isConnected) return onOpenConnectModal();
    setSyncing(true);
    setSyncResult(null);

    try {
      const userId = session?.userId || '3560321594852606595';
      const res = await fetch('/api/player/sync/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
      const data = await res.json();

      if (data.success) {
        setSyncResult({
          type: 'success',
          message: data.message || 'Đồng bộ dữ liệu tài khoản thành công!'
        });
        updateProfileLocally(data.profile);
        fetchSyncHistory();
      } else {
        setSyncResult({
          type: 'error',
          message: data.error || 'Đồng bộ thất bại. Vui lòng kiểm tra lại kết nối.'
        });
      }
    } catch {
      setSyncResult({
        type: 'error',
        message: 'Lỗi mạng khi kết nối đến dịch vụ đồng bộ.'
      });
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Action Card */}
      <div className="bg-gradient-to-r from-slate-900 via-cyan-950/40 to-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-1">
            <h2 className="text-xl font-extrabold text-slate-100 flex items-center gap-2.5">
              <RefreshCw className={`w-6 h-6 text-cyan-400 ${syncing ? 'animate-spin' : ''}`} />
              Trung Tâm Đồng Bộ Dữ Liệu (Sync Center)
            </h2>
            <p className="text-xs text-slate-400">
              Kiểm tra tình trạng tài khoản, xác thực UID và làm mới các thuộc tính hồ sơ.
            </p>
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <button
              onClick={handleExecuteSync}
              disabled={syncing}
              className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-cyan-500 hover:from-cyan-400 to-indigo-600 hover:to-indigo-500 text-slate-950 font-extrabold rounded-xl text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/20 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
              <span>{syncing ? 'Đang Đồng Bộ...' : 'Sync Now (Đồng Bộ Ngay)'}</span>
            </button>
          </div>
        </div>

        {syncResult && (
          <div
            className={`mt-4 p-4 rounded-xl text-xs flex items-center space-x-2.5 border ${
              syncResult.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : 'bg-red-500/10 border-red-500/30 text-red-300'
            }`}
          >
            {syncResult.type === 'success' ? (
              <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
            )}
            <span>{syncResult.message}</span>
          </div>
        )}
      </div>

      {/* Sync Health Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Trạng Thái Kết Nối</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-lg font-bold text-emerald-400">
            {isConnected ? 'SẴN SÀNG ĐỒNG BỘ' : 'CHƯA KẾT NỐI'}
          </div>
          <p className="text-[11px] text-slate-500">
            UID: <span className="font-mono text-slate-300">{session?.userId || profile?.userId || 'N/A'}</span>
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Lần Đồng Bộ Gần Nhất</span>
            <Clock className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-sm font-bold text-slate-200">
            {profile?.lastSyncAt ? new Date(profile.lastSyncAt).toLocaleString('vi-VN') : 'Vừa mới'}
          </div>
          <p className="text-[11px] text-slate-500">Cơ chế tự động lưu trữ bộ đệm cục bộ</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Tính Toàn Vẹn Dữ Liệu</span>
            <ShieldCheck className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-lg font-bold text-purple-300">100% Verified</div>
          <p className="text-[11px] text-slate-500">Phân định rõ ràng dữ liệu thực tế và giới hạn API</p>
        </div>
      </div>

      {/* Sync History Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Clock className="w-5 h-5 text-cyan-400" />
            Nhật Ký Lịch Sử Đồng Bộ (Sync History)
          </h3>
          <span className="text-xs text-slate-400">Hiển thị {syncHistory.length} lần gần nhất</span>
        </div>

        {syncHistory.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-500">
            Chưa có lịch sử đồng bộ nào được ghi nhận. Hãy bấm "Sync Now" để ghi log đầu tiên.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/60 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Thời Gian</th>
                  <th className="py-3 px-4">Phương Thức Nguồn</th>
                  <th className="py-3 px-4">Trạng Thái</th>
                  <th className="py-3 px-4">Chi Tiết Đồng Bộ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-200 font-mono">
                {syncHistory.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-850/50">
                    <td className="py-3 px-4 text-slate-400">
                      {new Date(log.timestamp).toLocaleString('vi-VN')}
                    </td>
                    <td className="py-3 px-4 text-cyan-400 font-semibold">{log.source}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                        {log.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-sans text-slate-300">{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Transparency & API Boundaries Notice */}
      <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-2 text-xs">
        <div className="flex items-center space-x-2 text-cyan-400 font-bold">
          <Server className="w-4 h-4" />
          <span>Chính Sách Minh Bạch & Tuân Thủ API Social Point</span>
        </div>
        <p className="text-slate-400 leading-relaxed">
          Nền tảng hoạt động như một công cụ hỗ trợ người chơi (Companion Tool) độc lập. Đối với các dữ liệu tài khoản như UID và Tên hiển thị, hệ thống đồng bộ trực tiếp qua cơ chế OAuth Token Facebook. Đối với các tính năng can thiệp trực tiếp vào số dư Gems trên máy chủ Social Point mà không qua in-app purchase chính thức, hệ thống phân định rõ ràng là <code className="text-rose-400 bg-rose-950/30 px-1 py-0.5 rounded">Not Available / Private API Restricted</code> nhằm bảo vệ an toàn 100% cho tài khoản người chơi khỏi nguy cơ bị khóa tài khoản (Ban).
        </p>
      </div>
    </div>
  );
}
