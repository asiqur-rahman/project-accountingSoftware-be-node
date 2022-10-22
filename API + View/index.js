//#region Library
const app = require('express')();
const express = require('express');
const path = require('path');
const fs = require('fs');
const compression = require('compression')
const http = require('http');
const https = require('https');
const RouteService = require('./src/routes/routes');
const config = require('./config/config.json');
const session = require('express-session');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const i18n = require("i18n-express");
var minifyHTML = require('express-minify-html-2');
const Logger = require('./src/externalService/console.log.service');
const log = new Logger('index.js');
//#endregion

//#region SSL
var sslOptions = {
    key: fs.readFileSync('./ssl/key.pem'),
    cert: fs.readFileSync('./ssl/cert.cert'),
    ca: fs.readFileSync('./ssl/ca.ca-bundle', {
        encoding: 'utf8'
    }).split('-----END CERTIFICATE-----\r\n').map(cert => cert + '-----END CERTIFICATE-----\r\n')
};
//#endregion

//#region Application Configuration
app.use(compression()); // compress all responses
app.use(minifyHTML({ // minify all html responsesls
    override:      false,
    exception_url: [
        '/\<%.*?\%>/i',
        /\<%.*?\%>/i, // Regex.
    ],
    htmlMinifier: {
        removeComments:            true,
        collapseWhitespace:        true,
        collapseBooleanAttributes: true,
        removeAttributeQuotes:     true,
        removeEmptyAttributes:     true,
        minifyJS:                  true
    }
}));

app.use(session({
  key: config.appSettings.SECRET_KEY,
  secret: config.appSettings.SECRET_JWT,
  resave: true,
  saveUninitialized: true,
  httpOnly: true,  // dont let browser javascript access cookie ever
  cookie: {
    // secure: true,
    expires: new Date(Date.now() + config.appSettings.SessionTimeOut),
    // maxAge : config.appConfig.SessionTimeOut
  }
}));

app.use(flash());
app.use(i18n({
  translationsPath: path.join(__dirname, 'i18n'), // <--- use here. Specify translations files path.
  siteLangs: ["es", "en", "de", "ru", "it", "fr", "ind"],
  textsVarName: 'translation'
}));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json({
    limit: '10mb'
}));

app.use('/public', express.static(path.join(__dirname, 'public')));

//For set layouts of html view
var expressLayouts = require('express-ejs-layouts');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressLayouts);

// Remove trailing slashes in url handle bad requests
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        log.debug('Request Error', {
            header: req.headers,
            body: req.body,
            error: err.message,
        });
        return res.status(400).send({
            status: 404,
            message: err.message
        }); // Bad request
    }
    if (req.path.substr(-1) === '/' && req.path.length > 1) {
        let query = req.url.slice(req.path.length);
        res.redirect(301, req.path.slice(0, -1) + query);
    } else {
        next();
    }
});
//#endregion

//#region Server Start and Routing

// Turn config
const turnUrls = config.serverSettings.Mode_Production ? config.serverSettings.TURN_URLS : 'turn:numb.viagenie.ca';
const turnUsername = config.serverSettings.Mode_Production ? config.serverSettings.TURN_USERNAME : 'webrtc@live.com';
const turnCredential = config.serverSettings.Mode_Production ? config.serverSettings.TURN_PASSWORD : 'muazkh';

const iceServers = [];

iceServers.push({
    urls: 'stun:stun.l.google.com:19302',
}, {
    urls: turnUrls,
    username: turnUsername,
    credential: turnCredential,
}, );

//#region Server Start
log.debug('Server IceServers ', {
    iceServers: iceServers,
});
if(config.appSettings.httpPort){
    const httpPort = Number(process.env.PORT || config.appSettings.httpPort);
    http.createServer(app).listen(httpPort, function () {
        log.debug('HTTP Server Ready ', {
            port: config.appSettings.httpPort,
            node_version: process.versions.node,
        });
    });
  }
  if(config.appSettings.httpsPort){
    const httpsServer = https.createServer(sslOptions, app);
    io = require('socket.io')(httpsServer, {
        maxHttpBufferSize: 1e7,
        transports: ['polling'] //['polling','websocket'] // Only using polling for auto re-connection
    });
    httpsServer.listen(Number(process.env.PORT || config.appSettings.httpsPort), () => {
        log.debug('HTTPS Server Ready ', {
            port: config.appSettings.httpsPort,
            node_version: process.versions.node,
        });
    });
    require('./src/socketEvent/socketEvent')(io,iceServers); 
  }
//#endregion

RouteService(app);
//#endregion
