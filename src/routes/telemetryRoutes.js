import { Router } from 'express';
import { telemetryService } from '../services/telemetryService.js';
import { requireFields } from '../middleware/validate.js';

const router = Router();

// GET all sensor telemetry
router.get('/', async (req, res, next) => {
  try {
    const { farmerId } = req.query;
    let data;
    if (farmerId) {
      data = await telemetryService.getByFarmerId(farmerId);
    } else {
      data = await telemetryService.getAllTelemetry();
    }
    res.json({
      success: true,
      count: data.length,
      data
    });
  } catch (err) {
    next(err);
  }
});

// POST ingest sensor telemetry & trigger smart irrigation
router.post('/', requireFields(['farmerId', 'soilMoisturePercent']), async (req, res, next) => {
  try {
    const result = await telemetryService.ingestTelemetry(req.body);
    res.status(201).json({
      success: true,
      message: 'Telemetry ingested and irrigation logic evaluated',
      data: result
    });
  } catch (err) {
    next(err);
  }
});

export default router;

