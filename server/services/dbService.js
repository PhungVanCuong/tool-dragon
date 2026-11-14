import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, '../data/app_database.json');

// Initial schema structure
const defaultDb = {
  profiles: {},
  collections: {},
  syncLogs: [],
  activityLogs: [],
  settings: {
    theme: 'dark',
    autoSync: false,
    syncIntervalMinutes: 30,
    notificationsEnabled: true,
    launcherPreference: 'auto'
  }
};

function readDb() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(defaultDb, null, 2), 'utf-8');
      return defaultDb;
    }
    const content = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(content);
  } catch (err) {
    console.error('Error reading app_database.json, fallback to default:', err);
    return defaultDb;
  }
}

function writeDb(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing app_database.json:', err);
  }
}

export const dbService = {
  // Profiles
  getProfile(userId) {
    const db = readDb();
    return db.profiles[userId] || null;
  },

  upsertProfile(userId, profileData) {
    const db = readDb();
    const existing = db.profiles[userId] || {};
    const updated = {
      ...existing,
      ...profileData,
      userId,
      updatedAt: new Date().toISOString()
    };
    db.profiles[userId] = updated;
    writeDb(db);
    return updated;
  },

  // Collections (User Dragons)
  getCollection(userId) {
    const db = readDb();
    return db.collections[userId] || [];
  },

  addToCollection(userId, dragon) {
    const db = readDb();
    if (!db.collections[userId]) {
      db.collections[userId] = [];
    }
    const existingIdx = db.collections[userId].findIndex(d => d.dragonId === dragon.dragonId);
    if (existingIdx >= 0) {
      db.collections[userId][existingIdx] = { ...db.collections[userId][existingIdx], ...dragon };
    } else {
      db.collections[userId].push({
        ...dragon,
        addedAt: new Date().toISOString()
      });
    }
    writeDb(db);
    return db.collections[userId];
  },

  removeFromCollection(userId, dragonId) {
    const db = readDb();
    if (db.collections[userId]) {
      db.collections[userId] = db.collections[userId].filter(d => d.dragonId !== dragonId);
      writeDb(db);
    }
    return db.collections[userId] || [];
  },

  toggleFavorite(userId, dragonId) {
    const db = readDb();
    if (!db.collections[userId]) db.collections[userId] = [];
    const item = db.collections[userId].find(d => d.dragonId === dragonId);
    if (item) {
      item.isFavorite = !item.isFavorite;
      writeDb(db);
      return item.isFavorite;
    }
    return false;
  },

  // Sync Logs
  getSyncLogs(userId) {
    const db = readDb();
    return db.syncLogs
      .filter(log => !userId || log.userId === userId)
      .slice(-50)
      .reverse();
  },

  addSyncLog(log) {
    const db = readDb();
    const entry = {
      id: 'sync_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      timestamp: new Date().toISOString(),
      ...log
    };
    db.syncLogs.push(entry);
    // Keep max 200 logs
    if (db.syncLogs.length > 200) {
      db.syncLogs = db.syncLogs.slice(-200);
    }
    writeDb(db);
    return entry;
  },

  // Activity Logs
  getActivityLogs(userId) {
    const db = readDb();
    return db.activityLogs
      .filter(log => !userId || log.userId === userId)
      .slice(-100)
      .reverse();
  },

  addActivityLog(log) {
    const db = readDb();
    const entry = {
      id: 'act_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      timestamp: new Date().toISOString(),
      ...log
    };
    db.activityLogs.push(entry);
    if (db.activityLogs.length > 300) {
      db.activityLogs = db.activityLogs.slice(-300);
    }
    writeDb(db);
    return entry;
  },

  // Settings
  getSettings(userId) {
    const db = readDb();
    return db.settings || defaultDb.settings;
  },

  updateSettings(userId, newSettings) {
    const db = readDb();
    db.settings = { ...db.settings, ...newSettings };
    writeDb(db);
    return db.settings;
  }
};
