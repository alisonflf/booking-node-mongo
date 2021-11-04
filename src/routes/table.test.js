const request = require('supertest');
const app = require('../app')

test('create table', async () => {
    const response = await request(app.callback())
        .post('/table')
        .send({
            number: 1
        })

    expect(response.status).toBe(200);
    expect(response.body._id).toBeDefined();
});

test('create preexisting table', async () => {
    await request(app.callback())
        .post('/table')
        .send({
            number: 2
        })

    const response = await request(app.callback())
        .post('/table')
        .send({
            number: 2
        })

    expect(response.status).toBe(400);
    expect(response.text).toBe('table already exists');
});

test('get List of Tables', async () => {
    await request(app.callback())
        .post('/table')
        .send({
            number: 3
        })

    const response = await request(app.callback()).get('/table');
    expect(response.status).toBe(200);
    expect(response.body.tables).toBeDefined();
});


