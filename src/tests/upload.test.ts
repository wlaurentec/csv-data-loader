import request from 'supertest';
import { describe, beforeAll, it, expect } from "vitest";
import { app } from '../app';
import path from 'path';
import { sign } from 'jsonwebtoken';

const jwtSecret = 'ultra-secret';

describe('Upload Endpoints', () => {
  let token: string;

  beforeAll(() => {
    const payload = { userId: 1, userRole: 'admin' };
    token = sign(payload, jwtSecret, { expiresIn: '5m' });
  });

  it('should upload CSV file successfully', async () => {
    const res = await request(app)
      .post('/upload')
      .set('Authorization', `Bearer ${token}`)
      .attach('csv', path.resolve(__dirname, 'test.csv'));
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(res.body.data.success).toBeDefined();
    expect(res.body.data.errors).toBeDefined();
  });

  it('should fail to upload CSV file without authentication', async () => {
    const res = await request(app).post('/upload').attach('csv', path.resolve(__dirname, 'test.csv'));
    expect(res.status).toBe(401);
  });

  it('should fail to upload CSV file with invalid CSV data', async () => {
    const res = await request(app)
      .post('/upload')
      .set('Authorization', `Bearer ${token}`)
      .attach('csv', path.resolve(__dirname, 'invalid.csv'));
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(res.body.data.success.length).toBe(0);
    expect(res.body.data.errors.length).toBeGreaterThan(0);
  });
});
