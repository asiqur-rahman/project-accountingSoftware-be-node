const db = require('../../models/model');
const enumm = require('../../utils/enum.utils');
const appConfig = require('../../../config/config.json');
const sequelize = require('sequelize');
const Op = require('sequelize').Op;
const moment = require('moment');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const del = require('del');
const path = require('path');
const formidable = require('formidable');
const jwt = require('jsonwebtoken');
const accountService = require('../../service/account.service');
const transactionService = require('../../service/transaction.service');
const userService = require('../../service/user.service');
const taxService = require('../../service/tax.service');
const { details } = require('@hapi/joi/lib/errors');

//#region Dashboard
module.exports.portal = async (req, res, next) => {
  res.locals.title= 'Dashboard';
  res.render('Dashboard/portal');
}

module.exports.dashboard = async (req, res, next) => {
  db.sequelize.query('CALL DashboardData (:days,:incomeCode,:expenseCode)', {
    replacements: {
        days: 7,
        incomeCode:'401',
        expenseCode:'301'
    }
  })
  .then(async function (dashboardData) {
    // await transactionService.lastTransactionsForDashboard().then(data=>{
      res.locals.title= 'Dashboard';
      res.locals.dashboardData = dashboardData[0];
      res.locals.lTFD = [];//data.rows;//lastTransactionsForDashboard
      res.render('Dashboard/index',{layout: false});
    // });
  })
}

//lastTransactionsForDashboard
module.exports.dashboardLTFD = async (req, res, next) => {
  await transactionService.lastTransactionsForDashboard().then(data=>{
    res.status(200).send(data);
  });
}

//expenseAccountReview
module.exports.dashboardEAR = async (req, res, next) => {
  await transactionService.dashboardEAR().then(data=>{
    res.status(200).send(data);
  });
}
//#endregion

//#region User
module.exports.newUser = async (req, res, next) => {
  await userService.getRoleDD().then(async data => {
    res.locals.roleDD=data;
    if(req.params.id){
      await userService.getById(req.params.id)
      .then(detailsInfo=>{
        res.locals.title= 'User Update';
        res.locals.detailsInfo= detailsInfo;
        res.render('User/create',{layout: false});
      })
    }else{
      res.locals.title= 'User Create';
      res.render('User/create',{layout: false});
    }
  });
  
}

module.exports.newUser_Post = async (req, res, next) => {
  if (req.body.userId && req.body.userId > 0) {
      await userService.update(req)
        .then(() => {
            req.session.notification=[enumm.notification.Success,'User updated successfully !'];
            res.redirect(`/portal/user-list`,{layout: false});
        }).catch(function (err) {
        res.locals = {
            title: `${area} Create`,
            employeeCode: Date.now() % 100000000,
            detailsInfo: req.body
        };
        req.session.notification=[enumm.notification.Error,'User not updated !'];
        res.render(`/portal/create`,{layout: false});
    });
} else {
  await userService.create(req)
        .then(() => {
            res.redirect(`/portal/user-list`,{layout: false});
        }).catch(function (err) {
        res.locals = {
            title: `${area} Create`,
            detailsInfo: req.body
        };
        req.session.notification=[enumm.notification.Error,'User not created !'];
        res.render(`/${area}/create`);
    });
}
}

module.exports.userList = async (req, res, next) => {
  res.locals.title= 'User List';
  res.render('User/index',{layout: false});
}

module.exports.userListData = async (req, res, next) => {
  userService.indexData(req).then(data=>{
    res.status(200).send(data);
  });
}

module.exports.usernameCheck = async (req, res, next) => {
  userService.changeStatus(req.params.name).then(data=>{
    res.status(200).send(data);
  });
}

module.exports.userChangeStatus = async (req, res, next) => {
  userService.changeStatus(req).then(data=>{
    res.status(200).send(data);
  });
}

module.exports.userResetPassword = async (req, res, next) => {
  userService.resetPassword(req).then(data=>{
    res.status(200).send(data);
  });
}
//#endregion

//#region Chart of Account

module.exports.chartOfAccount = async (req, res, next) => {
  accountService.getTreeWiseData().then(data=>{
      res.locals.title= 'Dashboard';
      res.locals.toast_Msg=res.locals.toast_Msg;
      res.locals.data=data;
    res.render('ChartOfAccount/index',{layout: false});
  })
}

module.exports.chartOfAccountListByParentId = async (req, res, next) => {
  accountService.chartOfAccountDDByParentId(req.params.id).then(chartOfAccountDDByParentId=>{
    res.status(200).send({ data:chartOfAccountDDByParentId});
  });
}

