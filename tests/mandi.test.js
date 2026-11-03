import test from 'node:test';
import assert from 'node:assert/strict';
import { createApp } from '../src/server.js';
import { mandiService } from '../src/services/mandiService.js';

test('Mandi APMC Price Engine', async (t) => {
  const app = createApp();
  const server = app.listen(0);
  const port = server.address().port;
  const baseUrl = `http://localhost:${port}/api/mandi`;

  t.after(() => server.close());

  // Setup sample mandi records
  await mandiService.addPriceRecord({
    id: 'test_mandi_onion',
    market: 'Lasalgaon APMC',
    state: 'Maharashtra',
    district: 'Nashik',
    commodity: 'Onion',
    minPrice: 1900,
    maxPrice: 2700,
    modalPrice: 2400
  });

  await t.test('GET /api/mandi should return mandi price records', async () => {
    const res = await fetch(baseUrl);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.success, true);
    assert.ok(Array.isArray(body.data));
    assert.ok(body.data.length >= 1);
  });

  await t.test('GET /api/mandi?commodity=Onion should filter by commodity', async () => {
    const res = await fetch(`${baseUrl}?commodity=Onion`);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.ok(body.data.length >= 1);
    assert.ok(body.data.every(item => item.commodity.toLowerCase().includes('onion')));
  });

  await t.test('GET /api/mandi/analytics/:commodity should calculate price analytics', async () => {
    const res = await fetch(`${baseUrl}/analytics/Onion`);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.success, true);
    assert.ok(body.data.averageModalPrice > 0);
    assert.ok(body.data.highestModalPrice >= body.data.lowestModalPrice);
  });
});

