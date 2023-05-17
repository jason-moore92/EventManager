require('dotenv').config({
  // path: ".env.production"
})

const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const compression = require('compression')
const helmet = require('helmet')
const cors = require('cors')
const passport = require('passport')
const app = express()
const i18n = require('i18n')
const initMongo = require('./config/mongo')
const path = require('path')
const http = require('http')

const errorHandler = require('./app/utilities/errorHandler');


// Setup express server port from ENV, default: 3000
app.set('port', process.env.PORT || 3000)

// Enable only in development HTTP request logger middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

// append basedir
global.__basedir = __dirname;


// for parsing application/x-www-form-urlencoded
app.use(
  bodyParser.urlencoded({
    limit: '20mb',
    extended: true
  })
)

// for parsing json
app.use(
  bodyParser.json({
    limit: '20mb'
  })
)

// i18n
i18n.configure({
  locales: ['en', 'hi', 'ta', 'te'],
  directory: `${__dirname}/locales`,
  defaultLocale: 'en',
  objectNotation: true
})
app.use(i18n.init)

// Init all other stuff
app.use(cors());
app.use(passport.initialize())
app.use(compression())
app.use(helmet())
app.disable('x-powered-by')
app.use(express.static('public'))

app.engine('html', require('ejs').renderFile)
app.set('view engine', 'html')
app.use(require('./app/routes'))
// app.listen(app.get('port'))

// Init MongoDB
initMongo()

app.use(errorHandler);

// init server instance
const server = http.createServer(app)

server.listen(app.get('port'), err => {
  if (err) {
    console.log('server', 'could not start listening', err.message || err)
    process.exit()
  }
  console.log('env', `app starting in dev mode...`)
  console.log('server', `Express server is listening on ${app.get('port')}`)
})

module.exports = app // for testing
