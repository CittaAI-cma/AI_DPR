import assert from 'node:assert/strict';
import { after, describe, it } from 'node:test';
import { config } from 'dotenv';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import mongoose from 'mongoose';

config({ path: join(dirname(fileURLToPath(import.meta.url)), '../.env') });

const base = process.env.API_BASE_URL || 'http://localhost:5000/api';
const password = process.env.E2E_PASSWORD || 'Rbac-Test-2026';
const consultantEmail = process.env.E2E_EMAIL || 'rbac.consultant@msme.test';
const adminEmail = process.env.E2E_ADMIN_EMAIL || 'rbac.admin@msme.test';
const schemeCode = 'ZZ_API_TEST';
const unitName = `API test unit ${Date.now()}`;
const style = { preset: 'government', pictures: [] as unknown[] };

let projectId = '';
let dprId = '';

async function login(email: string, secret: string) {
  const response = await fetch(`${base}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password: secret }),
  });
  const body = await response.json();
  return { status: response.status, body };
}

function authHeaders(token: string) {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

after(async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) return;
  await mongoose.connect(uri);
  const db = mongoose.connection.db;
  if (db) {
    if (projectId) {
      await db.collection('projects').deleteOne({ _id: new mongoose.Types.ObjectId(projectId) });
      await db.collection('dprversions').deleteMany({ projectId });
    }
    await db.collection('projects').deleteMany({ projectName: unitName });
    await db.collection('schemedocumentstyles').deleteOne({ schemeCode });
  }
  await mongoose.disconnect();
});

describe('live API', () => {
  it('signs in the consultant and rejects a bad password', async () => {
    const health = await fetch(`${base}/health`);
    assert.equal(health.status, 200, `API is not running at ${base}`);

    const bad = await login(consultantEmail, 'not-the-password');
    assert.equal(bad.status, 401);
    assert.equal(bad.body.success, false);

    const good = await login(consultantEmail, password);
    assert.equal(good.status, 200);
    assert.equal(good.body.success, true);
    assert.equal(typeof good.body.data.token, 'string');
    assert.ok(good.body.data.token.length > 20);
    assert.equal(good.body.data.email, consultantEmail);
    assert.equal(good.body.data.role, 'entrepreneur');
  });

  it('saves an individual draft for the signed-in consultant', async () => {
    const session = await login(consultantEmail, password);
    assert.equal(session.status, 200);
    const token = session.body.data.token;

    const refused = await fetch(`${base}/dpr/cluster/draft/save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clusterData: { isIndividualDPR: true, step1: { unitName } },
      }),
    });
    assert.equal(refused.status, 401);

    const saved = await fetch(`${base}/dpr/cluster/draft/save`, {
      method: 'POST',
      headers: authHeaders(token),
      body: JSON.stringify({
        clusterData: {
          isIndividualDPR: true,
          step1: { unitName, district: 'Visakhapatnam', location: 'Anakapalli' },
        },
      }),
    });
    const body = await saved.json();
    assert.equal(saved.status, 200, body.message || 'draft save failed');
    assert.equal(body.success, true);
    assert.equal(body.data.projectName, unitName);
    assert.match(body.data.projectId, /^[a-f0-9]{24}$/);
    assert.match(body.data.dprId, /^[a-f0-9]{24}$/);
    projectId = body.data.projectId;
    dprId = body.data.dprId;

    const loaded = await fetch(`${base}/dpr/cluster/${dprId}`, {
      headers: authHeaders(token),
    });
    const loadedBody = await loaded.json();
    assert.equal(loaded.status, 200);
    assert.equal(loadedBody.success, true);
  });

  it('lets an admin save a scheme default and refuses the consultant', async () => {
    const consultant = await login(consultantEmail, password);
    const admin = await login(adminEmail, password);
    assert.equal(consultant.status, 200);
    assert.equal(admin.status, 200);
    assert.equal(admin.body.data.role, 'admin');

    const blocked = await fetch(`${base}/dpr/scheme-style/${schemeCode}`, {
      method: 'PUT',
      headers: authHeaders(consultant.body.data.token),
      body: JSON.stringify({ documentStyle: style }),
    });
    const blockedBody = await blocked.json();
    assert.equal(blocked.status, 403);
    assert.equal(blockedBody.success, false);

    const saved = await fetch(`${base}/dpr/scheme-style/${schemeCode}`, {
      method: 'PUT',
      headers: authHeaders(admin.body.data.token),
      body: JSON.stringify({ documentStyle: style }),
    });
    const savedBody = await saved.json();
    assert.equal(saved.status, 200, savedBody.message || 'scheme default save failed');
    assert.equal(savedBody.success, true);
    assert.equal(savedBody.data.documentStyle.preset, 'government');

    const read = await fetch(`${base}/dpr/scheme-style/${schemeCode}`, {
      headers: authHeaders(consultant.body.data.token),
    });
    const readBody = await read.json();
    assert.equal(read.status, 200);
    assert.equal(readBody.data.documentStyle.preset, 'government');
  });
});
