import { Router } from 'express';
import { mandiService } from '../services/mandiService.js';
import { requireFields } from '../middleware/validate.js';

const router = Router();

// GET mandi prices with filters
router.get('/', async (req, res, next) => {
  try {
    const { commodity, state, district, market } = req.query;
    const prices = await mandiService.getPrices({ commodity, state, district, market });
    res.json({
      success: true,
      count: prices.length,
      data: prices
    });
  } catch (err) {
    next(err);
  }
});

// GET mandi analytics for a commodity
router.get('/analytics/:commodity', async (req, res, next) => {
  try {
    const analytics = await mandiService.getCommodityAnalytics(req.params.commodity);
    res.json({
      success: true,
      data: analytics
    });
  } catch (err) {
    next(err);
  }
});

// POST new mandi rate arrival
router.post('/', requireFields(['market', 'state', 'district', 'commodity', 'modalPrice']), async (req, res, next) => {
  try {
    const record = await mandiService.addPriceRecord(req.body);
    res.status(201).json({
      success: true,
      message: 'Mandi price record saved',
      data: record
    });
  } catch (err) {
    next(err);
  }
});

export default router;

