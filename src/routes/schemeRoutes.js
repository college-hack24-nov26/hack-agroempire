import { Router } from 'express';
import { firebaseService } from '../services/firebaseService.js';

const router = Router();

// GET all government agriculture schemes & subsidies
router.get('/', async (req, res, next) => {
  try {
    const raw = await firebaseService.get('schemes');
    const schemes = raw ? Object.values(raw) : [];
    res.json({
      success: true,
      count: schemes.length,
      data: schemes
    });
  } catch (err) {
    next(err);
  }
});

// GET scheme by ID
router.get('/:id', async (req, res, next) => {
  try {
    const scheme = await firebaseService.get(`schemes/${req.params.id}`);
    if (!scheme) {
      return res.status(404).json({
        success: false,
        error: { message: `Scheme ${req.params.id} not found`, statusCode: 404 }
      });
    }
    res.json({
      success: true,
      data: scheme
    });
  } catch (err) {
    next(err);
  }
});

export default router;

