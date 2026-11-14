import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => {
    try {
      const saved = localStorage.getItem('dc_session');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [profile, setProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('dc_profile');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isDemo, setIsDemo] = useState(() => {
    return localStorage.getItem('dc_is_demo') === 'true';
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Auto-sync profile when session exists
  useEffect(() => {
    if (session && session.userId) {
      refreshProfile();
    }
  }, []);

  const refreshProfile = async () => {
    if (!session || !session.userId) return;
    try {
      const res = await fetch(`/api/player/profile?userId=${session.userId}`);
      const data = await res.json();
      if (data.success && data.data) {
        setProfile(data.data);
        localStorage.setItem('dc_profile', JSON.stringify(data.data));
      }
    } catch (err) {
      console.error('Lỗi làm mới profile:', err);
    }
  };

  const connectAccount = async (connectionCode) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ connectionCode })
      });
      const data = await res.json();

      if (!data.success) {
        setError(data.error || 'Kết nối thất bại. Vui lòng kiểm tra lại mã kết nối.');
        setLoading(false);
        return { success: false, error: data.error };
      }

      setSession(data.session);
      setProfile(data.profile);
      setIsDemo(false);
      localStorage.setItem('dc_session', JSON.stringify(data.session));
      localStorage.setItem('dc_profile', JSON.stringify(data.profile));
      localStorage.setItem('dc_is_demo', 'false');
      setLoading(false);
      return { success: true };
    } catch (err) {
      const errMsg = 'Không thể kết nối đến máy chủ. Vui lòng thử lại sau.';
      setError(errMsg);
      setLoading(false);
      return { success: false, error: errMsg };
    }
  };

  const connectDemo = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/demo', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setSession(data.session);
        setProfile(data.profile);
        setIsDemo(true);
        localStorage.setItem('dc_session', JSON.stringify(data.session));
        localStorage.setItem('dc_profile', JSON.stringify(data.profile));
        localStorage.setItem('dc_is_demo', 'true');
      }
      setLoading(false);
      return { success: true };
    } catch (err) {
      setError('Lỗi kết nối chế độ demo');
      setLoading(false);
      return { success: false };
    }
  };

  const disconnect = () => {
    setSession(null);
    setProfile(null);
    setIsDemo(false);
    localStorage.removeItem('dc_session');
    localStorage.removeItem('dc_profile');
    localStorage.removeItem('dc_is_demo');
  };

  const updateProfileLocally = (updater) => {
    setProfile(prev => {
      const updated = typeof updater === 'function' ? updater(prev) : { ...prev, ...updater };
      localStorage.setItem('dc_profile', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        profile,
        isConnected: !!session,
        isDemo,
        loading,
        error,
        connectAccount,
        connectDemo,
        disconnect,
        refreshProfile,
        updateProfileLocally
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