module.exports.newChartOfAccount_Get = async (req, res, next) => {
    await accountService.chartOfAccountDD().then(async chartOfAccountDD=>{
      await accountService.currencyDD().then(async currencyDD=>{
        if(req.params.id){
          await accountService.getById(req.params.id)
          .then(detailsInfo=>{
            detailsInfo.name=detailsInfo.name.split(':').pop();
            res.locals.title= 'Chart Of Account Update';
            res.locals.model= detailsInfo;
            res.locals.chartOfAccountDD=chartOfAccountDD;
            res.locals.currencyDD=currencyDD;
            res.render('ChartOfAccount/create',{layout: false});
          })
        }else{
            res.locals.title= 'Chart Of Account Create';
            res.locals.toast_Msg=res.locals.toast_Msg;
            res.locals.chartOfAccountDD=chartOfAccountDD;
            res.locals.currencyDD=currencyDD;
          res.render('ChartOfAccount/create',{layout: false});
      }
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
    accountService.update(req)
    .then(() => {
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
    // accountService.getById(req.body.parentId).then(async data=>{
    //   req.body.name=`${data.name}:${req.body.name}`;
    //   req.body.level=data.name.split(':').length;
    //   req.body.baseCode=req.body.level>1 ? data.baseCode:data.code;
      await accountService.create(req)
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
    // })
  }
}

//#endregion

//#region Bank Account
module.exports.bankAccountList = async (req, res, next) => {
  res.locals.title= 'Bank Account List';
  res.render('BankAccount/index',{layout: false});
}

module.exports.bankAccountListData = async (req, res, next) => {
  userService.indexData(req).then(data=>{
    res.status(200).send(data);
  });
}
//#endregion

//#region Cheque Record
module.exports.chequeRecord = async (req, res, next) => {
  res.render('ChequeRecord/create',{layout: false});
}

module.exports.chequeRecordList = async (req, res, next) => {
  res.locals.title= 'Cheque Record List';
  res.render('ChequeRecord/index',{layout: false});
}

module.exports.chequeRecordData = async (req, res, next) => {
  userService.indexData(req).then(data=>{
    res.status(200).send(data);
  });
}
//#endregion

//#region Transactions
module.exports.transactionList = async (req, res, next) => {
  res.locals.title= 'Transaction';
  res.locals.toast_Msg=res.locals.toast_Msg;
  res.render('Transaction/index',{layout: false});
}

module.exports.transactionDetails = async (req, res, next) => {
  transactionService.transactionDetailsByTransactionId(req).then((data)=>{
    res.locals = {
      data:data
    };
    res.render('Transaction/details',{layout: false});
  });
  
}

module.exports.transactionFileDownload = async (req, res, next) => {
  const mainPath = path.join(__dirname, '..', '..', 'public', 'transaction', 'ID_' + req.params.id, req.params.fileName);
  if (fs.existsSync(mainPath)) {
      res.download(mainPath)
  } else {
      res.redirect('/portal/login')
  }
};

module.exports.transactionDelete = async (req, res, next) => {
  transactionService.delete(req).then((data)=>{
    res.status(200).send({status:true});
  });
}

module.exports.newTransaction = async (req, res, next) => {
    await accountService.transactionType().then(async types=>{
      await accountService.chartOfAccountDDByBaseCode(enumm.AccountHead.Assets.value).then(async assets=>{
        await accountService.chartOfAccountDD().then(async coaAll=>{
          await taxService.getTaxDD().then(taxAll=>{
            res.locals.title= 'Transaction';
            res.locals.toast_Msg=res.locals.toast_Msg;
            res.locals.transactionType=types;
            res.locals.assets=assets;
            res.locals.coaAll=coaAll; 
            res.locals.incomeCode=enumm.AccountHead.Income.value;
            res.locals.taxAll=taxAll;
            res.locals.todayDate= moment().format("MM/DD/yyyy");
            res.render('Transaction/create',{layout: false});
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
  if(req.body.isItIncome=='0'){
    req.body.debitAccountId=req.body.accountToId;
    req.body.creditAccountId=req.body.accountFromId;
  }else{
    req.body.debitAccountId=req.body.accountFromId;
    req.body.creditAccountId=req.body.accountToId;
  }
  
  await transactionService.createWithDetails(req)
    .then(result=>{
      req.session.notification=[enumm.notification.Success,'Transaction created successfully !'];
      return res.redirect(`/portal/new-transaction`,{layout: false});
    }).catch(e=>{
      req.session.notification=[enumm.notification.Error,'Transaction not created !'];
      return res.render(`/portal/new-transaction`,{layout: false});
    });
}


module.exports.newTransaction_Post_ = async (req, res, next) => {
  const form = formidable({});
  form.parse(req, async (err, fields, files) => {
      if (err) {
        req.session.notification=[enumm.notification.Error,'Transaction creation failed !'];
        return res.redirect(`/portal/new-transaction`,{layout: false});
      } else {
          if(fields.isItIncome=='1'){
            fields.debitAccountId=fields.accountToId;
            fields.creditAccountId=fields.accountFromId;
          }else{
            fields.debitAccountId=fields.accountFromId;
            fields.creditAccountId=fields.accountToId;
          }
          fields.dateTime=moment(fields.dateTime, "MM-DD-YYYY");
          // fields.id = null;
          await transactionService.createWithDetails({body:fields,currentUser:req.currentUser})
              .then(async (result) => {
                  if (result) {
                      const oldName = path.join(req.body.mainPath, req.body.folderName);
                      const newName = path.join(req.body.mainPath, "ID_" + result.id);
                      fs.rename(oldName, newName, function (err) {
                          if (err) {
                              req.session.notification=[enumm.notification.Error,'File permission error !'];
                              del(oldName);
                              // fs.rmSync(oldName, { recursive: true, force: true });
                          } else {
                              req.session.notification=[enumm.notification.Success,'Transaction created successfully !'];
                              return res.redirect(`/portal/new-transaction`,{layout: false});
                          }
                      });
                  }
              }).catch(function (err) {
                  req.session.notification=[enumm.notification.Error,'Transaction not created !'];
                  return res.redirect(`/portal/new-transaction`,{layout: false});
              });
      };
  });

};


//#endregion

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