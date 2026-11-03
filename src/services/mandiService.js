/**
 * Krushi Drushti - Mandi APMC Market Prices & Trends Service
 */

import { firebaseService } from './firebaseService.js';

class MandiService {
  /**
   * Get all APMC mandi rates with optional filters
   */
  async getPrices({ commodity, state, district, market } = {}) {
    const raw = await firebaseService.get('mandi_prices');
    if (!raw) return [];

    let list = Object.values(raw);

    if (commodity) {
      const q = commodity.toLowerCase();
      list = list.filter((item) => item.commodity?.toLowerCase().includes(q));
    }
    if (state) {
      const q = state.toLowerCase();
      list = list.filter((item) => item.state?.toLowerCase().includes(q));
    }
    if (district) {
      const q = district.toLowerCase();
      list = list.filter((item) => item.district?.toLowerCase().includes(q));
    }
    if (market) {
      const q = market.toLowerCase();
      list = list.filter((item) => item.market?.toLowerCase().includes(q));
    }

    return list;
  }

  /**
   * Market summary analytics (averages, price spread, highest paying mandi)
   */
  async getCommodityAnalytics(commodity) {
    const prices = await this.getPrices({ commodity });
    if (prices.length === 0) {
      return { commodity, count: 0, message: 'No mandi records found' };
    }

    let min = Infinity;
    let max = -Infinity;
    let sumModal = 0;
    let bestMandi = null;

    for (const p of prices) {
      if (p.modalPrice < min) min = p.modalPrice;
      if (p.modalPrice > max) {
        max = p.modalPrice;
        bestMandi = p.market;
      }
      sumModal += p.modalPrice;
    }

    const averageModalPrice = Math.round(sumModal / prices.length);
    return {
      commodity,
      recordCount: prices.length,
      averageModalPrice,
      highestModalPrice: max,
      lowestModalPrice: min,
      priceSpread: max - min,
      topPayingMarket: bestMandi,
      records: prices
    };
  }

  /**
   * Add or update an APMC arrival price record
   */
  async addPriceRecord(record) {
    const id = record.id || `mandi_${Date.now()}`;
    const payload = {
      id,
      ...record,
      arrivalDate: record.arrivalDate || new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString()
    };
    await firebaseService.set(`mandi_prices/${id}`, payload);
    return payload;
  }
}

export const mandiService = new MandiService();

