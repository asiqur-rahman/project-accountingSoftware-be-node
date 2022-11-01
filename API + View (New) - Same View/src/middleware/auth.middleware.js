const db = require('../models/model');
const jwt = require('jsonwebtoken');
const enumm = require('../utils/enum.utils');
const appConfig = require('../../config/config.json');
const Logger = require('../externalService/log.service');

var path = require('path');
const log = new Logger(path.basename(__filename));

module.exports.apiAuth = (...roles) => {
    return async function (req, res, next) {
        try {
            const authHeader = req.headers.authorization;
            const bearer = 'Bearer ';
            if (!authHeader || !authHeader.startsWith(bearer)) {
                return res.status(200).json({
                    status:401,
                    message:"Access denied. No credentials sent !"
                });
            }

            const token = authHeader.replace(bearer, '');
            const secretKey = appConfig.appSettings.SECRET_JWT;

            // Verify Token
            const decoded = jwt.verify(token, secretKey);
            // const user = await UserModel.findOne({ id: decoded.user_id });
            // const user = await db.user.scope('authPurpose').findOne({ 
            //     where:{id:decoded.user_id},
            //     include:db.role,
            //     raw:true
            //  });
            //console.log(user);

            if (!decoded.user_id && !decoded.roleId) {
                return res.status(200).json({
                    status:401,
                    message:"Authentication failed !"
                });
            }

            // if the current user is not the owner and
            // if the user role don't have the permission to do this action.
            // the user will get this error
            if ( roles && roles.length && !roles.includes(decoded.role_id)) {
                return res.status(200).json({
                    status:401,
                    message:"Unauthorized !"
                });
            }
            // if the user has permissions
            req.currentUser = decoded.user_id;
            req.currentBranchId = decoded.branch_Id;
            req.currentRoleId = decoded.role_id;
            
            //check Client IP
            // console.log(decoded.clientIp);
            var clientIp= req.headers['x-forwarded-for'] || req.socket.remoteAddress || null;
            // console.log(clientIp);
            
            if(clientIp.toString()==decoded.clientIp){
                next();
            }else{
                next();
                // res.json({
                //     status:401,
                //     message:"Unauthorized IP Address ! --"+clientIp.toString()+"--"+decoded.clientIp+"--"
                // });
            }

        } catch (e) {
            e.status = 401;
            next(e);
        }
    }
}

module.exports.webAuth_ = (...roles) => {
    return async function (req, res, next) {
        try {
            // res.session.returnUrl = req.originalUrl;
            // sess = req.session;
            // console.log(req.session.user)
            if (!req.session || !req.session.user) {
                return res.status(401).json({
                    msg: [enumm.notification.Error, 'Access denied. No credentials sent !'],
                    redirect:'/portal'
                });
            }
            const token = req.session.user;
            const secretKey = appConfig.appSettings.SECRET_JWT;

            // Verify Token
            const decoded = jwt.verify(token, secretKey);
            // const user = await UserModel.findOne({ id: decoded.user_id });
            // const user = await db.user.scope('authPurpose').findOne({ 
            //     where:{id:decoded.user_id},
            //     include:db.role,
            //     raw:true
            //  });
            // console.log(decoded);

            if (!decoded.user_id && !decoded.roleId) {
                return res.status(401).json({
                    msg: [enumm.notification.Error, 'Unauthorized'],
                    redirect:'/portal'
                });
            }

            // if the current user is not the owner and
            // if the user role don't have the permission to do this action.
            // the user will get this error
            if ( roles && roles.length && !roles.includes(decoded.role_id)) {
                return res.status(401).json({
                    msg: [enumm.notification.Error, 'Unauthorized'],
                    redirect:'/portal'
                });
            }
            // if the user has permissions
            req.currentUser = decoded.user_id;
            req.currentBranchId = decoded.branchId;
            req.currentRoleId = decoded.role_id;
            
            //check Client IP
            // console.log(decoded.clientIp);
            var clientIp= req.headers['x-forwarded-for'] || req.socket.remoteAddress || null;
            // console.log(clientIp);
            // if(clientIp.toString()==decoded.clientIp){
                res.locals.roleCode = decoded?decoded.role_code:undefined;
                res.locals.userName = decoded?decoded.user_name:undefined;
                res.locals.roleName = decoded?decoded.role_name:undefined;
                next();
            // }else{
            //     return res.redirect('/auth/logout');
            // }

        } catch (e) {
            e.status = 401;
            next(e);
        }
    }
}


module.exports.webAuth = (...roles) => {
    return async function (req, res, next) {
        try {
            // res.session.returnUrl = req.originalUrl;
            // sess = req.session;
            log.CreateLog(enumm.logFor.auth,"Auth Purpose (TOKEN)",req.session?req.session.user:null);
            if (!req.session || !req.session.user) {
                req.session.notification=[enumm.notification.Error,'Access denied. No credentials sent !'];
                console.log('Access denied. No credentials sent !');
                // req.session.destroy();
                return req.originalUrl == '/portal' ? res.redirect('/auth/logout'):res.status(302).send();
            }
            const token = req.session.user;
            const secretKey = appConfig.appSettings.SECRET_JWT;

            // Verify Token
            const decoded = jwt.verify(token, secretKey);
            // const user = await UserModel.findOne({ id: decoded.user_id });
            // const user = await db.user.scope('authPurpose').findOne({ 
            //     where:{id:decoded.user_id},
            //     include:db.role,
            //     raw:true
            //  });
            // console.log(decoded);

            if (!decoded.user_id && !decoded.roleId) {
                // req.session.destroy();
                return req.originalUrl == '/portal' ? res.redirect('/auth/logout'):res.status(302).send();
            }

            // if the current user is not the owner and
            // if the user role don't have the permission to do this action.
            // the user will get this error
            if ( roles && roles.length && !roles.includes(decoded.role_id)) {
                // req.session.destroy();
                return req.originalUrl == '/portal' ? res.redirect('/auth/logout'):res.status(302).send();
            }
            // if the user has permissions
            req.currentUser = decoded.user_id;
            req.currentBranchId = decoded.branchId;
            req.currentRoleId = decoded.role_id;
            
            //check Client IP
            // console.log(decoded.clientIp);
            var clientIp= req.headers['x-forwarded-for'] || req.socket.remoteAddress || null;
            // console.log(clientIp);
            // if(clientIp.toString()==decoded.clientIp){
                res.locals.roleCode = decoded?decoded.role_code:undefined;
                res.locals.userName = decoded?decoded.user_name:undefined;
                res.locals.roleName = decoded?decoded.role_name:undefined;
                next();
            // }else{
            //     return res.redirect('/auth/logout');
            // }

        } catch (e) {
            e.status = 401;
            next(e);
        }
    }
}

module.exports.isLogedIn = (...roles) => {
    return async function (req, res, next) {
        try {
            var sess = req.session;
            if (!sess || !sess.user) {
                req.currentUser = -1;
                return next();
            }
            const token = sess.user;
            const secretKey = appConfig.appSettings.SECRET_JWT;
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
            req.roleCode = decoded.role_code;
            // //check Client IP
            var clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || null;
            // if (clientIp.toString() == decoded.clientIp) {
                return res.redirect('/portal');
            // } else {
            //     req.currentUser = -1;
            //     next();
            // }
        } catch (e) {
            console.log("Catch : ",e)
            req.currentUser = -1;
            next();
        }
    }
}