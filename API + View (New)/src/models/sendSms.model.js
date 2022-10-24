const tableName="SendSms";
module.exports = (sequelize, Sequelize) => {
  const SendSms = sequelize.define(tableName, {
    Id: {
      type: Sequelize.INTEGER(),
      allownull:false,
      autoIncrement:true,
      primaryKey: true
    },
    SmsTo: {
      type: Sequelize.STRING(),
      allowNull:false,
      validate:{
        notNull:{ args: true, msg: "SmsTo cannot be empty !!"},
        notEmpty:{ args: true, msg: "SmsTo cannot be empty !!"},
      }
    },
    SmsBody: {
      type: Sequelize.STRING(1000),
      allowNull:false,
      validate:{
        notNull:{ args: true, msg: "SmsBody cannot be empty !!"},
        notEmpty:{ args: true, msg: "SmsBody cannot be empty !!"},
      }
    },
    Date: {
      type: Sequelize.DATE(),
      allowNull:false,
      validate:{
        notNull:{ args: true, msg: "Date cannot be empty !!"},
        notEmpty:{ args: true, msg: "Date cannot be empty !!"}
      }
    },
  },{
    defaultScope: {
      attributes: {
         exclude: ['createdAt','updatedAt']
      }
    },
    scopes: {
      branchList: {
        attributes: {
          exclude: ['createdAt','updatedAt']
        }
      }
  }
});
  
  return SendSms;
};