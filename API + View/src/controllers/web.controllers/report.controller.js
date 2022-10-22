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
  await reportingService.getIncomeStatement().then(data=>{
    res.locals.title= 'Income Statement';
    res.locals.data = data;
    res.render('Report/incomeStatement');
  });
}

//#endregion
