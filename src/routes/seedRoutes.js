import { Router } from 'express';
import { runDatabaseSeed } from '../scripts/seed.js';

const router = Router();

// Trigger DB seed
router.post('/', async (req, res, next) => {
  try {
    const summary = await runDatabaseSeed();
    res.json({
      success: true,
      message: 'Krushi Drushti Firebase Realtime Database seeded successfully',
      summary
    });
  } catch (err) {
    next(err);
  }
});

export default router;

