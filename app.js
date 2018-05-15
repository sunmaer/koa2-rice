const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const query = require('./mysql/db')

const login = require('./routes/login')
const index = require('./routes/index')
const users = require('./routes/users')

// app.all('*', (req, res, next) => {
// 	res.header("Access-Control-Allow-Origin", req.headers.Origin || req.headers.origin || 'https://cangdu.org');
// 	res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
// 	res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
//   res.header("Access-Control-Allow-Credentials", true); //可以带cookies
// 	res.header("X-Powered-By", '3.2.1')
// 	if (req.method == 'OPTIONS') {
// 	  	res.send(200);
// 	} else {
// 	    next();
// 	}
// })

// error handler
onerror(app)

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes
app.use(login.routes(), login.allowedMethods())
app.use(index.routes(), index.allowedMethods())
app.use(users.routes(), users.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
})

module.exports = app
