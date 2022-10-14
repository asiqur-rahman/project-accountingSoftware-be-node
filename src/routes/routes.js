const errorMiddleware = require('../middleware/error.middleware');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');

module.exports = function (app) {
    
    app.use(`/api/auth`, authRoute);
    app.use(`/api/user`, userRoute);

    // 404 error
    app.all(['*'], (req, res, next) => {
        res.json({
            statusCode:404,
            message:"Endpoint Not Found !",
            url:req.protocol + '://' + req.get('host') + req.originalUrl
        });
        next(err);
    });

    app.use(errorMiddleware);
}