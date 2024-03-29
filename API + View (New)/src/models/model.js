const config = require("../../config/config.json");
const enumm = require('../utils/enum.utils');
const Sequelize = require("sequelize");
const expenses = require("../../jsondata/expense.json");
const sequelize = new Sequelize(
    config.databaseSettings.database,
    config.databaseSettings.username,
    config.databaseSettings.password, 
    {
        host: config.databaseSettings.host,
        dialect: config.databaseSettings.dialect,
        operatorsAliases: 0,
        logging: config.databaseSettings.logging,
        pool: {
            max: config.databaseSettings.pool.max,
            min: config.databaseSettings.pool.min,
            acquire: config.databaseSettings.pool.acquire,
            idle: config.databaseSettings.pool.idle
        }
    }
);
sequelize.authenticate()
    .then(() => {
      // var parentId=1;
      // var lastParent={name:"Expense"};
      // var finalJsonData=[];
      // expenses.forEach(async element => {
      //   let name=`${lastParent.name}:${element.name}`;
      //   finalJsonData.push({
      //     "name" : name,
      //     "code" : "301",
      //     "baseCode" : null,
      //     "level" : name.split(":").length-1,
      //     "isActive" : 1,
      //     "createdAt" : "2022-10-27 11:24:23",
      //     "updatedAt" : "2022-10-27 11:24:23",
      //     "userId" : 1,
      //     "currencyId" : 1,
      //     "parentId" : null
      //   })
      //   if(element.header)lastParent={name:`Expense:${element.name}`}
      // });
      console.log('Database connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require("./user.model.js")(sequelize, Sequelize);
db.Role = require("./role.model.js")(sequelize, Sequelize);
db.Branch = require("./branch.model.js")(sequelize, Sequelize);
db.UserDetails = require("./userDetails.model")(sequelize, Sequelize);
db.SendMail = require("./sendMail.model")(sequelize, Sequelize);
db.SendSms = require("./sendSms.model")(sequelize, Sequelize);

db.Currency = require("./currency.model")(sequelize, Sequelize);
db.ChartOfAccount = require("./chartOfAccount.model")(sequelize, Sequelize);
db.AccountBalance = require("./accountBalance.model")(sequelize, Sequelize);
db.Transaction = require("./transaction.model")(sequelize, Sequelize);
db.TransactionDetails = require("./transactionDetails.model")(sequelize, Sequelize);
db.Tax = require("./tax.model")(sequelize, Sequelize);
db.BankAccount = require("./bankAccount.model")(sequelize, Sequelize);
db.ChequeRecord = require("./chequeRecord.model")(sequelize, Sequelize);

//Associations

//userTable
db.User.belongsTo(db.UserDetails,{ foreignKey: { allowNull: false }, onDelete: 'CASCADE' });
db.UserDetails.hasOne(db.User);

//UserDetailsTable
db.UserDetails.belongsTo(db.Role,{ foreignKey: { allowNull: false }, onDelete: 'CASCADE' });
db.Role.hasMany(db.UserDetails);

db.UserDetails.belongsTo(db.Branch,{ foreignKey: { allowNull: true }, onDelete: 'CASCADE' });
db.Branch.hasMany(db.UserDetails);

//sendMailTable
db.SendMail.belongsTo(db.User,{ foreignKey: { allowNull: false }, onDelete: 'CASCADE' });
db.User.hasMany(db.SendMail);

//sendSmsTable
db.SendSms.belongsTo(db.User,{ foreignKey: { allowNull: false }, onDelete: 'CASCADE' });
db.User.hasMany(db.SendSms);

//ChartOfAccountTable
db.ChartOfAccount.belongsTo(db.User,{ foreignKey: { allowNull: false }, onDelete: 'CASCADE' });
db.User.hasMany(db.ChartOfAccount);

db.ChartOfAccount.belongsTo(db.Currency,{ foreignKey: { allowNull: false }, onDelete: 'CASCADE' });
db.Currency.hasMany(db.ChartOfAccount);

db.ChartOfAccount.hasMany(db.ChartOfAccount, { foreignKey: { name:'parentId' }});
db.ChartOfAccount.belongsTo(db.ChartOfAccount,{ foreignKey: { name:'parentId', allowNull: false }, onDelete: 'CASCADE' });

//Transaction
db.Transaction.belongsTo(db.User,{ foreignKey: { allowNull: false }, onDelete: 'CASCADE' });
db.User.hasMany(db.Transaction);

// db.Transaction.belongsTo(db.ChartOfAccount,{ foreignKey: { name:'debitAccountId' }, onDelete: 'CASCADE' });
// db.ChartOfAccount.hasMany(db.Transaction, { foreignKey: { name:'debitAccountId' }});

db.Transaction.belongsTo(db.ChartOfAccount,{ as:'debitAccount', foreignKey:'debitAccountId' , onDelete: 'CASCADE' });
// db.ChartOfAccount.hasMany(db.Transaction, { as: 'debitAccount' });

// db.Transaction.belongsTo(db.ChartOfAccount,{ foreignKey: { name:'creditAccountId' }, onDelete: 'CASCADE' });
// db.ChartOfAccount.hasMany(db.Transaction, { foreignKey: { name:'creditAccountId' }});

db.Transaction.belongsTo(db.ChartOfAccount,{ as:'creditAccount',debitAccount:'creditAccountId' , onDelete: 'CASCADE' });
// db.ChartOfAccount.hasMany(db.Transaction, { as:'creditAccount' });

//TransactionDetails
db.TransactionDetails.belongsTo(db.Transaction,{ foreignKey: { allowNull: false }, onDelete: 'CASCADE' });
db.Transaction.hasMany(db.TransactionDetails);

db.TransactionDetails.belongsTo(db.ChartOfAccount,{ foreignKey: { allowNull: false }, onDelete: 'CASCADE' });
db.ChartOfAccount.hasMany(db.TransactionDetails);

db.TransactionDetails.belongsTo(db.Tax,{ foreignKey: { allowNull: true }, onDelete: 'CASCADE' });
db.Tax.hasMany(db.TransactionDetails);


//AccountBalance
db.AccountBalance.belongsTo(db.ChartOfAccount,{ foreignKey: { allowNull: false }, onDelete: 'CASCADE' });
db.ChartOfAccount.hasMany(db.AccountBalance);

db.AccountBalance.belongsTo(db.User,{ foreignKey: { allowNull: false }, onDelete: 'CASCADE' });
db.User.hasMany(db.AccountBalance);

//ChequeRecord
db.ChequeRecord.belongsTo(db.BankAccount,{ foreignKey: { allowNull: false }, onDelete: 'CASCADE' });
db.BankAccount.hasMany(db.ChequeRecord);

// db.sequelize.sync();

//force: true will drop the table if it already exists
// db.sequelize.sync({force: true}).then(() => {
//   console.log('Drop and Resync Database with { force: true }');
//   initial();
// });

// db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', { raw: true }).then ( function () {
//   db.sequelize.sync ({ force: true }).then ( function () {
//     console.log('Drop and Resync Database with { force: true }');
//     initial();
//   });
// });


async function initial() {

    await db.Branch.create({
      name: "Principal",
      description: "Main Branch",
      isActive:true
    });
  
    // await db.Role.create({
    //   name: "SuperUser",
    //   code: enumm.Role.SuperUser,
    //   isActive:true
    // });
    await db.Role.create({
      name: "User",
      code: enumm.Role.User,
      isActive:true
    });
  
    await db.UserDetails.create({
        firstName: "Accounting",
        userId:1,
        roleId:1,
        branchId:1,
        lastName:"Pro",
        email:"braintechsoln@gmail.com",
        contactNo: "01799089893",
        address:"Dhaka, Bangladesh"
    });

    await db.User.create({
      username:'admin',
      password:'$2a$08$oDOBw2EEQ6UbtLLe0TuDguGez0rY4xJNt5KbMoVY659Kd4E3poZTi',
      userDetailId:1,
      isActive:true
    });

    await db.Currency.create({
      name:'BDT',
      isActive:true
    });

    await db.ChartOfAccount.create({
      name:enumm.AccountHead.Assets.key,
      currencyId:1,
      userId:1,
      isActive:true,
      code:enumm.AccountHead.Assets.value,
    }).then(async coa=>{
      await db.AccountBalance.create({
        amount:0,
        chartOfAccountId:coa.id,
        userId:1,
      });
      //#region Bank
      await db.ChartOfAccount.create({
        name:'Assets:Bank',
        currencyId:1,
        userId:1,
        level:1,
        isActive:true,
        parentId:coa.id,
        baseCode:enumm.AccountHead.Assets.value,
      }).then(async data=>{
        await db.AccountBalance.create({
          amount:0,
          chartOfAccountId:data.id,
          userId:1,
        });

        //#region Cheque
        await db.ChartOfAccount.create({
          name:'Assets:Bank:Cheque',
          currencyId:1,
          userId:1,
          level:2,
          isActive:true,
          parentId:data.id,
          baseCode:enumm.AccountHead.Assets.value,
        }).then(async data=>{
          await db.AccountBalance.create({
            amount:0,
            chartOfAccountId:data.id,
            userId:1,
          });
        });
      //#endregion

      });
      //#endregion

      
    });

    await db.ChartOfAccount.create({
      name:enumm.AccountHead.Equity.key,
      currencyId:1,
      userId:1,
      isActive:true,
      code:enumm.AccountHead.Equity.value,
    }).then(async data=>{
      await db.AccountBalance.create({
        amount:0,
        chartOfAccountId:data.id,
        userId:1,
      })
    });

    await db.ChartOfAccount.create({
      name:enumm.AccountHead.Expense.key,
      currencyId:1,
      userId:1,
      isActive:true,
      code:enumm.AccountHead.Expense.value,
    }).then(async data=>{
      await db.AccountBalance.create({
        amount:0,
        chartOfAccountId:data.id,
        userId:1,
      })

      var parentId=data.id;
      var lastParent={name:"Expense"};
      expenses.forEach(element => {
        if(element.header)lastParent={name:`Expense:${element.name}`}
        let name=element.header?lastParent.name:`${lastParent.name}:${element.name}`;
        var jsonData={
          "name" : name,
          "baseCode" : "301",
          "code" : null,
          "level" : name.split(":").length-1,
          "isActive" : 1,
          "createdAt" : "2022-10-27 11:24:23",
          "updatedAt" : "2022-10-27 11:24:23",
          "userId" : 1,
          "currencyId" : 1,
          "parentId" : parentId
        }
        db.ChartOfAccount.create(jsonData)
          .then(data2=>{
            parentId=element.header?data2.id:parentId;
            console.log(parentId);
            db.AccountBalance.create({
              amount:0,
              chartOfAccountId:data2.id,
              userId:1,
            });
      });

      // finalJsonData.forEach(async element => {
      //     await db.ChartOfAccount.create(element)
      //     .then(async data=>{
      //       await db.AccountBalance.create({
      //         amount:0,
      //         chartOfAccountId:data.id,
      //         userId:1,
      //       });
      //   });
        
      })
      // var parentId=data.id;
      // var lastParent={name:"Expense"};
      // expenses.forEach(async element => {
      //   let name=`${lastParent.name}:${element.name}`;
      //   var jsonBody={
      //     name:name,
      //     currencyId:1,
      //     userId:1,
      //     isActive:true,
      //     code:enumm.AccountHead.Expense.value,
      //     parentId:parentId,
      //     level:name.split(":").length-1
      //   };
      //   await db.ChartOfAccount.create(jsonBody)
      //   .then(async data=>{
      //     await db.AccountBalance.create({
      //       amount:0,
      //       chartOfAccountId:data.id,
      //       userId:1,
      //     })
      //     if(element.header){
      //       parentId=data.id;
      //       lastParent={name:`Expense:${element.name}`}
      //     }
      //   });
      // });
    });

    await db.ChartOfAccount.create({
      name:enumm.AccountHead.Income.key,
      currencyId:1,
      userId:1,
      isActive:true,
      code:enumm.AccountHead.Income.value,
    }).then(async data=>{
      await db.AccountBalance.create({
        amount:0,
        chartOfAccountId:data.id,
        userId:1,
      })
    });

    await db.ChartOfAccount.create({
      name:enumm.AccountHead.Liabilities.key,
      currencyId:1,
      userId:1,
      isActive:true,
      code:enumm.AccountHead.Liabilities.value,
    }).then(async data=>{
      await db.AccountBalance.create({
        amount:0,
        chartOfAccountId:data.id,
        userId:1,
      })
    });
    console.log("Default data loaded !")
  }

module.exports = db;