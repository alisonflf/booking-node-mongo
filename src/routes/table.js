const Router = require('@koa/router')
const router = new Router({ prefix: '/table' })

router.post('/', async (ctx, next) => {
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

router.get('/', async (ctx, next) => {
    const result = await ctx.db.collection('tables').find().toArray()
    ctx.body = {
        tables: result.map(table => {
            return { number: table.number, bookings: table.bookings }
        })
    }

    return await next()
});


module.exports = router