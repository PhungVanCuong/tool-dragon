import express from 'express';
import { fetchAccountProfile } from '../services/dcApiClient.js';

const router = express.Router();

/**
 * GET /api/player/profile
 * Requires userId in query or header
 */
router.get('/profile', async (req, res) => {
  try {
    const userId = req.query.userId || req.headers['x-user-id'];
    const sessionId = req.query.sessionId || req.headers['x-session-id'] || 'session';

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'Chưa có thông tin tài khoản được kết nối.'
      });
    }

    const result = await fetchAccountProfile(userId, sessionId);
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
