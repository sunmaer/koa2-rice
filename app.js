const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const chalk = require('chalk')

const routes = require('./router/routes')

// 错误处理
onerror(app)

// 加载中间件
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

// 设置请求响应头
app.use(async function(ctx, next) {
  ctx.set("Access-Control-Allow-Origin", ctx.request.header.origin)
  ctx.set("Access-Control-Allow-Credentials", true)
  ctx.set("Access-Control-Allow-Methods", "OPTIONS, GET, PUT, POST, DELETE")
  ctx.set("Access-Control-Allow-Headers", "x-requested-with, accept, origin, content-type")
  if (ctx.request.method === "OPTIONS") {
    ctx.response.status = 200
  }
  await next()
})

// 打印日志信息
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// 路由
app.use(routes.routes(), routes.allowedMethods())

// 错误处理
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
})

module.exports = app
