const errorMiddleware = require('../middleware/error.middleware');
const authRoute = require('./auth.route');
const webRoute = require('./web.route');
const portalRoute = require('./portal.route');
const tvAddRoute = require('./tvAdd.route');
const {getDetailsFromSess} = require('../middleware/auth.middleware');
const {organizationInfo,appConfig}= require('../config/config')
const enumm = require('../utils/enum.utils');

module.exports = function (app) {

    app.use(function(req,res,next){
        const details=getDetailsFromSess(req);
        app.locals.roleCode = details?details.roleCode:undefined;
        app.locals.userName = details?details.userName:undefined;
        app.locals.roleName = details?details.roleName:undefined;
        app.locals.orgName = organizationInfo.orgName;
        app.locals.devOrgName = organizationInfo.devOrgName;
        app.locals.devOrglink = organizationInfo.devOrgLink;
        app.locals.superUserCode = enumm.role.SuperUser;
        app.locals.adminCode = enumm.role.Admin;
        app.locals.managerCode = enumm.role.Manager;
        app.locals.employeeCode = enumm.role.Employee;
        app.locals.currentEmployeeCode = details?details.currentEmployeeCode:undefined;
        app.locals.faceVerificationConfidence = appConfig.FaceVerificationConfidence;
        app.locals.dashboard = details?details.dashboard:'#';
        app.locals.hostName= req.protocol + '://' + req.get('host');
        if(req.session.notification){
            const notification = req.session.notification;
            if(notification[0]==enumm.notification.Error){
                app.locals.error_Msg= notification[1];//req.flash('errorMsg');
            }
            else if(notification[0]==enumm.notification.Warning){
                app.locals.war_Msg= notification[1];//req.flash('errorMsg');
            }
            else if(notification[0]==enumm.notification.Info){
                app.locals.info_Msg= notification[1];//req.flash('errorMsg');
            }
            else if(notification[0]==enumm.notification.Success){
                app.locals.succ_Msg= notification[1];//req.flash('errorMsg');
            }
            req.session.notification=null;
        }else{
            app.locals.error_Msg= undefined;
            app.locals.info_Msg= undefined;
            app.locals.war_Msg= undefined;
            app.locals.succ_Msg= undefined;
        }
        next();
    });

    app.use(`/`, webRoute);
    app.use(`/`, authRoute);
    app.use(`/`, portalRoute);
    app.use(`/`, tvAddRoute);
    
    // 404 error
    app.all('*', (req, res, next) => {
        res.render('Pages/pages-404', {
            layout: false
          });
    });

    app.use(errorMiddleware);
}