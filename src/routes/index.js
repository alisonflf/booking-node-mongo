const combineRouters = require('koa-combine-routers');

const tableRouter = require('./table');
const settingsRouter = require('./settings');
const bookingRouter = require('./booking');

const router = combineRouters(
    settingsRouter,
    tableRouter,
    bookingRouter
)

module.exports = router