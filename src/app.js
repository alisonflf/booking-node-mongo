const Koa = require('koa');
const mongo = require('koa-mongo')
const bodyParser = require('koa-bodyparser');
const koaValidator = require('koa-async-validator')

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
    .use(koaValidator())
    .use(router())

module.exports = app;