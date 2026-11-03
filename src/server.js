/**
 * Krushi Drushti (कृषी दृष्टी) - Express Application Setup
 */

import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import healthRoutes from './routes/healthRoutes.js';
import authRoutes from './routes/authRoutes.js';
import farmerRoutes from './routes/farmerRoutes.js';
import cropRoutes from './routes/cropRoutes.js';
import diagnoseRoutes from './routes/diagnoseRoutes.js';
import mandiRoutes from './routes/mandiRoutes.js';
import weatherRoutes from './routes/weatherRoutes.js';
import communityRoutes from './routes/communityRoutes.js';
import schemeRoutes from './routes/schemeRoutes.js';
import telemetryRoutes from './routes/telemetryRoutes.js';
import seedRoutes from './routes/seedRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function createApp() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json({ limit: '15mb' }));
  app.use(express.urlencoded({ extended: true, limit: '15mb' }));

  // Serve Team Frontend at Root
  app.use(express.static(path.join(__dirname, '../frontend')));

  // Serve Developer API Explorer at /explorer
  app.use('/explorer', express.static(path.join(__dirname, 'public')));

  // Root API metadata
  app.get('/api', (req, res) => {
    res.json({
      name: 'Krushi Drushti (कृषी दृष्टी) API',
      version: '1.0.0',
      description: 'AI-Powered Smart Agriculture Backend with Firebase Realtime Database',
      database: 'Firebase RTDB (krushi-drishti-default-rtdb.asia-southeast1.firebasedatabase.app)',
      endpoints: [
        '/api/auth/register',
        '/api/auth/login',
        '/api/health',
        '/api/farmers',
        '/api/crops',
        '/api/diagnose',
        '/api/mandi',
        '/api/weather',
        '/api/community',
        '/api/schemes',
        '/api/telemetry',
        '/api/seed'
      ]
    });
  });

  // Mount API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/health', healthRoutes);
  app.use('/api/farmers', farmerRoutes);
  app.use('/api/crops', cropRoutes);
  app.use('/api/diagnose', diagnoseRoutes);
  app.use('/api/mandi', mandiRoutes);
  app.use('/api/weather', weatherRoutes);
  app.use('/api/community', communityRoutes);
  app.use('/api/schemes', schemeRoutes);
  app.use('/api/telemetry', telemetryRoutes);
  app.use('/api/seed', seedRoutes);

  // Error Handler
  app.use(errorHandler);

  return app;
}

