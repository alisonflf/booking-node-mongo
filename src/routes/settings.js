const Router = require('@koa/router')
const router = new Router({ prefix: '/settings' })


router.post('/', async (ctx, next) => {
    const body = ctx.request.body

    ctx.checkBody('initial_time', 'Invalid postparam').notEmpty().isInt()
    ctx.checkBody('final_time', 'Invalid postparam').notEmpty().isInt()

    const errors = await ctx.validationErrors()

    if (errors) {
        ctx.throw(400, 'validation error');
    }

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

router.put('/', async (ctx, next) => {
    const body = ctx.request.body

    ctx.checkBody('initial_time', 'Invalid postparam').notEmpty().isInt()
    ctx.checkBody('final_time', 'Invalid postparam').notEmpty().isInt()

    const errors = await ctx.validationErrors()

    if (errors) {
        ctx.throw(400, 'validation error');
    }

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

module.exports = router