const config = require("../config/config.js");
const mysql2 = require('mysql2');

const Sequelize = require("sequelize");
const sequelize = new Sequelize(
    config.dbConfig.dbname,
    config.dbConfig.user,
    config.dbConfig.pass, {
        host: config.dbConfig.host,
        dialect: config.dbConfig.dialect,
        operatorsAliases: 0,

        pool: {
            max: config.dbConfig.pool.max,
            min: config.dbConfig.pool.min,
            acquire: config.dbConfig.pool.acquire,
            idle: config.dbConfig.pool.idle
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

db.user = require("./user.model.js")(sequelize, Sequelize);
db.role = require("./role.model.js")(sequelize, Sequelize);
db.attendance = require("./attendance.model")(sequelize, Sequelize);
db.attendanceType = require("./attendanceType.model")(sequelize, Sequelize);
db.detailsInfo = require("./detailsInfo.model")(sequelize, Sequelize);
db.expense = require("./expense.model")(sequelize, Sequelize);
db.paymentType = require("./paymentType.model")(sequelize, Sequelize);
db.supply = require("./supply.model")(sequelize, Sequelize);
db.sale = require("./sale.model")(sequelize, Sequelize);
db.employeeWage = require("./employeeWage.model")(sequelize, Sequelize);
db.dailyCash = require("./dailyCash.model")(sequelize, Sequelize);
db.sendMail = require("./sendMail.model")(sequelize, Sequelize);
db.tallyCustomer = require("./tallyCustomer.model")(sequelize, Sequelize);
db.tally = require("./tally.model")(sequelize, Sequelize);

//Associations

//userTable
db.user.belongsTo(db.role,{ foreignKey: { allowNull: false }, onDelete: 'CASCADE' });
db.role.hasMany(db.user);

//detailsInfoTable
db.user.belongsTo(db.detailsInfo,{ foreignKey: { allowNull: false }, onDelete: 'CASCADE' });
db.detailsInfo.hasOne(db.user);

db.detailsInfo.belongsTo(db.role,{ foreignKey: { allowNull: false }, onDelete: 'CASCADE' });
db.role.hasMany(db.detailsInfo);

//attendanceTable
db.attendance.belongsTo(db.user,{ foreignKey: { allowNull: false }, onDelete: 'CASCADE' });
db.user.hasMany(db.attendance);
db.attendance.belongsTo(db.attendanceType,{ foreignKey: { allowNull: false }, onDelete: 'CASCADE' });
db.attendanceType.hasMany(db.attendance);

//supplyTable
db.supply.belongsTo(db.detailsInfo,{ foreignKey: { allowNull: false }, onDelete: 'CASCADE' });
db.detailsInfo.hasMany(db.supply);

//employeeWageTable
db.employeeWage.belongsTo(db.detailsInfo,{ foreignKey: { allowNull: false }, onDelete: 'CASCADE' });
db.detailsInfo.hasMany(db.employeeWage);

//dailyCashTable
db.dailyCash.belongsTo(db.user,{ foreignKey: { allowNull: false }, onDelete: 'CASCADE' });
db.user.hasMany(db.dailyCash);

//supply
db.supply.belongsTo(db.paymentType,{ foreignKey: { allowNull: false }, onDelete: 'CASCADE' });
db.paymentType.hasMany(db.supply);

//tallyTable
db.tally.belongsTo(db.tallyCustomer,{ foreignKey: { allowNull: false }, onDelete: 'CASCADE' });
db.tallyCustomer.hasMany(db.tally);
// db.role.belongsToMany(db.user, {
//   through: "user_roles",
//   foreignKey: "roleId",
//   otherKey: "userId"
// });
// db.user.belongsToMany(db.role, {
//   through: "user_roles",
//   foreignKey: "userId",
//   otherKey: "roleId"
// });


module.exports = db;