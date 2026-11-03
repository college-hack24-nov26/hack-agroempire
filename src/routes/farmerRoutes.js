import { Router } from 'express';
import { firebaseService } from '../services/firebaseService.js';
import { requireFields } from '../middleware/validate.js';

const router = Router();

// GET all farmers
router.get('/', async (req, res, next) => {
  try {
    const raw = await firebaseService.get('farmers');
    const farmers = raw ? Object.values(raw) : [];
    res.json({
      success: true,
      count: farmers.length,
      data: farmers
    });
  } catch (err) {
    next(err);
  }
});

// GET farmer by ID
router.get('/:id', async (req, res, next) => {
  try {
    const farmer = await firebaseService.get(`farmers/${req.params.id}`);
    if (!farmer) {
      return res.status(404).json({
        success: false,
        error: { message: `Farmer with ID ${req.params.id} not found`, statusCode: 404 }
      });
    }
    res.json({ success: true, data: farmer });
  } catch (err) {
    next(err);
  }
});

// CREATE a new farmer
router.post('/', requireFields(['name', 'phone', 'state', 'district']), async (req, res, next) => {
  try {
    const id = `farmer_${Date.now()}`;
    const payload = {
      id,
      ...req.body,
      createdAt: new Date().toISOString()
    };
    await firebaseService.set(`farmers/${id}`, payload);
    res.status(201).json({
      success: true,
      message: 'Farmer registered successfully',
      data: payload
    });
  } catch (err) {
    next(err);
  }
});

// UPDATE farmer profile
router.put('/:id', async (req, res, next) => {
  try {
    const existing = await firebaseService.get(`farmers/${req.params.id}`);
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: { message: `Farmer with ID ${req.params.id} not found`, statusCode: 404 }
      });
    }
    const updated = await firebaseService.update(`farmers/${req.params.id}`, req.body);
    res.json({
      success: true,
      message: 'Farmer profile updated',
      data: updated
    });
  } catch (err) {
    next(err);
  }
});

export default router;

