import request from 'supertest';

import server from '../../src/index';

describe('health check', () => {
    it('GET /health responds healthy', async () => {
        const { body, status } = await request(server).get('/health');
        expect(status).toBe(200);
        
        expect(body).toHaveProperty('timestamp');
        expect(body).toHaveProperty('uptime');
        expect(body).toHaveProperty('message');

        expect(typeof body.timestamp).toBe('number');
        expect(typeof body.uptime).toBe('number');
        expect(typeof body.message).toBe('string');

        expect(body.message).toBe('OK');
    });

    it('GET /custom responds unauthorized', async () => {
        const response = await request(server).get('/custom');
        const { body, status } = response;
        expect(status).toBe(401);
        
        expect(body).toHaveProperty('message');
        expect(typeof body.message).toBe('string');

        expect(body.message).toBe('Authentication Error');
    });
  
    afterAll(done => {
        server.close(done);
    });
});
