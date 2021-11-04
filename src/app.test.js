const request = require('supertest');
const app = require('./app')

test('get /', async () => {
    const response = await request(app.callback()).get('/');
    expect(response.status).toBe(404);
});