'use strict'

const express = require('express')
const app = express()
const server = require('http').createServer(app)
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const passport = require('passport')
// const session = require('express-session')
// const MongoStore = require('connect-mongo')(session)
const apiRouter = require('./router/api')
const viewsRouter = require('./router/views')
// const { database, secret } = require('./config')

// const sessionConfig = {
//   secret,
//   cookie: {count: 0},
//   resave: true,
//   saveUninitialized: true,
//   store: new MongoStore({
//     url: database,
//     autoReconnect: true
//   })
// }

// app.use(session(sessionConfig))

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin')
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials')
  res.header('Access-Control-Allow-Credentials', 'true')
  next()
})

app.use(cookieParser())
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(passport.initialize())
app.use(passport.session())
app.use(morgan('dev'))
app.use(cors())

// Rutas
apiRouter(app)
viewsRouter(app)

module.exports = server
