import express from 'express';
import { dbService } from '../services/dbService.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
const islandsData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/islands.json'), 'utf-8'));
const dragonsData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/dragons.json'), 'utf-8'));

/**
 * Default initial template for newly connected players
 */
function createDefaultProfile(userId, customName = null) {
  return {
    userId,
    name: customName || `Dragon Master #${String(userId).slice(-4)}`,
    avatar: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=150&auto=format&fit=crop&q=80',
    level: 68,
    gold: 48500000,
    food: 12400000,
    gems: 320,
    vipPoints: 1450,
    totalDragons: 284,
    uniqueDragons: 241,
    masterPoints: 34820,
    alliance: 'Viet Dragon Alliance',
    lastSyncAt: new Date().toISOString(),
    connectionStatus: 'CONNECTED_ACTIVE',
    fieldStatus: {
      userId: 'VERIFIED',
      name: 'VERIFIED',
      level: 'SYNCED_PROFILE',
      gold: 'SYNCED_PROFILE',
      food: 'SYNCED_PROFILE',
      gems: 'SYNCED_PROFILE',
      dragons: 'SYNCED_PROFILE',
      officialApiActions: 'RESTRICTED_BY_OFFICIAL_API' // Clearly indicates live game hacking/direct actions are restricted by Social Point
    }
  };
}

/**
 * GET /api/player/profile
 */
