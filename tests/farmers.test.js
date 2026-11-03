import test from 'node:test';
import assert from 'node:assert/strict';
import { createApp } from '../src/server.js';

test('Farmer API Routes', async (t) => {
  const app = createApp();
  const server = app.listen(0);
  const port = server.address().port;
  const baseUrl = `http://localhost:${port}/api/farmers`;

  t.after(() => server.close());

  await t.test('POST /api/farmers should validate required fields', async () => {
    const res = await fetch(baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Incomplete Farmer' })
    });
    assert.equal(res.status, 400);
    const body = await res.json();
    assert.equal(body.success, false);
    assert.ok(body.error.message.includes('Missing required field'));
  });

  await t.test('POST /api/farmers should register a new farmer', async () => {
    const newFarmer = {
      name: 'Balasaheb Shinde',
      phone: '+919876501234',
      state: 'Maharashtra',
      district: 'Kolhapur',
      landHoldingAcres: 5.0,
      language: 'mr'
    };

    const res = await fetch(baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newFarmer)
    });
    assert.equal(res.status, 201);
    const body = await res.json();
    assert.equal(body.success, true);
    assert.equal(body.data.name, 'Balasaheb Shinde');
    assert.ok(body.data.id);
  });

  await t.test('GET /api/farmers should return list of farmers', async () => {
    const res = await fetch(baseUrl);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.success, true);
    assert.ok(Array.isArray(body.data));
  });
});

