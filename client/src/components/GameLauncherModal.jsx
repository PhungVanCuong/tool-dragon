import React, { useState, useEffect } from 'react';
import {
  ExternalLink,
  Play,
  Monitor,
  Smartphone,
  Globe,
  Download,
  AlertCircle,
  CheckCircle,
  X,
  Sparkles
} from 'lucide-react';

export default function GameLauncherModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const [deviceType, setDeviceType] = useState('windows');
  const [launchStatus, setLaunchStatus] = useState(null);

  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    if (/android/i.test(userAgent)) {
      setDeviceType('android');
    } else if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
      setDeviceType('ios');
    } else if (/Macintosh|Mac OS X/i.test(userAgent)) {
      setDeviceType('mac');
    } else {
      setDeviceType('windows');
    }
  }, []);

  const handleLaunchDeepLink = (protocolUrl, fallbackUrl) => {
    setLaunchStatus({
      type: 'info',
      message: 'Đang gửi tín hiệu mở ứng dụng Dragon City trên thiết bị...'
    });

    const start = Date.now();
    window.location.href = protocolUrl;

    setTimeout(() => {
      // If user is still on the webpage after 2 seconds, prompt fallback
      if (Date.now() - start < 2600) {
        setLaunchStatus({
          type: 'warning',
          message: 'Không tìm thấy ứng dụng cục bộ được cài đặt hoặc trình duyệt đã chặn giao thức. Bạn có thể mở phiên bản Web hoặc Tải từ Cửa hàng bên dưới.'
        });
      } else {
        setLaunchStatus({
          type: 'success',
          message: 'Đã mở ứng dụng Dragon City thành công!'
        });
      }
    }, 2000);
  };

  const handleOpenStore = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-slate-900 border border-cyan-500/30 rounded-2xl shadow-2xl shadow-cyan-500/10 overflow-hidden text-slate-100">
        {/* Header with Dragon City Banner */}
        <div className="relative p-6 bg-gradient-to-r from-cyan-900/60 via-indigo-900/60 to-purple-900/60 border-b border-slate-800">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-2xl shadow-lg shadow-orange-500/20">
              🐉
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-300 to-yellow-200">
                MỞ TRÒ CHƠI DRAGON CITY
              </h3>
              <p className="text-xs text-slate-300">
                Nhận diện thiết bị: <span className="font-semibold text-cyan-400 uppercase">{deviceType}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {launchStatus && (
            <div
              className={`p-3.5 rounded-xl text-xs flex items-start space-x-2.5 border ${
                launchStatus.type === 'success'
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : launchStatus.type === 'warning'
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                  : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300'
              }`}
            >
              {launchStatus.type === 'success' ? (
                <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-emerald-400" />
              ) : (
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-400" />
              )}
              <div className="leading-relaxed">{launchStatus.message}</div>
            </div>
          )}

          {/* Primary Action Button (Deep Link) */}
          <div className="bg-slate-800/60 rounded-xl p-4 border border-slate-700/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Khuyên dùng (Deep Link)
              </span>
              <span className="text-[11px] text-slate-400">Ứng dụng đã cài đặt</span>
            </div>

            <button
              onClick={() => handleLaunchDeepLink('dragoncity://', 'https://apps.facebook.com/dragoncity/')}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-cyan-500 hover:from-cyan-400 via-indigo-500 hover:via-indigo-400 to-purple-600 hover:to-purple-500 text-white font-bold rounded-xl shadow-lg shadow-cyan-500/25 flex items-center justify-center space-x-2 text-sm transition-all transform hover:-translate-y-0.5"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>Khởi Chạy Dragon City Ngay</span>
            </button>
            <p className="text-[11px] text-slate-400 text-center">
              Tự động gọi giao thức <code className="text-cyan-300 bg-slate-900 px-1 py-0.5 rounded">dragoncity://</code> để chuyển thẳng vào game.
            </p>
          </div>

          {/* Multi-platform choices */}
          <div className="space-y-2">
            <div className="text-xs font-semibold text-slate-300">Hoặc chọn phương thức phù hợp:</div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Windows Microsoft Store */}
              <button
                onClick={() => handleOpenStore('ms-windows-store://pdp/?ProductId=9WZDNCRFJ0PH')}
                className="flex items-center space-x-3 p-3 bg-slate-800/80 hover:bg-slate-750 border border-slate-700 hover:border-cyan-500/40 rounded-xl transition-all text-left group"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Monitor className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-200">Microsoft Store</div>
                  <div className="text-[10px] text-slate-400">Dành cho Windows PC</div>
                </div>
              </button>

              {/* Web / Facebook Canvas */}
              <button
                onClick={() => handleOpenStore('https://apps.facebook.com/dragoncity/')}
                className="flex items-center space-x-3 p-3 bg-slate-800/80 hover:bg-slate-750 border border-slate-700 hover:border-cyan-500/40 rounded-xl transition-all text-left group"
              >
                <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Globe className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-200">Facebook Web Game</div>
                  <div className="text-[10px] text-slate-400">Chơi trên trình duyệt</div>
                </div>
              </button>

              {/* Google Play Store */}
              <button
                onClick={() => handleOpenStore('https://play.google.com/store/apps/details?id=es.socialpoint.DragonCity')}
                className="flex items-center space-x-3 p-3 bg-slate-800/80 hover:bg-slate-750 border border-slate-700 hover:border-cyan-500/40 rounded-xl transition-all text-left group"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-200">Google Play Store</div>
                  <div className="text-[10px] text-slate-400">Android APK & App</div>
                </div>
              </button>

              {/* iOS App Store */}
              <button
                onClick={() => handleOpenStore('https://apps.apple.com/app/dragon-city-mobile/id561949265')}
                className="flex items-center space-x-3 p-3 bg-slate-800/80 hover:bg-slate-750 border border-slate-700 hover:border-cyan-500/40 rounded-xl transition-all text-left group"
              >
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Download className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-200">Apple App Store</div>
                  <div className="text-[10px] text-slate-400">iOS iPhone / iPad</div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <span>Phiên bản tích hợp mở game v2.0</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
          >
            Đóng lại
          </button>
        </div>
      </div>
    </div>
  );
}
