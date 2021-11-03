const Koa = require('koa');
const mongo = require('koa-mongo')
var bodyParser = require('koa-bodyparser');

var router = require('./routes/index')

const app = new Koa();

// app.on('error', err => {
// console.log('server error', err)
// });

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
    .use(router())

module.exports = app;