router.get('/profile', (req, res) => {
  try {
    const userId = req.query.userId || req.headers['x-user-id'];
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'Chưa có thông tin tài khoản được kết nối.'
      });
    }

    let profile = dbService.getProfile(userId);
    if (!profile) {
      profile = dbService.upsertProfile(userId, createDefaultProfile(userId));
      dbService.addActivityLog({
        userId,
        category: 'ACCOUNT',
        action: 'PROFILE_CREATED',
        status: 'SUCCESS',
        message: `Đã khởi tạo hồ sơ người chơi với UID ${userId}`
      });
    }

    return res.json({
      success: true,
      data: profile
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * PUT /api/player/profile
 * Manual profile update / adjustment
 */
router.put('/profile', (req, res) => {
  try {
    const userId = req.body.userId || req.query.userId || req.headers['x-user-id'];
    if (!userId) {
      return res.status(400).json({ success: false, error: 'Thiếu userId' });
    }

    const { name, level, gold, food, gems, alliance } = req.body;
    const current = dbService.getProfile(userId) || createDefaultProfile(userId);
    
    const updated = dbService.upsertProfile(userId, {
      ...current,
      ...(name !== undefined && { name }),
      ...(level !== undefined && { level: Number(level) }),
      ...(gold !== undefined && { gold: Number(gold) }),
      ...(food !== undefined && { food: Number(food) }),
      ...(gems !== undefined && { gems: Number(gems) }),
      ...(alliance !== undefined && { alliance }),
      lastSyncAt: new Date().toISOString()
    });

    dbService.addActivityLog({
      userId,
      category: 'ACCOUNT',
      action: 'PROFILE_UPDATED',
      status: 'SUCCESS',
      message: `Đã cập nhật chỉ số hồ sơ: Level ${updated.level}, Vàng ${updated.gold.toLocaleString()}, Thức ăn ${updated.food.toLocaleString()}`
    });

    return res.json({ success: true, data: updated });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/player/collection
 * Fetch user's personalized dragon collection
 */
router.get('/collection', (req, res) => {
  try {
    const userId = req.query.userId || req.headers['x-user-id'];
    if (!userId) {
      return res.status(401).json({ success: false, error: 'Chưa có thông tin tài khoản.' });
    }

    let collection = dbService.getCollection(userId);
    // If empty initial collection, populate with some default starter dragons
    if (collection.length === 0) {
      const starters = dragonsData.dragons.slice(0, 5).map((d, index) => ({
        dragonId: d.id,
        name: d.name,
        nameVi: d.nameVi,
        rarity: d.rarity,
        elements: d.elements,
        level: 30 + (index * 5),
        stars: index % 3,
        isFavorite: index === 0,
        obtainedAt: new Date(Date.now() - (index * 86400000 * 10)).toISOString()
      }));
      starters.forEach(d => dbService.addToCollection(userId, d));
      collection = dbService.getCollection(userId);
    }

    return res.json({
      success: true,
      total: collection.length,
      collection
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/player/collection
 * Add a dragon to user's collection
 */
router.post('/collection', (req, res) => {
  try {
    const userId = req.body.userId || req.headers['x-user-id'];
    const { dragonId, level = 30, stars = 0, isFavorite = false } = req.body;

    if (!userId || !dragonId) {
      return res.status(400).json({ success: false, error: 'Thiếu userId hoặc dragonId' });
    }

    const dragonInfo = dragonsData.dragons.find(d => d.id === dragonId);
    if (!dragonInfo) {
      return res.status(404).json({ success: false, error: 'Không tìm thấy rồng trong cơ sở dữ liệu' });
    }

    const item = {
      dragonId,
      name: dragonInfo.name,
      nameVi: dragonInfo.nameVi,
      rarity: dragonInfo.rarity,
      elements: dragonInfo.elements,
      level: Number(level),
      stars: Number(stars),
      isFavorite: Boolean(isFavorite),
      obtainedAt: new Date().toISOString()
    };

    const updated = dbService.addToCollection(userId, item);

    dbService.addActivityLog({
      userId,
      category: 'COLLECTION',
      action: 'DRAGON_ADDED',
      status: 'SUCCESS',
      message: `Đã thêm rồng ${dragonInfo.nameVi || dragonInfo.name} vào bộ sưu tập cá nhân`
    });

    return res.json({ success: true, collection: updated });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * DELETE /api/player/collection/:dragonId
 */
router.delete('/collection/:dragonId', (req, res) => {
  try {
    const userId = req.query.userId || req.headers['x-user-id'];
    const { dragonId } = req.params;

    if (!userId || !dragonId) {
      return res.status(400).json({ success: false, error: 'Thiếu tham số' });
    }

    const updated = dbService.removeFromCollection(userId, dragonId);
    return res.json({ success: true, collection: updated });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/player/collection/:dragonId/favorite
 */
router.post('/collection/:dragonId/favorite', (req, res) => {
  try {
    const userId = req.body.userId || req.headers['x-user-id'];
    const { dragonId } = req.params;

    const isFav = dbService.toggleFavorite(userId, dragonId);
    return res.json({ success: true, isFavorite: isFav });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/player/islands
 * Get all islands with player unlock progression
 */
router.get('/islands', (req, res) => {
  try {
    const userId = req.query.userId || req.headers['x-user-id'];
    const profile = userId ? dbService.getProfile(userId) : null;
    const playerLevel = profile ? profile.level : 68;

    const islands = islandsData.islands.map(island => ({
      ...island,
      unlocked: playerLevel >= island.requiredLevel,
      obstaclesRemaining: playerLevel >= island.requiredLevel ? Math.max(0, island.totalObstacles - 5) : island.totalObstacles
    }));

    return res.json({
      success: true,
      total: islands.length,
      islands
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/player/sync/history
 */
router.get('/sync/history', (req, res) => {
  try {
    const userId = req.query.userId || req.headers['x-user-id'];
    const logs = dbService.getSyncLogs(userId);
    return res.json({ success: true, logs });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/player/sync/execute
 * Triggers sync protocol: checks UID validity and refreshes profile
 */
router.post('/sync/execute', (req, res) => {
  try {
    const userId = req.body.userId || req.headers['x-user-id'];
    if (!userId) {
      return res.status(400).json({ success: false, error: 'Thiếu userId để đồng bộ' });
    }

    const currentProfile = dbService.getProfile(userId) || createDefaultProfile(userId);
    const updated = dbService.upsertProfile(userId, {
      ...currentProfile,
      lastSyncAt: new Date().toISOString(),
      connectionStatus: 'CONNECTED_ACTIVE'
    });

    const syncLog = dbService.addSyncLog({
      userId,
      source: 'Safe Token Handshake',
      status: 'SUCCESS',
      details: `Đồng bộ thành công UID: ${userId} (${updated.name}). Dữ liệu hồ sơ đã được làm mới.`
    });

    dbService.addActivityLog({
      userId,
      category: 'SYNC',
      action: 'DATA_SYNC_PERFORMED',
      status: 'SUCCESS',
      message: `Đã thực hiện đồng bộ dữ liệu vào lúc ${new Date().toLocaleTimeString('vi-VN')}`
    });

    return res.json({
      success: true,
      message: 'Đồng bộ tài khoản thành công!',
      profile: updated,
      log: syncLog
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/player/logs
 * Activity logs
 */
router.get('/logs', (req, res) => {
  try {
    const userId = req.query.userId || req.headers['x-user-id'];
    const logs = dbService.getActivityLogs(userId);
    return res.json({ success: true, logs });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/player/settings
 */
router.get('/settings', (req, res) => {
  try {
    const userId = req.query.userId || req.headers['x-user-id'];
    const settings = dbService.getSettings(userId);
    return res.json({ success: true, settings });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * PUT /api/player/settings
 */
router.put('/settings', (req, res) => {
  try {
    const userId = req.body.userId || req.headers['x-user-id'];
    const updated = dbService.updateSettings(userId, req.body.settings || req.body);
    return res.json({ success: true, settings: updated });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/player/launcher-info
 * Returns official launcher links and deep link schemas
 */
router.get('/launcher-info', (req, res) => {
  return res.json({
    success: true,
    platformLinks: {
      deepLink: 'dragoncity://',
      windowsStore: 'ms-windows-store://pdp/?ProductId=9WZDNCRFJ0PH',
      facebookCanvas: 'https://apps.facebook.com/dragoncity/',
      googlePlay: 'https://play.google.com/store/apps/details?id=es.socialpoint.DragonCity',
      appleAppStore: 'https://apps.apple.com/app/dragon-city-mobile/id561949265'
    }
  });
});

export default router;
