/**
 * Krushi Drushti Backend Entry Point
 */

import dotenv from 'dotenv';
dotenv.config();

import { createApp } from './server.js';
import { firebaseService } from './services/firebaseService.js';

const PORT = process.env.PORT || 5000;
const app = createApp();

const server = app.listen(PORT, async () => {
  console.log(`====================================================`);
  console.log(`🌾 Krushi Drushti (कृषी दृष्टी) Backend Engine Active`);
  console.log(`🚀 Server listening on: http://localhost:${PORT}`);
  console.log(`📡 Connected to Firebase RTDB: ${firebaseService.baseUrl}`);
  console.log(`👨‍🌾 Farmer Application: http://localhost:${PORT}`);
  console.log(`📊 Developer API Explorer: http://localhost:${PORT}/explorer`);
  console.log(`====================================================`);

  // Check initial DB connection
  const health = await firebaseService.ping();
  console.log(`[Firebase RTDB Health] Status: ${health.status} (${health.latencyMs || 0}ms)`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received. Shutting down gracefully...');
  server.close(() => {
    console.log('Server terminated.');
  });
});

