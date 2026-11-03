/**
 * Krushi Drushti - Authentication Routes
 */

import { Router } from 'express';
import { authService } from '../services/authService.js';
import { requireFields } from '../middleware/validate.js';

const router = Router();

// POST /api/auth/register - Register farmer in Firebase RTDB
router.post('/register', requireFields(['name', 'email', 'phone', 'password', 'village']), async (req, res, next) => {
  try {
    const { name, email, phone, password, village, state, district, landHoldingAcres, language } = req.body;

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: { message: 'Password must be at least 6 characters long.', statusCode: 400 }
      });
    }

    const user = await authService.register({
      name,
      email,
      phone,
      password,
      village,
      state,
      district,
      landHoldingAcres,
      language
    });

    res.status(201).json({
      success: true,
      message: 'Farmer registered successfully in Firebase Realtime Database',
      data: user
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: { message: err.message, statusCode: 400 }
    });
  }
});

// POST /api/auth/login - Validate farmer login against Firebase RTDB
router.post('/login', requireFields(['email', 'password']), async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await authService.login({ email, password });

    res.json({
      success: true,
      message: 'Login successful',
      data: user
    });
  } catch (err) {
    res.status(401).json({
      success: false,
      error: { message: err.message, statusCode: 401 }
    });
  }
});

// GET /api/auth/profile/:id - Fetch current farmer profile
router.get('/profile/:id', async (req, res, next) => {
  try {
    const user = await authService.getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: { message: 'Farmer not found', statusCode: 404 }
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (err) {
    next(err);
  }
});

export default router;
