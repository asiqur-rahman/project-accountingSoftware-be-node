const express = require('express');
const router = express.Router();
const {isLogedIn,webAuth,apiAuth} = require('../../middleware/auth.middleware');
const enumm = require('../../utils/enum.utils');
const authRouter = require('./auth.route');
const portalRouter = require('./portal.route');
const reportRouter = require('./report.route');
const Logger = require('../../externalService/log.service');
const log = new Logger('index.js');

router.use('/', (req, res, next) => {
  log.CreateLog(enumm.logFor.route,"Route ",req.protocol + '://' + req.get('host') + req.originalUrl);
  next();
});

router.use('/auth', isLogedIn(), authRouter);
router.use('/portal', webAuth(), portalRouter);
router.use('/report', webAuth(), reportRouter);

// Route all to login page
router.get('/', (req, res, next) => {
  res.redirect('/auth/login');
});

// 404 error
router.all('*', (req, res, next) => {
  res.render('Pages/pages-404', {
    layout: false
  });
});

module.exports = router;