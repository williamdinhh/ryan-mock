import request from 'supertest';
import { createApp } from '../src/app';

const app = createApp();

describe('GET /api/flags', () => {
  it('returns the seeded flags', async () => {
    const res = await request(app).get('/api/flags');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });
});

describe('GET /api/flags/:key', () => {
  it('returns 404 for an unknown flag', async () => {
    const res = await request(app).get('/api/flags/does-not-exist');
    expect(res.status).toBe(404);
  });

  it('returns the flag when it exists', async () => {
    const res = await request(app).get('/api/flags/dark-mode');
    expect(res.status).toBe(200);
    expect(res.body.key).toBe('dark-mode');
  });
});

describe('POST /api/flags/:key/evaluate', () => {
  it('requires a userId', async () => {
    const res = await request(app).post('/api/flags/dark-mode/evaluate').send({});
    expect(res.status).toBe(400);
  });

  it('evaluates a flag for a user', async () => {
    const res = await request(app)
      .post('/api/flags/dark-mode/evaluate')
      .send({ userId: 'user-42' });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('enabled');
  });
});

describe('PATCH /api/flags/:key', () => {
  it('updates a flag', async () => {
    const res = await request(app)
      .patch('/api/flags/export-csv')
      .send({ enabled: true });
    expect(res.status).toBe(200);
    expect(res.body.enabled).toBe(true);
  });
});
