//#region Library
const app = require('express')();
const path = require('path');
const fs = require('fs');
const compression = require('compression')
const http = require('http');
const https = require('https');
const RouteService = require('./src/routes/routes');
const config = require('./config/config.json');
const bodyParser = require('body-parser');
const cors = require('cors');
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

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json({
    limit: '10mb'
}));

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
