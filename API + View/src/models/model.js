const config = require("../../config/config.json");
const enumm = require('../utils/enum.utils');
const Sequelize = require("sequelize");
const sequelize = new Sequelize(
    config.development.database,
    config.development.username,
    config.development.password, 
    {
        host: config.development.host,
        dialect: config.development.dialect,
        operatorsAliases: 0,

        pool: {
            max: config.development.pool.max,
            min: config.development.pool.min,
            acquire: config.development.pool.acquire,
            idle: config.development.pool.idle
        }
    }
);
sequelize.authenticate()
    .then(() => {
        console.log('Database connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require("./user.model.js")(sequelize, Sequelize);
db.Role = require("./Role.model.js")(sequelize, Sequelize);
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


function initial() {

    db.Branch.create({
      name: "Principal",
      description: "Main Branch",
      isActive:true
    });
  
    // db.Role.create({
    //   name: "SuperUser",
    //   code: enumm.Role.SuperUser,
    //   isActive:true
    // });
    db.Role.create({
      name: "User",
      code: enumm.Role.User,
      isActive:true
    });
  
    db.UserDetails.create({
        firstName: "Accounting",
        userId:1,
        roleId:1,
        branchId:1,
        lastName:"Pro",
        email:"braintechsoln@gmail.com",
        contactNo: "01799089893",
        address:"Dhaka, Bangladesh"
    });

    db.User.create({
      username:'admin',
      password:'$2a$08$oDOBw2EEQ6UbtLLe0TuDguGez0rY4xJNt5KbMoVY659Kd4E3poZTi',
      userDetailId:1,
      isActive:true
    });

    db.Currency.create({
      name:'BDT',
      isActive:true
    });

    db.ChartOfAccount.create({
      name:enumm.AccountHead.Assets.key,
      currencyId:1,
      userId:1,
      isActive:true,
      code:enumm.AccountHead.Assets.value,
      // baseCode:enumm.AccountHead.Assets.value
    }).then(data=>{
      db.AccountBalance.create({
        amount:0,
        chartOfAccountId:data.id,
        userId:1,
      })
    });

    db.ChartOfAccount.create({
      name:enumm.AccountHead.Equity.key,
      currencyId:1,
      userId:1,
      isActive:true,
      code:enumm.AccountHead.Equity.value,
      // baseCode:enumm.AccountHead.Equity.value
    }).then(data=>{
      db.AccountBalance.create({
        amount:0,
        chartOfAccountId:data.id,
        userId:1,
      })
    });

    db.ChartOfAccount.create({
      name:enumm.AccountHead.Expense.key,
      currencyId:1,
      userId:1,
      isActive:true,
      code:enumm.AccountHead.Expense.value,
      // baseCode:enumm.AccountHead.Expense.value
    }).then(data=>{
      db.AccountBalance.create({
        amount:0,
        chartOfAccountId:data.id,
        userId:1,
      })
    });

    db.ChartOfAccount.create({
      name:enumm.AccountHead.Income.key,
      currencyId:1,
      userId:1,
      isActive:true,
      code:enumm.AccountHead.Income.value,
      // baseCode:enumm.AccountHead.Income.value
    }).then(data=>{
      db.AccountBalance.create({
        amount:0,
        chartOfAccountId:data.id,
        userId:1,
      })
    });

    db.ChartOfAccount.create({
      name:enumm.AccountHead.Liabilities.key,
      currencyId:1,
      userId:1,
      isActive:true,
      code:enumm.AccountHead.Liabilities.value,
      // baseCode:enumm.AccountHead.Liabilities.value
    }).then(data=>{
      db.AccountBalance.create({
        amount:0,
        chartOfAccountId:data.id,
        userId:1,
      })
    });

  }

module.exports = db;