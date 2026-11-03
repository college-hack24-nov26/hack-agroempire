/**
 * Firebase Realtime Database Configuration & Adapter
 * Krushi Drushti (कृषी दृष्टी)
 */

import dotenv from 'dotenv';
dotenv.config();

const DEFAULT_RTDB_URL = 'https://krushi-drishti-default-rtdb.asia-southeast1.firebasedatabase.app';

/**
 * Normalizes Firebase Database URL to regional endpoint if needed
 */
export function getDatabaseUrl() {
  let url = process.env.FIREBASE_DATABASE_URL || DEFAULT_RTDB_URL;
  url = url.trim().replace(/\/+$/, '');

  // If user pasted the console URL, extract the RTDB endpoint
  if (url.includes('console.firebase.google.com')) {
    url = DEFAULT_RTDB_URL;
  }
  // If user used standard default without region, redirect to asia-southeast1
  if (url === 'https://krushi-drishti-default-rtdb.firebaseio.com') {
    url = DEFAULT_RTDB_URL;
  }
  return url;
}

export const FIREBASE_CONFIG = {
  projectId: process.env.FIREBASE_PROJECT_ID || 'krushi-drishti',
  databaseName: process.env.FIREBASE_DATABASE_NAME || 'krushi-drishti-default-rtdb',
  databaseUrl: getDatabaseUrl(),
  authSecret: process.env.FIREBASE_AUTH_SECRET || null
};

