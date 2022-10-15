const errorMiddleware = require('../middleware/error.middleware');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const accountRoute = require('./account.route');

module.exports = function (app) {
    
    app.use(`/api/auth`, authRoute);
    app.use(`/api/user`, userRoute);
    app.use(`/api/account`, accountRoute);

    // 404 error
    app.all(['*'], (req, res, next) => {
        return res.json({
            statusCode:404,
            message:"Endpoint Not Found !",
            url:req.protocol + '://' + req.get('host') + req.originalUrl
        });
    });

    app.use(errorMiddleware);
}