import express from 'express';
import { parseDragonCityToken } from '../services/accountParser.js';
import { fetchAccountProfile } from '../services/dcApiClient.js';
import {
  extractFacebookToken,
  getFacebookProfile,
  generateAccountCode,
  getAccountByCode
} from '../services/fbTokenService.js';

const router = express.Router();

/**
 * POST /api/auth/get-code & POST /api/APISessionKey (Vina-Full exact compatibility)
 * User pastes Facebook redirect URL or access_token -> gets User Id, Your Name, and Code
 */
async function handleGetCodeLogic(req, res) {
  try {
    const rawInput = req.body.urlOrToken || req.body.data || req.body.url || req.body.code;

    if (!rawInput || typeof rawInput !== 'string') {
      return res.status(400).json({
        status: 'Error',
        success: false,
        message: 'Vui lòng dán toàn bộ đường dẫn URL hoặc mã token từ Facebook.',
        error: 'Vui lòng dán toàn bộ đường dẫn URL hoặc mã token từ Facebook.'
      });
    }

    // 1. Extract Facebook access token
    const token = extractFacebookToken(rawInput);
    if (!token) {
      return res.status(422).json({
        status: 'Error',
        success: false,
        message: 'Không tìm thấy access_token hợp lệ trong đường dẫn. Hãy copy toàn bộ URL từ thanh địa chỉ trình duyệt.',
        error: 'Không tìm thấy access_token hợp lệ.'
      });
    }

    // 2. Query Facebook Graph API for User Id and Name
    const fbProfile = await getFacebookProfile(token, rawInput);
    const { userId, name, code: remoteCode } = fbProfile;

    // 3. Generate unique account tool code (DCHUB_... and VINA_...)
    const code = generateAccountCode(userId, name, token, remoteCode);

    // Register profile state
    await fetchAccountProfile(userId, token, name);

    return res.json({
      status: 'Success',
      success: true,
      game_id: userId,
      userId,
      name,
      code,
      message: 'Tạo mã code tài khoản Dragon City thành công!'
    });
  } catch (error) {
    console.error('Lỗi tạo mã tài khoản:', error);
    return res.status(500).json({
      status: 'Error',
      success: false,
      message: 'Đã xảy ra lỗi khi tạo mã tài khoản. Vui lòng thử lại.',
      error: error.message
    });
  }
}

router.post('/get-code', handleGetCodeLogic);
router.post('/APISessionKey', handleGetCodeLogic);

/**
 * POST /api/auth/connect & POST /api/APILoginDragonCity (Vina-Full exact compatibility)
 * Receives Code (DCHUB_... or VINA_...), Facebook redirect URL, or session string
 */
async function handleConnectLogic(req, res) {
  try {
    const rawCode = req.body.connectionCode || req.body.code;

    if (!rawCode) {
      return res.status(400).json({
        status: 'Error',
        success: false,
        message: 'Vui lòng nhập Code tài khoản hoặc dán URL kết nối.',
        error: 'Vui lòng nhập Code tài khoản hoặc dán URL kết nối.'
      });
    }

    const trimmed = String(rawCode).trim();

    // Case 1: Input is an existing generated Code (e.g. DCHUB_... or VINA_...)
    const savedAccount = getAccountByCode(trimmed);
    if (savedAccount) {
      const profileResult = await fetchAccountProfile(savedAccount.userId, savedAccount.accessToken, savedAccount.name);
      return res.json({
        status: 'Success',
        success: true,
        message: `Đăng nhập thành công! Chào mừng ${savedAccount.name}`,
        session: {
          userId: savedAccount.userId,
          name: savedAccount.name,
          code: savedAccount.code,
          platform: 'Dragon City Facebook Web',
          connectedAt: new Date().toISOString()
        },
        profile: profileResult.data
      });
    }

    // Case 2: User pasted the raw Facebook redirect URL directly into the Code field
    const fbToken = extractFacebookToken(trimmed);
    if (fbToken) {
      const fbProfile = await getFacebookProfile(fbToken, trimmed);
      const code = generateAccountCode(fbProfile.userId, fbProfile.name, fbToken, fbProfile.code);
      const profileResult = await fetchAccountProfile(fbProfile.userId, fbToken, fbProfile.name);

      return res.json({
        status: 'Success',
        success: true,
        message: `Tự động tạo mã và đăng nhập thành công! Chào mừng ${fbProfile.name}`,
        session: {
          userId: fbProfile.userId,
          name: fbProfile.name,
          code,
          platform: 'Dragon City Facebook Web',
          connectedAt: new Date().toISOString()
        },
        profile: profileResult.data
      });
    }

    // Case 3: Standard Dragon City Session ID / User ID URL or JSON
    const parseResult = parseDragonCityToken(trimmed);
    if (!parseResult.success) {
      return res.status(422).json({
        status: 'Error',
        success: false,
        message: 'Mã hoặc URL không hợp lệ. Hãy bấm "Lấy Mã (Get Code)" phía dưới để tạo mã theo đúng tài khoản của bạn.',
        error: parseResult.error
      });
    }

    const { userId, sessionId, server, platform, connectedAt } = parseResult.data;
    const profileResult = await fetchAccountProfile(userId, sessionId);

    return res.json({
      status: 'Success',
      success: true,
      message: 'Kết nối tài khoản Dragon City thành công!',
      session: {
        userId,
        name: profileResult.data.name,
        code: `DCHUB_${userId.slice(-6)}`,
        server,
        platform,
        connectedAt
      },
      profile: profileResult.data
    });
  } catch (error) {
    console.error('Lỗi kết nối tài khoản:', error);
    return res.status(500).json({
      status: 'Error',
      success: false,
      message: 'Đã xảy ra lỗi nội bộ khi kết nối tài khoản. Vui lòng thử lại.',
      error: error.message
    });
  }
}

router.post('/connect', handleConnectLogic);
router.post('/APILoginDragonCity', handleConnectLogic);

/**
 * POST /api/auth/demo
 * Instant demo connection for testing without needing live credentials
 */
router.post('/demo', async (req, res) => {
  try {
    const demoUserId = '549093523579670';
    const demoName = 'Cường Phùng (Demo Master)';
    const demoSessionId = 'dcdemo_session_token_vietnam_2026';

    const profileResult = await fetchAccountProfile(demoUserId, demoSessionId, demoName);

    return res.json({
      status: 'Success',
      success: true,
      isDemo: true,
      message: 'Đã kích hoạt chế độ Tài khoản Mẫu (Demo)! Bạn có thể trải nghiệm toàn bộ tính năng.',
      session: {
        userId: demoUserId,
        name: demoName,
        code: 'DCHUB_DEMO_2026',
        server: 'sandbox.dragoncity.community',
        platform: 'Demo Sandbox Explorer',
        connectedAt: new Date().toISOString()
      },
      profile: profileResult.data
    });
  } catch (error) {
    return res.status(500).json({ status: 'Error', success: false, error: error.message });
  }
});

export default router;
