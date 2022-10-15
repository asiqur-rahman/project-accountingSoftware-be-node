const enumm = require('../utils/enum.utils');
module.exports = (sequelize, Sequelize) => {
    const Attendance = sequelize.define("attendance", {
      id: {
        type: Sequelize.INTEGER(11),
        allownull:false,
        autoIncrement:true,
        primaryKey: true
      },
      dateTime: {
        type: Sequelize.DATE(),
        allowNull:false,
        validate:{
          notNull:{ args: true, msg: "DateTime cannot be empty !!"}
        }
      },
      isApproved: {
        type: Sequelize.BOOLEAN(),
        allowNull:false,
        defaultValue: false
      },
      running: {
        type: Sequelize.INTEGER(),
        allownull:false,
        defaultValue: enumm.attendanceType.In
      },
      isActive: {
        type: Sequelize.BOOLEAN(),
        allowNull:false,
        defaultValue: true
      },
      code: {
        type: Sequelize.STRING(),
        allowNull:false,
        unique:true,
        validate:{
          notNull:{ args: true, msg: "Code cannot be empty !!"}
        }
      }
    },
    
    {
      defaultScope: {
        where:{
          isActive: true
        },
        attributes: {
           exclude: ['createdAt','updatedAt']
        }
      },
      scopes: {
        notActive: {
          where:{
            isActive: false
          },
          attributes: {
             exclude: ['id','createdAt','updatedAt']
          }
        },
        allData: {
          where:{

          },
          attributes: {
             exclude: ['id','createdAt','updatedAt']
          }
        }
    }
  });
    return Attendance;
  };
  