let express      = require('express'),
    path         = require('path'),
    favicon      = require('serve-favicon'),
    logger       = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser   = require('body-parser'),
    compress     = require('compression'),
    debug        = require('debug')('server'),
    http         = require('http'),
    routes       = require('./routes')

let app          = express(),
    port         = parseInt(process.env.PORT, 10) || 3000

//// APP SETUP ////

app.use(compress())
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, '../public'), { maxAge: 31536000 }))
app.set('port', port)

//// ROUTE HANDLERS ////

app.use('/api', routes)
app.use( (req, res) => res.sendFile(path.join(__dirname, '../public/index.html')) )

//// ERROR HANDLER ////

app.use( (err, req, res)  => {
    res.status(err.status || 500).send({
        message: err.message,
        error:   (process.env.ENV === 'development') ? err : {}
    })
})

//// SERVER CREATION ////

let server = http.createServer(app)
server.listen(port)
server.on('listening', () => debug('Listening on ' + server.address().port || server.address()) )