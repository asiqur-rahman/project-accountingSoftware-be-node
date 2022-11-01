const errorMiddleware = require('../middleware/error.middleware');
const apiRoute = require('./api.routes/api.route');
const webRoute = require('./web.routes/web.route');

module.exports = function (app) {
    
    app.use(`/api`, apiRoute);
    app.use(`/`, webRoute);
    app.use(errorMiddleware);

}