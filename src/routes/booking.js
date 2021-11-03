const Router = require('@koa/router')
const router = new Router({ prefix: '/booking' })

router.post('/', async (ctx, next) => {
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

router.delete('/', async (ctx, next) => {
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

router.patch('/', async (ctx, next) => {
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


module.exports = router