const express = require('express');
const router = express.Router();
const {isLogedIn,webAuth,apiAuth} = require('../../middleware/auth.middleware');
const enumm = require('../../utils/enum.utils');
const authRouter = require('./auth.route');
const portalRouter = require('./portal.route');
const reportRouter = require('./report.route');
const Logger = require('../../externalService/log.service');
const appConfig = require('../../../config/config.json');

var path = require('path');
const log = new Logger(path.basename(__filename));

router.use('/', (req, res, next) => {
  res.locals.orgName = appConfig.organizationInfo.orgName;
  res.locals.devOrgName = appConfig.organizationInfo.devOrgName;
  res.locals.devOrgLink = appConfig.organizationInfo.devOrgLink;
  res.locals.hostName= req.protocol + '://' + req.get('host');
  res.locals.lastVisitedUrl= req.originalUrl
  // log.CreateLog(enumm.logFor.route,"Route ",req.protocol + '://' + req.get('host') + req.originalUrl);
  next();
});

router.use('/auth', isLogedIn(), authRouter);
router.use('/portal', portalRouter);
router.use('/report', reportRouter);

// Route all to login page
router.get('/', (req, res, next) => {
  // res.redirect('/auth/login');
  res.locals.title = 'Dashboard';
  res.locals.redirectTo="/auth/login";
  res.locals.areaToShow="areaToShow";
  res.render('Dashboard/portal');
});

// 404 error
router.all('*', (req, res, next) => {
  res.render('Pages/pages-404', {
    layout: false
  });
});

module.exports = router;