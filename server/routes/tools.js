import express from 'express';
import {
  harvestGreenhouse,
  boostGreenhouse,
  clearObstacles,
  convertGoldToFood,
  claimDragonTvReward,
  claimDailyStreak,
  simulateArenaBattle
} from '../services/dcApiClient.js';
import {
  calculateBreeding,
  reverseBreeding,
  calculateFeedingCost
} from '../services/breedingService.js';
import {
  recommendCounters,
  getElementMatchup
} from '../services/arenaService.js';

const router = express.Router();

// Helper to extract session credentials
function getCredentials(req) {
  const userId = req.body.userId || req.headers['x-user-id'] || '98234120';
  const sessionId = req.body.sessionId || req.headers['x-session-id'] || 'session';
  return { userId, sessionId };
}

/**
 * POST /api/tools/greenhouse/harvest
 */
router.post('/greenhouse/harvest', async (req, res) => {
  try {
    const { userId, sessionId } = getCredentials(req);
    const result = await harvestGreenhouse(userId, sessionId);
    return res.json(result);
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/tools/greenhouse/boost
 */
router.post('/greenhouse/boost', async (req, res) => {
  try {
    const { userId, sessionId } = getCredentials(req);
    const result = await boostGreenhouse(userId, sessionId);
    return res.json(result);
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/tools/island/clear-obstacles
 */
router.post('/island/clear-obstacles', async (req, res) => {
  try {
    const { userId, sessionId } = getCredentials(req);
    const { islandId } = req.body;
    const result = await clearObstacles(userId, sessionId, islandId || 1);
    return res.json(result);
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/tools/resource/convert-gold
 */
router.post('/resource/convert-gold', async (req, res) => {
  try {
    const { userId, sessionId } = getCredentials(req);
    const { goldAmount } = req.body;
    const result = await convertGoldToFood(userId, sessionId, goldAmount);
    return res.json(result);
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/tools/dragon-tv/claim
 */
router.post('/dragon-tv/claim', async (req, res) => {
  try {
    const { userId, sessionId } = getCredentials(req);
    const result = await claimDragonTvReward(userId, sessionId);
    return res.json(result);
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/tools/streak/claim
 */
router.post('/streak/claim', async (req, res) => {
  try {
    const { userId, sessionId } = getCredentials(req);
    const result = await claimDailyStreak(userId, sessionId);
    return res.json(result);
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/tools/arena/simulate
 */
router.post('/arena/simulate', async (req, res) => {
  try {
    const { userId, sessionId } = getCredentials(req);
    const { myTeam, opponentTeam } = req.body;
    const result = await simulateArenaBattle(userId, sessionId, myTeam, opponentTeam);
    return res.json(result);
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/tools/breeding/calculate
 */
router.post('/breeding/calculate', (req, res) => {
  try {
    const { parent1Id, parent2Id, sanctuaryLevel, empower1, empower2 } = req.body;
    const result = calculateBreeding(parent1Id, parent2Id, sanctuaryLevel, empower1, empower2);
    return res.json(result);
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/tools/breeding/reverse
 */
router.post('/breeding/reverse', (req, res) => {
  try {
    const { targetDragonId } = req.body;
    const result = reverseBreeding(targetDragonId);
    return res.json(result);
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/tools/feeding/calculate
 */
router.post('/feeding/calculate', (req, res) => {
  try {
    const { fromLevel, toLevel } = req.body;
    const result = calculateFeedingCost(fromLevel, toLevel);
    return res.json(result);
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/tools/arena/counter-pick
 */
router.post('/arena/counter-pick', (req, res) => {
  try {
    const { opponentDragonIds } = req.body;
    const result = recommendCounters(opponentDragonIds);
    return res.json(result);
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
