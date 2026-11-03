import { Router } from 'express';
import { firebaseService } from '../services/firebaseService.js';

const router = Router();

// GET all crops
router.get('/', async (req, res, next) => {
  try {
    const raw = await firebaseService.get('crops');
    const crops = raw ? Object.values(raw) : [];
    res.json({
      success: true,
      count: crops.length,
      data: crops
    });
  } catch (err) {
    next(err);
  }
});

// GET crop by ID
router.get('/:id', async (req, res, next) => {
  try {
    const crop = await firebaseService.get(`crops/${req.params.id}`);
    if (!crop) {
      return res.status(404).json({
        success: false,
        error: { message: `Crop with ID ${req.params.id} not found`, statusCode: 404 }
      });
    }
    res.json({ success: true, data: crop });
  } catch (err) {
    next(err);
  }
});

export default router;

