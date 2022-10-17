const db = require('../../models/model');
const enumm = require('../../utils/enum.utils');
const appConfig = require('../../../config/config.json');
const Op = require('sequelize').Op;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports.dashboard = async (req, res, next) => {
  res.locals = {
      title: 'Dashboard'
  };
  res.render('Dashboard/index');
}

module.exports.accountingHead = async (req, res, next) => {
  res.locals = {
      title: 'Dashboard'
  };
  res.render('AccountingHead/index');
}