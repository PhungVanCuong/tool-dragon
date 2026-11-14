import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  History,
  Search,
  Filter,
  CheckCircle,
  AlertCircle,
  Clock,
  Trash2,
  Calendar
} from 'lucide-react';

export default function ActivityHistory() {
  const { isConnected, session, profile } = useAuth();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  useEffect(() => {
    fetchLogs();
  }, [isConnected, session]);

  const fetchLogs = async () => {
    try {
      const userId = session?.userId || '3560321594852606595';
      const res = await fetch(`/api/player/logs?userId=${userId}`);
      const data = await res.json();
      if (data.success) {
        setLogs(data.logs);
      }
    } catch (err) {
      console.error('Lỗi tải nhật ký:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch =
      (log.action && log.action.toLowerCase().includes(search.toLowerCase())) ||
      (log.message && log.message.toLowerCase().includes(search.toLowerCase()));
    const matchesCat = categoryFilter === 'ALL' || log.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <div>
          <h2 className="text-xl font-extrabold text-slate-100 flex items-center gap-2.5">
            <History className="w-6 h-6 text-purple-400" />
            Nhật Ký Thao Tác & Hoạt Động (Activity History)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Ghi vết toàn bộ hành động: Đăng nhập, đồng bộ, thêm rồng, thu hoạch nông trại và tính toán.
          </p>
        </div>

        <div className="text-xs text-slate-400 bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700">
          Tổng cộng: <strong className="text-cyan-400">{logs.length}</strong> nhật ký được lưu trữ
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-3 bg-slate-900/60 border border-slate-800 p-4 rounded-xl text-xs">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm kiếm nội dung hoạt động..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Category Filter */}
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-200 focus:outline-none focus:border-cyan-500"
        >
          <option value="ALL">Tất Cả Danh Mục</option>
          <option value="ACCOUNT">Tài Khoản (ACCOUNT)</option>
          <option value="SYNC">Đồng Bộ (SYNC)</option>
          <option value="COLLECTION">Bộ Sưu Tập (COLLECTION)</option>
          <option value="RESOURCE">Tài Nguyên (RESOURCE)</option>
          <option value="ISLAND">Đảo (ISLAND)</option>
        </select>
      </div>

      {/* Logs Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs text-slate-400">Đang tải nhật ký...</div>
        ) : filteredLogs.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500 space-y-2">
            <div className="text-3xl">📋</div>
            <p className="font-semibold text-slate-300">Không có nhật ký nào phù hợp</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/70 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">Thời Điểm</th>
                  <th className="py-3.5 px-4">Danh Mục</th>
                  <th className="py-3.5 px-4">Thao Tác</th>
                  <th className="py-3.5 px-4">Trạng Thái</th>
                  <th className="py-3.5 px-4">Mô Tả Chi Tiết</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-200">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-850/50 transition-colors">
                    <td className="py-3 px-4 font-mono text-slate-400 text-[11px] whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString('vi-VN')}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 text-[10px] font-bold">
                        {log.category || 'SYSTEM'}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono font-semibold text-cyan-400">
                      {log.action}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                        {log.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-300">{log.message}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
