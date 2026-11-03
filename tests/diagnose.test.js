import test from 'node:test';
import assert from 'node:assert/strict';
import { createApp } from '../src/server.js';

test('Crop Doctor AI Diagnostics', async (t) => {
  const app = createApp();
  const server = app.listen(0);
  const port = server.address().port;
  const baseUrl = `http://localhost:${port}/api/diagnose`;

  t.after(() => server.close());

  await t.test('POST /api/diagnose should evaluate symptoms and return vernacular prescription', async () => {
    const res = await fetch(baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        farmerId: 'farmer_001',
        crop: 'Tomato',
        symptomsText: 'Concentric rings on leaves and premature dropping',
        language: 'mr'
      })
    });

    assert.equal(res.status, 201);
    const body = await res.json();
    assert.equal(body.success, true);
    assert.equal(body.data.crop, 'Tomato');
    assert.ok(body.data.diseaseDetected.includes('Early Blight'));
    assert.ok(body.data.confidenceScore > 0.7);
    assert.ok(body.data.treatment.organic.mr);
    assert.ok(body.data.treatment.chemical.mr);
  });

  await t.test('GET /api/diagnose/plantnet-status should return API quota and projects', async () => {
    const res = await fetch(`${baseUrl}/plantnet-status`);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.success, true);
    assert.ok(body.data.apiKeyConfigured);
    assert.ok(body.data.online);
  });

  await t.test('POST /api/diagnose with imageBuffer should process botanical identification', async () => {
    // 1x1 test png buffer
    const testPngBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';
    const form = new FormData();
    const blob = new Blob([Buffer.from(testPngBase64, 'base64')], { type: 'image/png' });
    form.append('image', blob, 'sample_leaf.png');
    form.append('crop', 'Tomato');
    form.append('symptomsText', 'Yellowing leaves and brown circular spots');
    form.append('language', 'mr');

    const res = await fetch(baseUrl, {
      method: 'POST',
      body: form
    });

    assert.equal(res.status, 201);
    const body = await res.json();
    assert.equal(body.success, true);
    assert.ok(body.data.crop);
    assert.ok(body.data.diseaseDetected);
    assert.ok(body.data.treatment.organic.mr);
  });

  await t.test('GET /api/diagnose/history should retrieve previous scans', async () => {
    const res = await fetch(`${baseUrl}/history`);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.success, true);
    assert.ok(Array.isArray(body.data));
    assert.ok(body.data.length >= 1);
  });
});
