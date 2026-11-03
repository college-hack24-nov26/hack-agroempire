import test from 'node:test';
import assert from 'node:assert/strict';
import { createApp } from '../src/server.js';

test('GET /api/health should return system status and database health', async () => {
  const app = createApp();
  const server = app.listen(0);
  const port = server.address().port;

  try {
    const res = await fetch(`http://localhost:${port}/api/health`);
    assert.equal(res.status, 200);

    const body = await res.json();
    assert.equal(body.success, true);
    assert.equal(body.service, 'Krushi Drushti Smart Agriculture Platform API');
    assert.ok(body.database);
    assert.ok(body.database.databaseUrl);
  } finally {
    server.close();
  }
});

