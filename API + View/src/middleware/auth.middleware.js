const db = require('../models/model');
const jwt = require('jsonwebtoken');
const enumm = require('../utils/enum.utils');
const {
    appConfig
} = require('../config/config');

module.exports.auth = (...roles) => {
    return async function (req, res, next) {
        try {
            req.session.returnUrl = req.originalUrl;
            // sess = req.session;
            if (!req.session && !req.session.user) {
                req.session.notification=[enumm.notification.Error,'Access denied. No credentials sent !'];
                console.log('Access denied. No credentials sent !')
                res.redirect('/logout');
            }
            const token = req.session.user;
            const secretKey = appConfig.SECRET_JWT || "";
            // Verify Token
            const decoded = jwt.verify(token, secretKey);
            if (!decoded.user_id && !decoded.roleId) {
                req.session.notification=[enumm.notification.Error,"Authentication failed !"];
                res.redirect('/logout');
            }

            // if the current user is not the owner and
            // if the user role don't have the permission to do this action.
            // the user will get this error

            if (roles.length && !roles.includes(decoded.role_code)) {
                req.session.notification=[enumm.notification.Error,"Unauthorized Access! Don't try to do this again !"];
                // req.flash('error', "Unauthorized Access! Don't try to do this again !");
                res.redirect('/logout');
            }
            req.currentUser = decoded.user_id;
            req.roleCode = decoded.role_code;
            req.roleName = decoded.role_name;
            req.forceChangePassword = decoded.force_change_password;
            req.currentEmployeeCode = decoded.employee_code;

            //check Client IP
            // console.log(decoded.clientIp);
            var clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || null;
            // console.log(clientIp);
            // if (clientIp.toString() == decoded.clientIp) {
                next();
            // } else {
            //     req.session.notification=[enumm.notification.Error,'Unauthorized IP Address !'];
            //     res.redirect('/logout');
            // }
        } catch (e) {
            // req.flash('error', 'Session Expired !');
            req.session.notification=[enumm.notification.Error,'Session not found !'];
            res.redirect('/login');
        }
    }
}


module.exports.isLogedIn = (...roles) => {
    return async function (req, res, next) {
        try {
            sess = req.session;
            if (!sess && !sess.user) {
                req.currentUser = -1;
                next()
            }
            const token = sess.user;
            const secretKey = appConfig.SECRET_JWT || "";

            // Verify Token
            const decoded = jwt.verify(token, secretKey);

            if (!decoded.user_id && !decoded.roleId) {
                req.currentUser = -1;
                next();
            }

            // if the current user is not the owner and
            // if the user role don't have the permission to do this action.
            // the user will get this error
            if (roles.length && !roles.includes(decoded.role_id)) {
                req.currentUser = -1;
                next();
            }
            // if the user has permissions
            req.currentUser = decoded.user_id;
            req.currentEmployeeCode = decoded.employee_code;
            req.roleCode = decoded.role_code;
            // //check Client IP
            // console.log(decoded.clientIp);
            var clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || null;
            // console.log(clientIp);
            if (clientIp.toString() == decoded.clientIp) {
                res.redirect('/portal-get-dashboard');
            } else {
                req.currentUser = -1;
                next();
            }
        } catch (e) {
            // console.log("Catch : ",e)
            req.currentUser = -1;
            next();
        }
    }
}

module.exports.getDetailsFromSess = (req) => {
    try {
        sess = req.session;
        if (!sess && !sess.user) {
            return null;
        }
        const token = sess.user;
        const secretKey = appConfig.SECRET_JWT || "";

        // Verify Token
        const decoded = jwt.verify(token, secretKey);

        if (!decoded.user_id && !decoded.roleId) {
            return null;
        }
        return {
            roleCode: decoded.role_code,
            userName: decoded.user_name,
            roleName: decoded.role_name,
            currentEmployeeCode: decoded.employee_code,
            dashboard: decoded.dashboard
        };
    } catch (e) {
        return null;
    }
}