const request = require('supertest');
const app = require('./app')

test('get List of Tables', async () => {
    const response = await request(app.callback()).get('/table');
    expect(response.status).toBe(200);
});