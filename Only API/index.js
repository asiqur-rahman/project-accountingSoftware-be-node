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
const cors = require('cors');
var minifyHTML = require('express-minify-html-2');
const Logger = require('./src/externalService/log.service');
const log = new Logger(path.basename(__filename));
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

app.use(cors());

//#region Application Configuration
app.use(compression()); // compress all responses
app.use(minifyHTML({
    override:      true,
    exception_url: false,
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
  httpOnly: true,
  cookie: {
    // secure: true,
    expires: new Date(Date.now() + config.appSettings.SessionTimeOut),
    // maxAge : config.appConfig.SessionTimeOut
  }
}));

app.use(flash());
app.use(i18n({
  translationsPath: path.join(__dirname, 'i18n'), // <--- use here. Specify translations files path.
  siteLangs: ["en", "ind"],
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
    httpsServer.listen(Number(process.env.PORT || config.appSettings.httpsPort), () => {
        log.debug('HTTPS Server Ready ', {
            port: config.appSettings.httpsPort,
            node_version: process.versions.node,
        });
    });
  }

RouteService(app);
//#endregion
