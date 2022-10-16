const db = require('../models/model');
const jwt = require('jsonwebtoken');
const enumm = require('../utils/enum.utils');
const appConfig = require('../../config/config.json');

module.exports.auth = (...roles) => {
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
            req.currentBranchId = decoded.branchId;
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


module.exports.getSessionDetails = () => {
    return async function (req, res, next) {
        try {
            //#region Notifications
            if(req.session.notification){
                const notification = req.session.notification;
                if(notification[0]==enumm.notification.Error){
                    res.locals.error_Msg= notification[1];
                }
                else if(notification[0]==enumm.notification.Warning){
                    res.locals.war_Msg= notification[1];
                }
                else if(notification[0]==enumm.notification.Info){
                    res.locals.info_Msg= notification[1];
                }
                else if(notification[0]==enumm.notification.Success){
                    res.locals.succ_Msg= notification[1];
                }
                req.session.notification=null;
            }else{
                res.locals.error_Msg= undefined;
                res.locals.info_Msg= undefined;
                res.locals.war_Msg= undefined;
                res.locals.succ_Msg= undefined;
            }
            //#endregion

            sess = req.session;
            if (!sess || !sess.user) {
                next();
            }
            else{
                const token = sess.user;
                const secretKey = appConfig.appSettings.SECRET_JWT;

                // Verify Token
                const decoded = jwt.verify(token, secretKey);

                if (!decoded.user_id && !decoded.roleId) {
                    next();
                }
                else{
                    req.locals.roleCode = decoded?decoded.roleCode:undefined;
                    req.locals.userName = decoded?decoded.userName:undefined;
                    req.locals.roleName = decoded?decoded.roleName:undefined;
                    req.locals.orgName = appConfig.organizationInfo.orgName;
                    req.locals.devOrgName = appConfig.organizationInfo.devOrgName;
                    req.locals.devOrgLink = appConfig.organizationInfo.devOrgLink;
                    req.locals.hostName= req.protocol + '://' + req.get('host');
                    next();
                }
            }
        } catch (e) {
            console.log(e)
            next();
            // res.redirect('/auth/logout');
        }
    }
}