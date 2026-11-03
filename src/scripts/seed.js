/**
 * Database Seeder Script for Krushi Drushti
 * Pushes complete agricultural dataset into Firebase Realtime Database
 */

import { firebaseService } from '../services/firebaseService.js';
import { SEED_DATA } from '../data/seedData.js';

export async function runDatabaseSeed() {
  console.log('🌱 Starting Krushi Drushti Firebase Realtime Database Seed...');
  console.log(`📡 Target DB: ${firebaseService.baseUrl}`);

  const results = {};

  for (const [collection, data] of Object.entries(SEED_DATA)) {
    try {
      console.log(`⏳ Seeding collection: [${collection}]...`);
      await firebaseService.set(collection, data);
      const count = Object.keys(data).length;
      results[collection] = { status: 'SUCCESS', count };
      console.log(`✅ [${collection}] seeded successfully (${count} records).`);
    } catch (err) {
      console.error(`❌ Failed to seed [${collection}]:`, err.message);
      results[collection] = { status: 'ERROR', error: err.message };
    }
  }

  // Update system health and timestamp
  await firebaseService.set('system/lastSync', new Date().toISOString());
  await firebaseService.set('system/status', 'ACTIVE');
  await firebaseService.set('system/databaseType', 'Firebase Realtime Database');

  console.log('🎉 Database seeding complete!');
  return results;
}

// If executed directly from CLI: node src/scripts/seed.js
if (process.argv[1]?.endsWith('seed.js')) {
  runDatabaseSeed()
    .then((results) => {
      console.log('Seed summary:', JSON.stringify(results, null, 2));
      process.exit(0);
    })
    .catch((err) => {
      console.error('Fatal seed error:', err);
      process.exit(1);
    });
}

