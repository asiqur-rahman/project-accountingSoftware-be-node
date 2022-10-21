const db = require('../../models/model');
const enumm = require('../../utils/enum.utils');
const appConfig = require('../../../config/config.json');
const sequelize = require('sequelize');
const Op = require('sequelize').Op;
const moment = require('moment');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const accountService = require('../../service/account.service');
const transactionService = require('../../service/transaction.service');
const userService = require('../../service/user.service');
const taxService = require('../../service/tax.service');
const { details } = require('@hapi/joi/lib/errors');

//#region Dashboard
module.exports.dashboard = async (req, res, next) => {
  db.sequelize.query('CALL DashboardData (:days,:incomeCode,:expenseCode)', {
    replacements: {
        days: 7,
        incomeCode:'401',
        expenseCode:'301'
    }
  })
  .then(async function (dashboardData) {
    await transactionService.lastTransactionsForDashboard().then(data=>{
      // console.log(data,dashboardData[0])
      res.locals.title= 'Dashboard';
      res.locals.dashboardData = dashboardData[0];
      res.locals.lTFD = data.rows;//lastTransactionsForDashboard
      res.render('Dashboard/index');
    });
  })
  
  
}
//#endregion

//#region User
module.exports.newUser = async (req, res, next) => {
  res.locals = {
      title: 'User Create',
  };
  res.render('User/create');
}

module.exports.userList = async (req, res, next) => {
  res.locals.title= 'User List';
  res.render('User/index');
}

module.exports.userListData = async (req, res, next) => {
  userService.indexData(req).then(data=>{
    res.status(200).send(data);
  });
}
//#endregion


//#region Chart of Account

module.exports.chartOfAccount = async (req, res, next) => {
  accountService.getTreeWiseData().then(data=>{
    res.locals = {
      title: 'Dashboard',
      toast_Msg:res.locals.toast_Msg,
      data:data
    };
    res.render('ChartOfAccount/index');
  })
}

module.exports.chartOfAccountListByParentId = async (req, res, next) => {
  accountService.chartOfAccountDDByParentId(req.params.id).then(chartOfAccountDDByParentId=>{
    res.status(200).send({ data:chartOfAccountDDByParentId});
  });
}

module.exports.newChartOfAccount_Get = async (req, res, next) => {
    accountService.chartOfAccountDD().then(chartOfAccountDD=>{
      accountService.currencyDD().then(currencyDD=>{
      res.locals = {
        title: 'Chart Of Account',
        toast_Msg:res.locals.toast_Msg,
        chartOfAccountDD:chartOfAccountDD,
        currencyDD:currencyDD,
      };
      res.render('ChartOfAccount/create');
    })
  })
}

module.exports.chartOfAccountByBaseCode = async (req, res, next) => {
  await accountService.chartOfAccountDDByBaseCode(req.params.code)
  .then(data=>{
      return res.status(200).send(data);
  }).catch(e=>{
      return res.status(e.status).send(e);
  })
}

module.exports.newchartOfAccount_Post = async (req, res, next) => {
  const area="Chart of Account"
  req.body.userId=req.currentUser;
  if (req.body.id && req.body.id > 0) {
      await db.ChartOfAccount.update(req.body, {
          where: {
              id: req.body.id
          }
      }).then(() => {
          req.session.notification=[enumm.notification.Success,'Chart Of Account updated successfully !'];
          res.redirect(`/portal/chartOfAccount`);
      }).catch(function (err) {
          res.locals = {
              title: `${area} Create`,
              model: req.body
          };
          req.session.notification=[enumm.notification.Error,'Chart Of Account not updated !'];
          res.render(`/portal/create`);
      });
  } else {
    accountService.getById(req.body.parentId).then(async data=>{
      req.body.name=`${data.name}:${req.body.name}`;
      req.body.level=data.name.split(':').length;
      req.body.baseCode=data.baseCode;
      await db.ChartOfAccount.create(req.body)
          .then((result) => {
              if (result) {
                  res.locals = {
                      title: `${area} Create`,
                  };
                  req.session.notification=[enumm.notification.Success,'Chart Of Account created successfully !'];
                  res.redirect(`/portal/chartOfAccount`);
              } else {
                  res.locals = {
                      title: `${area} Create`,
                      model: req.body
                  };
                  req.session.notification=[enumm.notification.Error,'Chart Of Account not created !'];
                  res.render(`/portal/create`);
              }
          });
    })
  }
}

//#endregion

//#region Transactions
module.exports.transactionList = async (req, res, next) => {
  res.locals = {
    title: 'Transaction',
    toast_Msg:res.locals.toast_Msg,
  };
  res.render('Transaction/index');
}

module.exports.transactionDelete = async (req, res, next) => {
  transactionService.delete(req).then((data)=>{
    console.log(data)
    res.status(200).send({status:true});
  });
}

module.exports.newTransaction = async (req, res, next) => {
    await accountService.transactionType().then(async types=>{
      await accountService.chartOfAccountDDByBaseCode(enumm.AccountHead.Assets.value).then(async assets=>{
        await accountService.chartOfAccountDD().then(async coaAll=>{
          await taxService.getTaxDD().then(taxAll=>{
            res.locals = {
              title: 'Transaction',
              toast_Msg:res.locals.toast_Msg,
              transactionType:types,
              assets:assets,
              coaAll:coaAll,
              incomeCode:enumm.AccountHead.Income.value,
              taxAll:taxAll
            };
            res.render('Transaction/create');
          })
        })
      })
    })
}

module.exports.transactionListData = async (req, res, next) => {
  transactionService.indexData(req).then(data=>{
    res.status(200).send(data);
  });
}

module.exports.newTransaction_Post = async (req, res, next) => {
  console.log(req.body);
  if(req.body.isItIncome=='1'){
    req.body.debitAccountId=req.body.accountToId;
    req.body.creditAccountId=req.body.accountFromId;
  }else{
    req.body.debitAccountId=req.body.accountFromId;
    req.body.creditAccountId=req.body.accountToId;
  }

  await transactionService.createWithDetails(req)
    .then(result=>{
      req.session.notification=[enumm.notification.Success,'Transaction created successfully !'];
      return res.redirect(`/portal/new-transaction`);
    }).catch(e=>{
      console.log(e);
      req.session.notification=[enumm.notification.Error,'Transaction not created !'];
      return res.render(`/portal/new-transaction`);
    });
}

module.exports.logout = async (req, res, next) => {
  // Assign  null value in session
  // sess = req.session;
  // sess.user = null;
  const notification = req.session.notification;
  req.session.returnUrl = null;
  req.session.user = null;
  req.session.notification = notification;
  req.session.destroy();
  res.redirect('/auth/login');
  // res.render('Auth/auth-login', { 'message': req.flash('message'), 'error': req.flash('error') ,layout: false});
};

//#endregion