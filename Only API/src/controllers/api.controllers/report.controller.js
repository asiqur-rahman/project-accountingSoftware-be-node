const db = require('../../models/model');
const StatusEnum = require('../../utils/enum.utils');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Op = require('sequelize').Op;
const accountService = require('../../service/account.service');
const reportingService = require('../../service/reporting.service');

module.exports.incomeStatement = async(req, res, next) => {
    await reportingService.getIncomeStatement(req)
    .then(user=>{
        return res.status(200).send(user);
    }).catch(e=>{
        return res.status(e.status).send(e);
    })
};

module.exports.balanceSheet = async(req, res, next) => {
    await reportingService.getBalanceSheet()
    .then(data=>{
        return res.send(data);
    }).catch(e=>{
        return res.status(e.status).send(e);
    })
};

module.exports.getCustomReport = async (req, res, next) => {
    await reportingService.getCustomReport(req)
    .then(data=>{
        return res.send(data);
    }).catch(e=>{
        return res.status(e.status).send(e);
    })
  }
  