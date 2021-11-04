const request = require('supertest');
const app = require('../app')

test('make a booking', async () => {
    await request(app.callback())
        .post('/settings')
        .send({
            "restaurant_name": "Test",
            "initial_time": 8,
            "final_time": 22
        })

    await request(app.callback()).post('/table').send({ number: 10 });

    const response = await request(app.callback()).post('/booking').send(
        {
            "table": 10,
            "date": "2021-11-03T12:00:00.470Z",
            "customer": "Customer",
            "chairs": 4
        }
    );

    expect(response.status).toBe(200);
});

test('try to make a booking for the same table and time', async () => {
    await request(app.callback())
        .post('/settings')
        .send({
            "restaurant_name": "Test",
            "initial_time": 8,
            "final_time": 22
        })

    await request(app.callback()).post('/table').send({ number: 11 });

    await request(app.callback()).post('/booking').send(
        {
            "table": 11,
            "date": "2021-11-03T12:00:00.470Z",
            "customer": "Customer",
            "chairs": 4
        }
    );

    const response = await request(app.callback()).post('/booking').send(
        {
            "table": 11,
            "date": "2021-11-03T12:00:00.470Z",
            "customer": "New Customer",
            "chairs": 5
        }
    );


    expect(response.status).toBe(400);
    expect(response.text).toBe('date not available for this table');
});

test('remove a booking', async () => {
    await request(app.callback())
        .post('/settings')
        .send({
            "restaurant_name": "Test",
            "initial_time": 8,
            "final_time": 22
        })

    await request(app.callback()).post('/table').send({ number: 12 });

    await request(app.callback()).post('/booking').send(
        {
            "table": 12,
            "date": "2021-11-03T12:00:00.470Z",
            "customer": "Customer",
            "chairs": 4
        }
    );

    const response = await request(app.callback())
        .delete('/booking')
        .send(
            {
                "table": 12,
                "date": "2021-11-03T12:00:00.470Z"
            }
        );


    expect(response.status).toBe(200);
    expect(response.text).toBe('booking removed');
});