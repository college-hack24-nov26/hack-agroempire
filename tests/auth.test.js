import test from 'node:test';
import assert from 'node:assert/strict';
import { createApp } from '../src/server.js';

test('Farmer Authentication & Firebase RTDB Integration', async (t) => {
  const app = createApp();
  const server = app.listen(0);
  const port = server.address().port;
  const baseUrl = `http://localhost:${port}/api/auth`;

  t.after(() => server.close());

  const testEmail = `farmer_${Date.now()}@krushi.in`;
  const testPhone = `98${Math.floor(10000000 + Math.random() * 90000000)}`;

  await t.test('POST /api/auth/register should fail on missing fields', async () => {
    const res = await fetch(`${baseUrl}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Incomplete' })
    });
    assert.equal(res.status, 400);
    const body = await res.json();
    assert.equal(body.success, false);
  });

  await t.test('POST /api/auth/register should successfully store farmer in Firebase RTDB', async () => {
    const res = await fetch(`${baseUrl}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Dnyaneshwar Shinde',
        email: testEmail,
        phone: testPhone,
        password: 'securePassword123',
        village: 'Lasalgaon',
        district: 'Nashik',
        state: 'Maharashtra'
      })
    });

    assert.equal(res.status, 201);
    const body = await res.json();
    assert.equal(body.success, true);
    assert.equal(body.data.name, 'Dnyaneshwar Shinde');
    assert.equal(body.data.email, testEmail.toLowerCase());
    assert.equal(body.data.village, 'Lasalgaon');
    assert.ok(body.data.id);
    assert.equal(body.data.passwordHash, undefined, 'Password hash must never leak in response');
  });

  await t.test('POST /api/auth/register should reject duplicate email', async () => {
    const res = await fetch(`${baseUrl}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Duplicate Shinde',
        email: testEmail,
        phone: '9999999999',
        password: 'securePassword123',
        village: 'Lasalgaon'
      })
    });

    assert.equal(res.status, 400);
    const body = await res.json();
    assert.equal(body.success, false);
    assert.ok(body.error.message.includes('already registered'));
  });

  await t.test('POST /api/auth/login should authenticate farmer with correct password', async () => {
    const res = await fetch(`${baseUrl}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: 'securePassword123'
      })
    });

    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.success, true);
    assert.equal(body.data.email, testEmail.toLowerCase());
    assert.equal(body.data.name, 'Dnyaneshwar Shinde');
  });

  await t.test('POST /api/auth/login should reject wrong password', async () => {
    const res = await fetch(`${baseUrl}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: 'wrongPassword!'
      })
    });

    assert.equal(res.status, 401);
    const body = await res.json();
    assert.equal(body.success, false);
    assert.ok(body.error.message.includes('Invalid password'));
  });
});
