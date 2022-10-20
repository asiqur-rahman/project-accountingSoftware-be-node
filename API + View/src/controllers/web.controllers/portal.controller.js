const db = require('../../models/model');
const enumm = require('../../utils/enum.utils');
const appConfig = require('../../../config/config.json');
const Op = require('sequelize').Op;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const accountService = require('../../service/account.service');
const transactionService = require('../../service/transaction.service');
const taxService = require('../../service/tax.service');

module.exports.dashboard = async (req, res, next) => {
  res.locals = {
      title: 'Dashboard',
      toast_Msg:res.locals.toast_Msg,
  };
  res.render('Dashboard/index');
}

module.exports.chartOfAccount = async (req, res, next) => {
  accountService.getTreeWiseData().then(data=>{
    console.log(data[0].childs);
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

module.exports.newchartOfAccount = async (req, res, next) => {
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

module.exports.coaByBaseCode = async (req, res, next) => {
  console.log("Called coaByBaseCode")
  await accountService.chartOfAccountDDByBaseCode(req.params.code)
  .then(data=>{
      return res.status(200).send(data);
  }).catch(e=>{
      return res.status(e.status).send(e);
  })
}

module.exports.newchartOfAccount_Post = async (req, res, next) => {
  const area = 'Chart Of Account';
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
