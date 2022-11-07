const db = require('../../models/model');
const StatusEnum = require('../../utils/enum.utils');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Op = require('sequelize').Op;
const sequelize = require('sequelize');
const moment = require('moment');
const transactionService = require('../../service/transaction.service');

module.exports.topData = async (req, res, next) => {
    await db.sequelize.query('CALL DashboardData (:days,:incomeCode,:expenseCode,:todayDate)', {
      replacements: {
        days: 7,
        incomeCode: '401',
        expenseCode: '301',
        todayDate: moment().format('YYYY-MM-DD')
      }
    })
    .then(function (result) {
      res.send(result);
    });
  }

module.exports.dashboardApex = async (req, res, next) => {
    db.sequelize.query('CALL DashboardApex (:days,:todayDate)', {
        replacements: {
          days: req.params.days,
          todayDate: moment().format('YYYY-MM-DD')
        }
      })
      .then(async function (data) {
        res.send(data);
      })
  }
  
  //expenseAccountReview
  module.exports.expenseAccountReview = async (req, res, next) => {
    await transactionService.dashboardEAR().then(data => {
      res.status(200).send(data);
    });
  }
    
  //lastTransactionsForDashboard
  module.exports.last5transaction = async (req, res, next) => {
    await transactionService.lastTransactionsForDashboard().then(data => {
      res.status(200).send(data);
    });
  }