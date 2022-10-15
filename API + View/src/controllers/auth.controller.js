const db = require('../models/model');
const enumm = require('../utils/enum.utils');
const {
  appConfig
} = require('../config/config');
const Op = require('sequelize').Op;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports.get_Login = async (req, res, next) => {
  res.render('Auth/auth-login', {
    layout: false
  });
};

module.exports.post_Login = async (req, res, next) => {
  var clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || null;
  console.log("LoginIp : "+clientIp)
  const {
    username,
    password
  } = req.body;
  const user = await db.user.scope('loginPurpose').findOne({
    where: {
      [Op.or]: [{
        username: username
      }]
    },
    include: [{
        model: db.role
      },
      {
        model: db.detailsInfo,
        attributes: ['employeeCode','name','email']
      }
    ],
    raw: true
  });
  if (!user) {
    req.session.notification=[enumm.notification.Error,'Unable to login !'];
    res.redirect('/login');
  } 
  else if (user.isActive!=1) {
    req.session.notification=[enumm.notification.Error,'You access was revoked by admin! Please contact with admin.'];
    res.redirect('/login');
  }else {
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      var dashboard="";
      req.session.notification=[enumm.notification.Error,'Incorrect password !'];
      res.redirect('/login');
    } else {
      // user matched!
      const secretKey = appConfig.SECRET_JWT || "";
      
      if (user['role.code'] == enumm.role.SuperUser || user['role.code'] == enumm.role.Admin) {
        dashboard='/portal-get-dashboard';
      } else if (user['role.code'] == enumm.role.Manager) {
        dashboard='/portal-employee-attendance';
      } else if (user['role.code'] == enumm.role.Employee) {
        dashboard='/portal-employee-attendance';
      }

      const token = jwt.sign({
        user_name: user.username,
        employee_code: user['detailsInfo.employeeCode'],
        user_id: user.id.toString(),
        role_code: user['role.code'].toString(),
        role_name: user['role.name'].toString(),
        force_change_password: user.forceChangePassword,
        clientIp: clientIp.toString(),
        dashboard:dashboard
      }, secretKey, {
        expiresIn: appConfig.SessionTimeOut
      });
      req.session.user = token;
      if(user.forceChangePassword==1){
        req.session.notification=[enumm.notification.Warning,'Hi,  '+user['detailsInfo.name']+'</br>Please change your password !'];
        // req.flash(enumm.notification.Info, 'Hi,  '+user['detailsInfo.name']+'</br>Please change your password');
      }
      else{
        req.session.notification=[enumm.notification.Info,'Hi,  '+user['detailsInfo.name']+'</br>Welcome to Chicken man.'];
        // req.flash(enumm.notification.Success, 'Hi,  '+user['detailsInfo.name']+'</br>Welcome to Chicken man.');
      }

      const returnUrl=req.session.returnUrl;
      if(returnUrl){
        req.session.returnUrl=null;
        res.redirect(returnUrl);
      }
      else{
        if (user['role.code'] == enumm.role.SuperUser || user['role.code'] == enumm.role.Admin) {
          res.redirect('/portal-get-dashboard');
        } else if (user['role.code'] == enumm.role.Manager) {
          res.redirect('/portal-attendance-entry');
        } else if (user['role.code'] == enumm.role.Employee) {
          res.redirect('/portal-attendance-entry');
        } else {
          req.flash('error', 'Sorry, You Have No Access !');
          res.redirect('/logout');
        }
      }
    }
  }
};

module.exports.logout = async (req, res, next) => {
  // Assign  null value in session
  const notification= req.session.notification;
  // sess = req.session;
  // sess.user = null;
  req.session.returnUrl=null;
  req.session.user=null;
  req.session.notification = notification;
  req.session.destroy();
  res.redirect('/login');
  // res.render('Auth/auth-login', { 'message': req.flash('message'), 'error': req.flash('error') ,layout: false});
};

// hash password if it exists
hashPassword = async (req) => {
  if (req.body.password) {
    req.body.password = await bcrypt.hash(req.body.password, 8);
  }
}