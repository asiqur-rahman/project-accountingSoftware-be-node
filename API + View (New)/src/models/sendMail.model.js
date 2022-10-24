const tableName="SendMail";
module.exports = (sequelize, Sequelize) => {
  const SendMail = sequelize.define(tableName, {
    Id: {
      type: Sequelize.INTEGER(),
      allownull:false,
      autoIncrement:true,
      primaryKey: true
    },
    MailTo: {
      type: Sequelize.STRING(),
      allowNull:false,
      validate:{
        notNull:{ args: true, msg: "MailTo cannot be empty !!"},
        notEmpty:{ args: true, msg: "MailTo cannot be empty !!"},
      }
    },
    MailSubject: {
      type: Sequelize.STRING(),
      allowNull:false,
      validate:{
        notNull:{ args: true, msg: "MailSubject cannot be empty !!"},
        notEmpty:{ args: true, msg: "MailSubject cannot be empty !!"},
      }
    },
    MailBody: {
      type: Sequelize.STRING(1000),
      allowNull:false,
      validate:{
        notNull:{ args: true, msg: "MailBody cannot be empty !!"},
        notEmpty:{ args: true, msg: "MailBody cannot be empty !!"},
      }
    },
    MailTotal: {
      type: Sequelize.INTEGER(),
      allownull:false,
      validate:{
        notEmpty:{ args: true, msg: "MailTotal cannot be empty !!"},
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
  
  return SendMail;
};