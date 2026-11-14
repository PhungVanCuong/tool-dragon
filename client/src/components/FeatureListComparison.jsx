import React from 'react';
import {
  Scale,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Shield,
  Sparkles,
  Zap,
  Lock,
  Flame
} from 'lucide-react';

export default function FeatureListComparison() {
  const comparisonRows = [
    {
      feature: 'Quảng cáo & Pop-up',
      desc: 'Hiển thị quảng cáo chuyển hướng hoặc banners',
      vinaFull: { text: 'Nhiều (Linkvertise, Banner)', status: 'bad' },
      nullzerep: { text: 'Có (Chờ đợi, Linkvertise)', status: 'bad' },
      ourPlatform: { text: '100% Sạch sẽ, Không một dòng quảng cáo', status: 'best' }
    },
    {
      feature: 'Yêu cầu Key kích hoạt / Trả phí',
      desc: 'Bắt buộc vượt link lấy key mỗi vài giờ hoặc mua VIP',
      vinaFull: { text: 'Yêu cầu Security Key 6-12h', status: 'bad' },
      nullzerep: { text: 'Bán gói VIP, giới hạn lượt free', status: 'bad' },
      ourPlatform: { text: 'Miễn phí Vĩnh viễn, Không cần bất kỳ Key nào', status: 'best' }
    },
    {
      feature: 'Kết nối tài khoản Dragon City',
      desc: 'Nhập Connect My Dragon City Information',
      vinaFull: { text: 'Hỗ trợ URL / Session ID', status: 'good' },
      nullzerep: { text: 'Hỗ trợ Portal URL / Session', status: 'good' },
      ourPlatform: { text: 'Hỗ trợ Đa định dạng (URL, JSON, UID & SID)', status: 'best' }
    },
    {
      feature: 'Bảo mật mật khẩu người dùng',
      desc: 'Tuyệt đối không yêu cầu mật khẩu Facebook / Game',
      vinaFull: { text: 'Không hỏi mật khẩu', status: 'good' },
      nullzerep: { text: 'Không hỏi mật khẩu', status: 'good' },
      ourPlatform: { text: 'Không hỏi mật khẩu, Token chỉ lưu trên trình duyệt bạn', status: 'best' }
    },
    {
      feature: 'Chế độ Trải nghiệm Mẫu (Sandbox Demo)',
      desc: 'Cho phép dùng thử toàn bộ tính năng mà không cần tài khoản game thật',
      vinaFull: { text: 'Không hỗ trợ', status: 'bad' },
      nullzerep: { text: 'Không hỗ trợ', status: 'bad' },
      ourPlatform: { text: 'Có sẵn 1-Click Sandbox Demo đầy đủ dữ liệu', status: 'best' }
    },
    {
      feature: 'Trợ lý Đua Rồng Heroic Race',
      desc: 'Theo dõi Lap/Node, Dung lượng Bể (Pool) và Hẹn giờ Cooldown',
      vinaFull: { text: 'Cơ bản', status: 'neutral' },
      nullzerep: { text: 'Cơ bản', status: 'neutral' },
      ourPlatform: { text: 'Toàn diện: Lộ trình 25 Laps, Timer đếm ngược, Mẹo 0-Gems', status: 'best' }
    },
    {
      feature: 'Máy tính Phối giống & Lai ngược',
      desc: 'Tính toán tỷ lệ ra con, Sanctuary và tra cứu cặp bố mẹ tối ưu',
      vinaFull: { text: 'Giới hạn', status: 'neutral' },
      nullzerep: { text: 'Có hướng dẫn', status: 'neutral' },
      ourPlatform: { text: 'Đầy đủ: Lai xuôi, Lai ngược, Sanctuary 1-8, Empower Stars', status: 'best' }
    },
    {
      feature: 'Quản lý Tài nguyên & Nhà kính',
      desc: 'Thu hoạch thức ăn, kích hoạt boost +3h, dọn sạch đảo',
      vinaFull: { text: 'Có', status: 'good' },
      nullzerep: { text: 'Có', status: 'good' },
      ourPlatform: { text: 'Có với giao diện tương tác thời gian thực', status: 'best' }
    },
    {
      feature: 'Bách khoa toàn thư Rồng (Dex)',
      desc: 'Bộ lọc nguyên tố, độ hiếm, kỹ năng đặc biệt và giả lập HP/ATK',
      vinaFull: { text: 'Không đầy đủ', status: 'neutral' },
      nullzerep: { text: 'Danh sách thô', status: 'neutral' },
      ourPlatform: { text: 'Đầy đủ dữ liệu, giả lập Lv 1-70 & 0-5 Sao Kích hoạt', status: 'best' }
    },
    {
      feature: 'Giao diện & Trải nghiệm Di động',
      desc: 'Giao diện Gaming Dark Mode chuẩn hiện đại, mượt mà trên điện thoại',
      vinaFull: { text: 'Giao diện cổ điển, nhiều quảng cáo che mắt', status: 'bad' },
      nullzerep: { text: 'Giao diện cơ bản', status: 'neutral' },
      ourPlatform: { text: 'Gaming Dark Mode 2026, Responsive 100% Mobile & PC', status: 'best' }
    }
  ];

  const renderBadge = (item) => {
    if (item.status === 'best') {
      return (
        <div className="flex items-center space-x-1.5 text-cyan-400 font-bold text-xs">
          <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>{item.text}</span>
        </div>
      );
    }
    if (item.status === 'good') {
      return (
        <div className="flex items-center space-x-1.5 text-emerald-400 text-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{item.text}</span>
        </div>
      );
    }
    if (item.status === 'neutral') {
      return (
        <div className="flex items-center space-x-1.5 text-amber-400 text-xs">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{item.text}</span>
        </div>
      );
    }
    return (
      <div className="flex items-center space-x-1.5 text-rose-400 text-xs">
        <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
        <span>{item.text}</span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-xl font-extrabold text-white flex items-center space-x-2">
          <Scale className="w-6 h-6 text-indigo-400" />
          <span>Phân tích & So sánh Chức năng Nền tảng</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Bảng đối chiếu chi tiết giữa <strong>vina-full.com</strong>, <strong>nullzereptool.com</strong> và <strong>nền tảng mới này</strong>.
        </p>
      </div>

      {/* Comparison Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900 shadow-xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/80 text-xs font-bold uppercase tracking-wider">
              <th className="p-4 text-slate-300">Tính năng / Tiêu chí</th>
              <th className="p-4 text-slate-400">vina-full.com</th>
              <th className="p-4 text-slate-400">nullzereptool.com</th>
              <th className="p-4 text-cyan-400 bg-cyan-950/30 border-l border-r border-cyan-500/20">
                Nền tảng Mới (Bản này)
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80 text-xs">
            {comparisonRows.map((row, idx) => (
              <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                <td className="p-4">
                  <p className="font-bold text-white text-xs">{row.feature}</p>
                  <span className="text-[11px] text-slate-400 mt-0.5 block">{row.desc}</span>
                </td>
                <td className="p-4">{renderBadge(row.vinaFull)}</td>
                <td className="p-4">{renderBadge(row.nullzerep)}</td>
                <td className="p-4 bg-cyan-950/20 border-l border-r border-cyan-500/20">
                  {renderBadge(row.ourPlatform)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legal & Architectural Summary */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center space-x-2">
          <Shield className="w-5 h-5 text-emerald-400" />
          <span>Tính Hợp pháp, Độc lập và Tuân thủ Mã nguồn:</span>
        </h3>

        <div className="space-y-2 text-xs text-slate-400 leading-relaxed">
          <p>
            1. <strong>Mã nguồn độc lập 100%:</strong> Nền tảng được xây dựng từ đầu (From Scratch) bằng React, Vite, Tailwind CSS và Node.js/Express, không sao chép hay tái sử dụng bất kỳ tệp tin, mã nguồn đóng gói hoặc thương hiệu của hai website tham khảo.
          </p>
          <p>
            2. <strong>Bảo mật thông tin:</strong> Chúng tôi áp dụng quy chuẩn bảo mật không lưu trữ mã phiên (Session ID) trên bất kỳ cơ sở dữ liệu công khai nào; mọi thông tin kết nối chỉ lưu tạm thời trong bộ nhớ của trình duyệt người dùng.
          </p>
          <p>
            3. <strong>Không kiếm tiền từ người dùng:</strong> Toàn bộ tiện ích được cung cấp hoàn toàn phi lợi nhuận cho cộng đồng game thủ Dragon City tại Việt Nam và quốc tế, triệt tiêu hoàn toàn sự phiền toái từ quảng cáo độc hại và yêu cầu mua key VIP.
          </p>
        </div>
      </div>
    </div>
  );
}
