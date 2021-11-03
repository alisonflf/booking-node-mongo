const Koa = require('koa');
const Router = require('@koa/router');
const mongo = require('koa-mongo')
var bodyParser = require('koa-bodyparser');

const app = new Koa();
const router = new Router();

app.on('error', err => {
    console.log('server error', err)
});

router.get('/', (ctx, next) => {
    ctx.body = "hello world"
    return next
})

router.post('/restaurant', async (ctx, next) => {
    const body = ctx.request.body
    const result = await ctx.db.collection('settings').find().toArray()

    if (result.length === 0) {
        ctx.db.collection('settings').insertOne({
            restaurant_name: body.restaurant_name,
            initial_time: body.initial_time,
            final_time: body.final_time
        })

        ctx.body = "restaurant set"
    } else {
        ctx.throw(400, 'restaurant already set');
    }

    return await next()
});

router.put('/restaurant', async (ctx, next) => {
    const body = ctx.request.body
    const result = await ctx.db.collection('settings').find().toArray()

    if (result.length !== 0) {
        ctx.db.collection('settings').updateOne({
            _id: result[0]._id
        }, {
            $set: {
                restaurant_name: body.restaurant_name,
                initial_time: body.initial_time,
                final_time: body.final_time
            }
        })

        ctx.body = "restaurant set"
    } else {
        ctx.throw(400, 'no restaurant configured');
    }

    return await next()
});

router.post('/table', async (ctx, next) => {
    const body = ctx.request.body

    const result = await ctx.db.collection('tables').find({ number: body.number }).toArray()

    if (result.length === 0) {
        const createdTable = await ctx.db.collection('tables').insertOne({ number: body.number, bookings: [] })
        ctx.body = createdTable.ops[0]
    } else {
        ctx.throw(400, 'table already exists');
    }

    return await next()
});

router.get('/table', async (ctx, next) => {
    const result = await ctx.db.collection('tables').find().toArray()
    ctx.body = {
        tables: result.map(table => {
            return { number: table.number, bookings: table.bookings }
        })
    }

    return await next()
});


router.post('/booking', async (ctx, next) => {
    const body = ctx.request.body

    const table = await ctx.db.collection('tables').find({
        number: body.table
    }).toArray()

    if (table.length === 0) {
        ctx.throw(400, 'table not found');
    }

    const reservated = await ctx.db.collection('tables').find({
        "number": body.table,
        "bookings.date": new Date(body.date)
    }).toArray()

    if (reservated.length === 0) {
        await ctx.db.collection('tables').updateOne(
            { "_id": table[0]._id },
            {
                $set: {
                    "bookings":
                        [
                            ...table[0].bookings,
                            {
                                customer: body.customer,
                                chairs: body.chairs,
                                date: new Date(body.date)
                            }]
                }
            })
        ctx.body = 'table booked'
    } else {
        ctx.throw(400, 'date not available for this table');
    }

    return await next()
});

router.delete('/booking', async (ctx, next) => {
    const body = ctx.request.body

    const table = await ctx.db.collection('tables').find({
        number: body.table
    }).toArray()

    if (table.length === 0) {
        ctx.throw(400, 'table not found');
    }

    const reservated = await ctx.db.collection('tables').find({
        "number": body.table,
        "bookings.date": new Date(body.date)
    }).toArray()

    if (reservated.length !== 0) {
        await ctx.db.collection('tables').updateOne(
            { "_id": table[0]._id },
            {
                $set: {
                    "bookings": table[0].bookings.filter((r) => {
                        return r.date.getTime() !== new Date(body.date).getTime()
                    })
                }
            })
        ctx.body = 'booking removed'
    } else {
        ctx.throw(400, 'date not booked');
    }

    return await next()
});

router.patch('/booking', async (ctx, next) => {
    const body = ctx.request.body

    const table = await ctx.db.collection('tables').find({
        number: body.table
    }).toArray()

    if (table.length === 0) {
        ctx.throw(400, 'table not found');
    }

    const reservated = await ctx.db.collection('tables').find({
        "number": body.table,
        "bookings.date": new Date(body.date)
    }).toArray()

    if (reservated.length !== 0) {
        await ctx.db.collection('tables').updateOne(
            { "_id": table[0]._id },
            {
                $set: {
                    "bookings":
                        [
                            ...table[0].bookings.filter((r) => {
                                return r.date.getTime() !== new Date(body.date).getTime()
                            }),
                            {
                                customer: body.customer,
                                chairs: body.chairs,
                                date: new Date(body.date)
                            }
                        ]
                }
            })
        ctx.body = 'booking updated'
    } else {
        ctx.throw(400, 'date not booked');
    }

    return await next()
});

app
    .use(mongo({
        host: 'localhost',
        port: 27017,
        user: 'root',
        pass: 'root',
        db: 'local',
        authSource: 'admin',
        max: 100,
        min: 1
    }))
    .use(bodyParser())
    .use(router.routes())
    .use(router.allowedMethods());

module.exports = app;