const db = require('../../models/model');
const enumm = require('../../utils/enum.utils');
const appConfig = require('../../../config/config.json');
const Op = require('sequelize').Op;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userService = require('../../service/user.service');
const Logger = require('../../externalService/log.service');
const log = new Logger('index.js');
const axios = require('axios');

module.exports.login_Get = async (req, res, next) => {
  res.render('Auth/auth-login', {
    layout: false
  });
}

module.exports.login_Post = async (req, res, next) => {
  await axios.post(`http://localhost:3332/api/auth/login`, req.body)
  .then((response) => {
    console.log(response.data)
    req.session.user=response.data.token;
    // res.locals.title = 'Dashboard';
    // res.render('Dashboard/portal');
    return res.send(response.data); 
  });
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
  return res.redirect('/auth/login');
  // res.render('Auth/auth-login', { 'message': req.flash('message'), 'error': req.flash('error') ,layout: false});
};

// hash password if it exists
hashPassword = async (req) => {
  if (req.body.password) {
    req.body.password = await bcrypt.hash(req.body.password, 8);
  }
}