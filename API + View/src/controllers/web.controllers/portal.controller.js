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
      // console.log(data,dashboardData[0])
      res.locals.title= 'Dashboard';
      res.locals.dashboardData = dashboardData[0];
      res.locals.lTFD = [];//data.rows;//lastTransactionsForDashboard
      res.render('Dashboard/index');
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
  if(req.params.id){
    await userService.getById(req.params.id)
    .then(detailsInfo=>{
      res.locals.detailsInfo= detailsInfo;
      res.render('User/create');
    })
    

  }else{
    res.locals.title= 'User Create';
    res.render('User/create');
  }
}

module.exports.newUser_Post = async (req, res, next) => {
  if (req.body.id && req.body.id > 0) {
      await userService.update(req)
        .then(() => {
            req.session.notification=[enumm.notification.Success,'User updated successfully !'];
            res.redirect(`/portal/user-list`);
        }).catch(function (err) {
        res.locals = {
            title: `${area} Create`,
            employeeCode: Date.now() % 100000000,
            detailsInfo: req.body
        };
        req.session.notification=[enumm.notification.Error,'User not updated !'];
        res.render(`/${area}/create`);
    });
} else {
    await db.detailsInfo.create(req.body)
        .then(async (result) => {
            if (result) {
                await db.detailsInfo.findOne({
                    where: {
                        employeeCode: req.body.employeeCode
                    },
                    raw: true
                }).then(async detailsInfo => {
                    const passwordNotHashed = (Date.now() % 10000000000).toString();
                    await bcrypt.hash(passwordNotHashed, 8).then(async password => {
                        req.body.password = password;
                        req.body.detailsInfoId = detailsInfo.id;
                        await db.user.create(req.body)
                            .then(async () => {
                                await emailController.sendMail_Func({
                                    To: [detailsInfo.email],
                                    MailSubject: "Chicken Man User Portal Credentials.",
                                    MailBody: `Hi ${detailsInfo.name}, <br/><br/>Welcome to Chicken Man. Here is your portal login credentials.<br/><br/>UserName : <b>${req.body.username}</b><br/>Password : <b>${passwordNotHashed}</b><br/><br/>Please reset your password from the below link<br/>https://chickenman.net.au/login<br/><br/> Thank you for joining Chicken Man.<br/><br/>Best Regards,<br/>Chicken Man<br/>(02) 4856 8660<br/>info@chickenman.net.au<br/>www.chickenman.net.au<br/>12 Verner St, Goulburn, NSW, Australia `
                                }, req).then((result) => {
                                    // console.log(result);
                                    // res.redirect(`/portal-${area}-list`);
                                    req.session.notification=[enumm.notification.Success,'User created successfully!'];
                                    res.redirect(`/portal-${area.toLowerCase()}-create`);
                                });
                            });
                    });
                });
            } else {
                req.session.notification=[enumm.notification.Error,'User not created !'];
                // req.flash('responseMessage',JSON.stringify({type:'success',message:'User Created Successfully !'}))
                res.redirect(`/portal-${area.toLowerCase()}-create`);
            }
        });
}
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
      res.locals.title= 'Dashboard';
      res.locals.toast_Msg=res.locals.toast_Msg;
      res.locals.data=data;
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
        res.locals.title= 'Chart Of Account';
        res.locals.toast_Msg=res.locals.toast_Msg;
        res.locals.chartOfAccountDD=chartOfAccountDD;
        res.locals.currencyDD=currencyDD;
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
          },
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
      req.body.baseCode=req.body.level>1 ? data.baseCode:data.code;
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
    })
  }
}

//#endregion

//#region Transactions
module.exports.transactionList = async (req, res, next) => {
  res.locals.title= 'Transaction';
  res.locals.toast_Msg=res.locals.toast_Msg;
  res.render('Transaction/index');
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
      return res.redirect(`/portal/new-transaction`);
    }).catch(e=>{
      req.session.notification=[enumm.notification.Error,'Transaction not created !'];
      return res.render(`/portal/new-transaction`);
    });
}


module.exports.newTransaction_Post_ = async (req, res, next) => {
  const form = formidable({});
  form.parse(req, async (err, fields, files) => {
      if (err) {
        req.session.notification=[enumm.notification.Error,'Transaction creation failed !'];
        return res.redirect(`/portal/new-transaction`);
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
                console.log(result);
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
                              return res.redirect(`/portal/new-transaction`);
                          }
                      });
                  }
              }).catch(function (err) {
                  req.session.notification=[enumm.notification.Error,'Transaction not created !'];
                  return res.redirect(`/portal/new-transaction`);
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