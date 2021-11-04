const request = require('supertest');
const app = require('../app')

test('change restaurante settings', async () => {
    await request(app.callback())
        .post('/settings')
        .send({
            "restaurant_name": "Test",
            "initial_time": 8,
            "final_time": 22
        })

    const response = await request(app.callback())
        .put('/settings')
        .send({
            "restaurant_name": "Teste",
            "initial_time": 8,
            "final_time": 20
        })

    expect(response.text).toBe('restaurant set');
});