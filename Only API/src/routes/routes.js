const errorMiddleware = require('../middleware/error.middleware');
const apiRoute = require('./api.routes/api.route');
module.exports = function (app) {
    app.use(`/api`, apiRoute);
    app.use(errorMiddleware);
}