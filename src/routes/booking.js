const Router = require('@koa/router')
const router = new Router({ prefix: '/booking' })

router.post('/', async (ctx, next) => {
    const body = ctx.request.body

    ctx.checkBody('table', 'Invalid postparam').notEmpty().isInt()
    ctx.checkBody('chairs', 'Invalid postparam').notEmpty().isInt()
    ctx.checkBody('customer', 'Invalid postparam').notEmpty()
    ctx.checkBody('date', 'Invalid postparam').notEmpty()

    const errors = await ctx.validationErrors()

    if (errors) {
        ctx.throw(400, 'validation error');
    }

    const settings = await ctx.db.collection('settings').find().toArray()

    if (settings.length === 0) {
        ctx.throw(400, 'restaurant not configured');
    }

    const table = await ctx.db.collection('tables').find({
        number: body.table
    }).toArray()

    if (table.length === 0) {
        ctx.throw(400, 'table not found');
    }

    if (new Date(body.date).getMinutes() !== 0 ||
        new Date(body.date).getSeconds() !== 0) {
        ctx.throw(400, 'you can only book slots of 1 hour, no partial time allowed');
    }

    if (new Date(body.date).getHours() < settings[0].initial_time ||
        new Date(body.date).getHours() > settings[0].final_time) {
        ctx.throw(400, 'the restaurant will not be opened at the selected time');
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

    ctx.checkBody('table', 'Invalid postparam').notEmpty().isInt()
    ctx.checkBody('date', 'Invalid postparam').notEmpty()

    const errors = await ctx.validationErrors()

    if (errors) {
        ctx.throw(400, 'validation error');
    }

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

    ctx.checkBody('table', 'Invalid postparam').notEmpty().isInt()
    ctx.checkBody('chairs', 'Invalid postparam').notEmpty().isInt()
    ctx.checkBody('customer', 'Invalid postparam').notEmpty()
    ctx.checkBody('date', 'Invalid postparam').notEmpty()

    const errors = await ctx.validationErrors()

    if (errors) {
        ctx.throw(400, 'validation error');
    }

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