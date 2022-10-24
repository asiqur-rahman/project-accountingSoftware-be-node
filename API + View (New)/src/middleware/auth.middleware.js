const db = require('../models/model');
const jwt = require('jsonwebtoken');
const enumm = require('../utils/enum.utils');
const appConfig = require('../../config/config.json');

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

module.exports.webAuth = (...roles) => {
    return async function (req, res, next) {
        try {
            // res.session.returnUrl = req.originalUrl;
            // sess = req.session;
            // console.log(req.session.user)
            if (!req.session || !req.session.user) {
                req.session.notification=[enumm.notification.Error,'Access denied. No credentials sent !'];
                console.log('Access denied. No credentials sent !')
                return res.redirect('/auth/logout');
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
                return res.redirect('/auth/logout');
            }

            // if the current user is not the owner and
            // if the user role don't have the permission to do this action.
            // the user will get this error
            if ( roles && roles.length && !roles.includes(decoded.role_id)) {
                return res.redirect('/auth/logout');
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
                res.locals.orgName = appConfig.organizationInfo.orgName;
                res.locals.devOrgName = appConfig.organizationInfo.devOrgName;
                res.locals.devOrgLink = appConfig.organizationInfo.devOrgLink;
                res.locals.hostName= req.protocol + '://' + req.get('host');
                res.locals.lastVisitedUrl= req.originalUrl
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

module.exports.notification = () => {
    return function (req, res, next) {
        //#region Notifications
        if(req.session.notification){
            const notification = req.session.notification;
            res.locals.toast_Msg=notification;
            // if(notification[0]==enumm.notification.Error){
            //     res.locals.error_Msg= notification[1];
            // }
            // else if(notification[0]==enumm.notification.Warning){
            //     res.locals.war_Msg= notification[1];
            // }
            // else if(notification[0]==enumm.notification.Info){
            //     res.locals.info_Msg= notification[1];
            // }
            // else if(notification[0]==enumm.notification.Success){
            //     res.locals.succ_Msg= notification[1];
            // }
            req.session.notification=null;
        }else{
            res.locals.error_Msg= undefined;
            res.locals.info_Msg= undefined;
            res.locals.war_Msg= undefined;
            res.locals.succ_Msg= undefined;
        }
        //#endregion
        next();
    }
}


module.exports.isLogedIn = (...roles) => {
    return async function (req, res, next) {
        try {
            res.locals.orgName = appConfig.organizationInfo.orgName;
            res.locals.devOrgName = appConfig.organizationInfo.devOrgName;
            res.locals.devOrgLink = appConfig.organizationInfo.devOrgLink;
            res.locals.hostName= req.protocol + '://' + req.get('host');
            
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
            if (clientIp.toString() == decoded.clientIp) {
                return res.redirect('/portal');
            } else {
                req.currentUser = -1;
                next();
            }
        } catch (e) {
            console.log("Catch : ",e)
            req.currentUser = -1;
            next();
        }
    }
}