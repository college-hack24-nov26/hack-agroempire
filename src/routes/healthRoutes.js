import { Router } from 'express';
import { firebaseService } from '../services/firebaseService.js';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const rtdbHealth = await firebaseService.ping();
    res.json({
      success: true,
      service: 'Krushi Drushti Smart Agriculture Platform API',
      version: '1.0.0',
      status: rtdbHealth.connected ? 'ONLINE' : 'DEGRADED',
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
      database: rtdbHealth
    });
  } catch (err) {
    next(err);
  }
});

export default router;

