import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.js';
import playerRoutes from './routes/player.js';
import toolsRoutes from './routes/tools.js';
import databaseRoutes from './routes/database.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging for monitoring
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (req.originalUrl.startsWith('/api')) {
      console.log(`[${req.method}] ${req.originalUrl} - ${res.statusCode} (${duration}ms)`);
    }
  });
  next();
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api', authRoutes); // Compatibility alias for /api/APISessionKey & /api/APILoginDragonCity
app.use('/api/player', playerRoutes);
app.use('/api/tools', toolsRoutes);
app.use('/api/database', databaseRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    version: '1.0.0',
    platform: 'Dragon City Free Tool Hub',
    features: ['No Ads', 'No Keys', 'Free Forever', 'Safe Session Connect'],
    timestamp: new Date().toISOString()
  });
});

// Serve frontend in production
const clientDistPath = path.join(__dirname, '../client/dist');
app.use(express.static(clientDistPath));

app.use((req, res, next) => {
  if (req.method === 'GET' && !req.originalUrl.startsWith('/api')) {
    return res.sendFile(path.join(clientDistPath, 'index.html'));
  }
  next();
});

// Start Server
const server = app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 Dragon City Community Hub Server running on http://localhost:${PORT}`);
  console.log(`🛡️ 100% Free - No Ads - No Paywall - Direct Connect`);
  console.log(`====================================================`);
});

export { app, server };
