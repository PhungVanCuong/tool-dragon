import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  KeyRound,
  ExternalLink,
  Copy,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  LogIn,
  Check
} from 'lucide-react';

export default function AccountCodeGenerator({ onLoginSuccess }) {
  const { connectAccount, connectDemo, loading } = useAuth();
  
  // Top Login state
  const [inputCode, setInputCode] = useState('');
  const [topLoginError, setTopLoginError] = useState('');
  const [topLoginLoading, setTopLoginLoading] = useState(false);

  // Generator state
  const [pastedUrl, setPastedUrl] = useState('');
  const [genLoading, setGenLoading] = useState(false);
  const [genError, setGenError] = useState('');
  const [generatedResult, setGeneratedResult] = useState(null);
  const [copied, setCopied] = useState(false);

  // The official Facebook GDP Consent URL provided by the user
  const dragonCityConsentUrl = 'https://www.facebook.com/privacy/consent/?flow=gdp&params%5Bapp_id%5D=302826159782423&params%5Blogger_id%5D=%2276d796e8-f8db-4cc9-82b2-17df42458217%22&params%5Bnext%5D=%22confirm%22&params%5Bredirect_uri%5D=%22https%3A%5C%2F%5C%2Fapps.facebook.com%5C%2Fdragoncity%5C%2F%22&params%5Bresponse_type%5D=%22token%22&params%5Bscope%5D=%5B%5D&params%5Bsteps%5D=%7B%7D&params%5Bcui_gk%5D=%22%5BPASS%5D%3Aconfirm%22&source=gdp_delegated&cache_buster=-3052863555976499671';

  // Handle Top Form Submit (Login with Code or Direct URL)
  const handleTopLogin = async (e) => {
    if (e) e.preventDefault();
    setTopLoginError('');
    if (!inputCode.trim()) {
      setTopLoginError('Vui lòng nhập Code hoặc dán đường dẫn tài khoản.');
      return;
    }

    setTopLoginLoading(true);
    const res = await connectAccount(inputCode.trim());
    setTopLoginLoading(false);

    if (res.success) {
      if (onLoginSuccess) onLoginSuccess();
    } else {
      setTopLoginError(res.error || 'Mã không hợp lệ. Vui lòng kiểm tra lại hoặc tạo mã mới bên dưới.');
    }
  };

  // Handle Step 6: Generate Code from Facebook Redirect URL
  const handleGenerateCode = async (e) => {
    e.preventDefault();
    setGenError('');
    setGeneratedResult(null);

    if (!pastedUrl.trim()) {
      setGenError('Vui lòng dán toàn bộ đường dẫn URL ở Step 5.');
      return;
    }

    setGenLoading(true);
    try {
      const res = await fetch('/api/auth/get-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ urlOrToken: pastedUrl.trim() })
      });
      const data = await res.json();
      setGenLoading(false);

      if (data.success) {
        setGeneratedResult(data);
        // Automatically put the code into the top input for convenience
        setInputCode(data.code);
      } else {
        setGenError(data.error || 'Không thể tạo mã. Hãy đảm bảo bạn đã copy toàn bộ link chứa access_token.');
      }
    } catch {
      setGenLoading(false);
      setGenError('Lỗi kết nối máy chủ khi tạo mã. Vui lòng thử lại.');
    }
  };

  const handleCopyCode = () => {
    if (!generatedResult?.code) return;
    navigator.clipboard.writeText(generatedResult.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleAutoLogin = async () => {
    if (!generatedResult?.code) return;
    setInputCode(generatedResult.code);
    setTopLoginLoading(true);
    const res = await connectAccount(generatedResult.code);
    setTopLoginLoading(false);
    if (res.success && onLoginSuccess) {
      onLoginSuccess();
    }
  };

  return (
    <div className="space-y-6">
      {/* Upper Panel: Login with Code (Vina-Full Style, but 100% Free - No Key Needed) */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center space-x-2">
                <span>Code Dragon City Hub</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 normal-case">
                  Không cần Security Key • Free 100%
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Nhập Code tài khoản hoặc dán link chứa access_token để mở khóa toàn bộ chức năng
              </p>
            </div>
          </div>

          <button
            onClick={() => connectDemo()}
            disabled={loading}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30 transition-all shrink-0"
          >
            Trải nghiệm Demo Ngay
          </button>
        </div>

        {/* Input & Action Buttons */}
        <form onSubmit={handleTopLogin} className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Code Dragon City Hub (hoặc mã VINA_...):
            </label>
            <input
              type="text"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              placeholder="Nhập mã code của bạn (ví dụ: DCHUB_... hoặc VINA_...) hoặc dán URL đăng nhập"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs font-mono text-cyan-300 placeholder:text-slate-600 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
            />
          </div>

          {topLoginError && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center space-x-2 text-xs text-red-400">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{topLoginError}</span>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-2.5 pt-1">
            <button
              type="submit"
              disabled={topLoginLoading}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-500/25 transition-all flex items-center space-x-2 disabled:opacity-50"
            >
              <LogIn className="w-4 h-4" />
              <span>{topLoginLoading ? 'Đang xác thực...' : 'Get My Information / Đăng nhập'}</span>
            </button>

            <a
              href="#get-code-section"
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all flex items-center space-x-1.5"
            >
              <span>Get Code / Lấy Mã Mới</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </form>
      </div>

      {/* Lower Panel: "Get Code to use this Tools" (Exact Vina-Full Style) */}
      <div id="get-code-section" className="rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden">
        {/* Banner Bar */}
        <div className="bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 px-6 py-3.5 flex items-center justify-between text-white shadow-md">
          <div className="flex items-center space-x-2.5">
            <Sparkles className="w-5 h-5 text-cyan-200" />
            <h3 className="font-extrabold text-sm uppercase tracking-wider">
              Get Code to use this Tools DRAGON CITY HUB
            </h3>
          </div>
          <span className="text-[11px] font-bold bg-white/20 px-2.5 py-0.5 rounded-full border border-white/30 hidden sm:block">
            Tự động sinh mã chính xác 100%
          </span>
        </div>

        {/* Step-by-Step Instructions */}
        <div className="p-6 space-y-4 text-xs">
          {/* Step 1 */}
          <div className="flex items-start space-x-3 p-3 rounded-xl bg-slate-950/50 border border-slate-800/80">
            <span className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-400 font-extrabold flex items-center justify-center shrink-0 text-xs">
              1
            </span>
            <div className="pt-0.5">
              <span className="font-bold text-slate-200">Step 1: </span>
              <span className="text-slate-400">Đăng nhập tài khoản Facebook trên trình duyệt đang dùng (để tải dữ liệu game).</span>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-start space-x-3 p-3 rounded-xl bg-slate-950/50 border border-slate-800/80">
            <span className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-400 font-extrabold flex items-center justify-center shrink-0 text-xs">
              2
            </span>
            <div className="pt-0.5 flex flex-wrap items-center gap-2">
              <span className="font-bold text-slate-200">Step 2: </span>
              <span className="text-slate-400">Mở cổng đăng nhập game bằng cách bấm vào liên kết:</span>
              <a
                href={dragonCityConsentUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30 font-bold transition-all text-xs"
              >
                <span>Dragon City Click Here</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-start space-x-3 p-3 rounded-xl bg-slate-950/50 border border-slate-800/80">
            <span className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-400 font-extrabold flex items-center justify-center shrink-0 text-xs">
              3
            </span>
            <div className="pt-0.5">
              <span className="font-bold text-slate-200">Step 3: </span>
              <span className="text-slate-400">Nếu xuất hiện màn hình xác nhận quyền của Facebook, bấm <strong>Tiếp tục (Continue)</strong> và đợi vài giây cho trang tải xong.</span>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex items-start space-x-3 p-3 rounded-xl bg-slate-950/50 border border-slate-800/80">
            <span className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-400 font-extrabold flex items-center justify-center shrink-0 text-xs">
              4
            </span>
            <div className="pt-0.5">
              <span className="font-bold text-slate-200">Step 4: </span>
              <span className="text-slate-400">Nhìn lên thanh địa chỉ của trình duyệt (Address Bar), bôi đen toàn bộ đường dẫn URL bắt đầu bằng <code className="text-cyan-300 font-mono">https://apps.facebook.com/dragoncity/#access_token=...</code> và bấm <strong>Sao chép (Ctrl+C)</strong>.</span>
            </div>
          </div>

          {/* Step 5 & 6 Form */}
          <form onSubmit={handleGenerateCode} className="space-y-3 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-200 mb-1.5 flex items-center space-x-2">
                <span className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-400 font-extrabold flex items-center justify-center shrink-0 text-xs">
                  5
                </span>
                <span>Step 5: Paste all contents here (Dán toàn bộ nội dung URL đã copy vào ô này):</span>
              </label>
              <textarea
                value={pastedUrl}
                onChange={(e) => setPastedUrl(e.target.value)}
                rows={4}
                placeholder="Dán link bắt đầu bằng: https://apps.facebook.com/dragoncity/#access_token=EAA... vào đây"
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-xs font-mono text-slate-200 placeholder:text-slate-600 focus:border-cyan-500 focus:outline-none"
              />
            </div>

            {genError && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center space-x-2 text-xs text-red-400">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{genError}</span>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={genLoading}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold text-xs shadow-lg shadow-cyan-500/25 transition-all disabled:opacity-50"
              >
                {genLoading ? 'Đang trích xuất & tạo mã...' : 'Step 6: Submit / Tạo Mã Code Tài Khoản'}
              </button>
            </div>
          </form>

          {/* Output Result Card (Matches screenshot exactly) */}
          {generatedResult && (
            <div className="mt-4 p-5 rounded-2xl bg-slate-950 border-2 border-cyan-500/50 shadow-2xl space-y-3 animate-fade-in">
              <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold border-b border-slate-800 pb-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Tạo mã code thành công cho tài khoản của bạn:</span>
              </div>

              <div className="space-y-1.5 font-mono text-xs text-slate-300">
                <p>
                  <span className="text-slate-500">User Id: </span>
                  <span className="text-cyan-400 font-bold">{generatedResult.userId}</span>
                </p>
                <p>
                  <span className="text-slate-500">Your Name: </span>
                  <span className="text-purple-400 font-bold">{generatedResult.name}</span>
                </p>
                <p className="flex flex-wrap items-center gap-2">
                  <span className="text-slate-500">Code: </span>
                  <span className="text-amber-400 font-extrabold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                    {generatedResult.code}
                  </span>
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 pt-2 border-t border-slate-800/80">
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center space-x-1.5 border border-slate-700 transition-all"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                  <span>{copied ? 'Đã sao chép!' : 'Copy Code'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleAutoLogin}
                  disabled={topLoginLoading}
                  className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 text-xs font-extrabold shadow-md shadow-emerald-500/20 transition-all flex items-center space-x-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Sử dụng mã này & Đăng nhập ngay</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
