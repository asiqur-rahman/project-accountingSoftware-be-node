const db = require('../../models/model');
const enumm = require('../../utils/enum.utils');
const appConfig = require('../../../config/config.json');
const sequelize = require('sequelize');
const Op = require('sequelize').Op;
const moment = require('moment');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const accountService = require('../../service/account.service');
const reportingService = require('../../service/reporting.service');
const userService = require('../../service/user.service');
const taxService = require('../../service/tax.service');
const { details } = require('@hapi/joi/lib/errors');

//#region Dashboard
module.exports.incomeStatement = async (req, res, next) => {
  const todayDate=moment().format("MM/DD/yyyy");
  res.locals.todayDate = todayDate;
  res.render('Report/incomeStatement',{layout:false});
}

module.exports.incomeStatementData = async (req, res, next) => {
  await reportingService.getIncomeStatement(req).then(data=>{
    res.locals.data = data;
    res.render('Report/incomeStatementDetails',{layout:false});
  });
}

module.exports.balanceSheet = async (req, res, next) => {
  await reportingService.getBalanceSheet().then(data=>{
    res.locals.title= 'Balance Sheet';
    res.locals.data = data;
    res.render('Report/balanceSheet',{layout:false});
  });
}

//#endregion
