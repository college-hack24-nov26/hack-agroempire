/**
 * Pl@ntNet API Configuration
 * Krushi Drushti (कृषी दृष्टी)
 */

import dotenv from 'dotenv';
dotenv.config();

export const PLANTNET_CONFIG = {
  apiKey: process.env.PLANTNET_API_KEY || '2b1012WAXF1ObK4K1nMcYJuRO',
  baseUrl: 'https://my-api.plantnet.org/v2',
  defaultProject: process.env.PLANTNET_PROJECT || 'all',
  fallbackProject: 'all',
  indianProject: 'k-indian-subcontinent',
  usefulProject: 'useful'
};

