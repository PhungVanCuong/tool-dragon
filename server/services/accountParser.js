/**
 * Safe parser for "Connect My Dragon City Information"
 * Extracts userId, sessionId, and optional parameters without exposing user passwords.
 */

export function parseDragonCityToken(rawInput) {
  if (!rawInput || typeof rawInput !== 'string') {
    return {
      success: false,
      error: 'Mã kết nối không hợp lệ hoặc để trống. Vui lòng dán mã thông tin kết nối.'
    };
  }

  const trimmed = rawInput.trim();

  let userId = null;
  let sessionId = null;
  let server = 'dcmobile.socialpointgames.com';
  let platform = 'Unknown';

  // Format 1: JSON payload
  if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
    try {
      const parsed = JSON.parse(trimmed);
      userId = parsed.user_id || parsed.userId || parsed.uid || parsed.id;
      sessionId = parsed.session_id || parsed.sessionId || parsed.session || parsed.token;
      if (parsed.platform) platform = parsed.platform;
      if (parsed.server) server = parsed.server;
    } catch {
      // Fallback to regex if JSON parse fails
    }
  }

  // Format 2: Full URL (https://game.dragoncitymobile.com/?user_id=...&session_id=...)
  if (!userId || !sessionId) {
    try {
      if (trimmed.includes('?') || trimmed.startsWith('http')) {
        const urlObj = new URL(trimmed.startsWith('http') ? trimmed : `https://${trimmed}`);
        userId = urlObj.searchParams.get('user_id') || urlObj.searchParams.get('uid') || urlObj.searchParams.get('userId');
        sessionId = urlObj.searchParams.get('session_id') || urlObj.searchParams.get('sessionId') || urlObj.searchParams.get('session');
        if (urlObj.hostname.includes('facebook')) platform = 'Facebook Web';
        else if (urlObj.hostname.includes('dragoncity')) platform = 'Dragon City Mobile Web';
      }
    } catch {
      // Continue to regex
    }
  }

  // Format 3: Regex search across query strings, line breaks, or key-value pairs
  if (!userId) {
    const userMatches = trimmed.match(/(?:user_id|userId|uid|user|id)\s*[:=]\s*["']?([a-zA-Z0-9_-]+)["']?/i);
    if (userMatches) userId = userMatches[1];
  }

  if (!sessionId) {
    const sessionMatches = trimmed.match(/(?:session_id|sessionId|session|token|sid)\s*[:=]\s*["']?([a-zA-Z0-9_\-.:]{10,})["']?/i);
    if (sessionMatches) sessionId = sessionMatches[1];
  }

  // Format 4: Two comma/space-separated values: "12345678, abcdef12345678"
  if (!userId || !sessionId) {
    const parts = trimmed.split(/[\s,;|]+/).map(p => p.trim()).filter(Boolean);
    if (parts.length >= 2) {
      // Typically userId is numeric or short alphanumeric, sessionId is longer hash
      if (/^\d{5,15}$/.test(parts[0]) && parts[1].length >= 10) {
        userId = parts[0];
        sessionId = parts[1];
      } else if (/^\d{5,15}$/.test(parts[1]) && parts[0].length >= 10) {
        userId = parts[1];
        sessionId = parts[0];
      }
    }
  }

  // Final Validation
  if (!userId) {
    return {
      success: false,
      error: 'Không tìm thấy User ID trong mã kết nối. Vui lòng kiểm tra lại URL hoặc cú pháp.'
    };
  }

  if (!sessionId) {
    return {
      success: false,
      error: 'Không tìm thấy Session ID trong mã kết nối. Vui lòng kiểm tra lại URL hoặc cú pháp.'
    };
  }

  // Security check: ensure no malicious script injection
  const safeUserId = String(userId).replace(/[^a-zA-Z0-9_-]/g, '');
  const safeSessionId = String(sessionId).replace(/[^a-zA-Z0-9_\-.:]/g, '');

  if (safeUserId.length < 3 || safeSessionId.length < 8) {
    return {
      success: false,
      error: 'Độ dài User ID hoặc Session ID không đạt chuẩn tối thiểu.'
    };
  }

  return {
    success: true,
    data: {
      userId: safeUserId,
      sessionId: safeSessionId,
      server,
      platform,
      connectedAt: new Date().toISOString()
    }
  };
}
