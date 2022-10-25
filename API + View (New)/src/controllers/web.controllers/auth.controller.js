const db = require('../../models/model');
const enumm = require('../../utils/enum.utils');
const appConfig = require('../../../config/config.json');
const Op = require('sequelize').Op;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userService = require('../../service/user.service');

module.exports.login_Get = async (req, res, next) => {
  res.render('Auth/auth-login', {
    layout: false
  });
}

module.exports.login_Post = async (req, res, next) => {
  var clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || null;
  const {
    username,
    password
  } = req.body;
  userService.getByName(username).then(async (user) => {
    if (!user) {
      req.session.notification = [enumm.notification.Error, 'Unable to login !'];
      res.redirect('/auth/login');
    } else if (user.isActive != 1) {
      req.session.notification = [enumm.notification.Error, 'You access was revoked by admin! Please contact with admin.'];
      res.redirect('/');
    } else {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        req.session.notification = [enumm.notification.Error, 'Incorrect password !'];
        res.redirect('/');
      } else {
        // user matched!
        const secretKey = appConfig.appSettings.SECRET_JWT;
        
        const fullName=`${user['userDetail.firstName']} ${user['userDetail.lastName']}`;
        const token = jwt.sign({
          user_name: user.username,
          full_name: fullName,
          user_id: user.id.toString(),
          role_id: user['userDetail.role.id'].toString(),
          role_code: user['userDetail.role.code'].toString(),
          role_name: user['userDetail.role.name'].toString(),
          force_change_password: user.forceChangePassword,
          clientIp: clientIp.toString()
        }, secretKey, {
          expiresIn: appConfig.appSettings.SessionTimeOut
        });
        req.session.user = token;
        const returnUrl = req.session.returnUrl;
        if (returnUrl) {
          req.session.returnUrl = null;
          res.redirect(returnUrl);
        } else {
          console.log(token,"Portal return")
          res.redirect('/portal');
        }
      }
    }
  })
  
};

module.exports.logout = async (req, res, next) => {
  // Assign  null value in session
  // sess = req.session;
  // sess.user = null;
  const notification = req.session.notification;
  req.session.returnUrl = null;
  req.session.user = null;
  req.session.notification = notification;
  req.session.destroy();
  // res.status(302).send()
  res.redirect('/auth/login');
  // res.render('Auth/auth-login', { 'message': req.flash('message'), 'error': req.flash('error') ,layout: false});
};

// hash password if it exists
hashPassword = async (req) => {
  if (req.body.password) {
    req.body.password = await bcrypt.hash(req.body.password, 8);
  }
}