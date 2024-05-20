import request from 'supertest';
import { describe, it, expect } from "vitest";
import { app } from '../app';

describe('Auth Endpoints', () => {
  it('should login successfully with correct credentials', async () => {
    const res = await request(app)
      .post('/login')
      .send({ email: 'lechuga@gmail.com', password: '123456' });
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(res.body.data.token).toBeDefined();
  });

  it('should fail login with incorrect credentials', async () => {
    const res = await request(app)
      .post('/login')
      .send({ email: 'admin@example.com', password: 'wrongpassword' });
    expect(res.status).toBe(400);
    expect(res.body.ok).toBe(false);
  });
});
