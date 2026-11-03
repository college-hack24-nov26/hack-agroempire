import { Router } from 'express';
import { weatherService } from '../services/weatherService.js';
import { requireFields } from '../middleware/validate.js';

const router = Router();

// GET weather advisories
router.get('/', async (req, res, next) => {
  try {
    const { district } = req.query;
    const advisories = await weatherService.getAdvisories(district);
    res.json({
      success: true,
      count: advisories.length,
      data: advisories
    });
  } catch (err) {
    next(err);
  }
});

// POST check spraying window suitability
router.post('/spray-check', requireFields(['temperatureC', 'humidityPercent', 'rainProbabilityPercent']), async (req, res, next) => {
  try {
    const { temperatureC, humidityPercent, rainProbabilityPercent, windSpeedKmph = 10 } = req.body;
    const result = weatherService.evaluateSprayWindow({
      temperatureC: Number(temperatureC),
      humidityPercent: Number(humidityPercent),
      rainProbabilityPercent: Number(rainProbabilityPercent),
      windSpeedKmph: Number(windSpeedKmph)
    });
    res.json({
      success: true,
      data: result
    });
  } catch (err) {
    next(err);
  }
});

// POST save weather advisory
router.post('/', requireFields(['district', 'state', 'temperatureC']), async (req, res, next) => {
  try {
    const saved = await weatherService.saveAdvisory(req.body);
    res.status(201).json({
      success: true,
      message: 'Weather advisory saved',
      data: saved
    });
  } catch (err) {
    next(err);
  }
});

export default router;

