const Koa = require('koa');
const mongo = require('koa-mongo')
var bodyParser = require('koa-bodyparser');

var router = require('./routes/index')

const app = new Koa();

app
    .use(mongo({
        host: process.env.DATABASE_HOST,
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