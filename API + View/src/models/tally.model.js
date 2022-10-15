const dbQuery = require('../db/database');
const { multipleColumnSet } = require('../utils/common.utils');
const tableName="tallies";
module.exports = (sequelize, Sequelize) => {
  const Tally = sequelize.define(tableName, {
    id: {
      type: Sequelize.INTEGER(11),
      allownull:false,
      autoIncrement:true,
      primaryKey: true
    },
    date: {
      type: Sequelize.DATE(),
      allowNull:false,
      validate:{
        notNull:{ args: true, msg: "DATE cannot be empty !!"}
      }
    },
    itemName: {
      type: Sequelize.STRING(),
      allowNull:false,
      validate:{
        notNull:{ args: true, msg: "Item Name cannot be empty !!"}
      }
    },
    quantity: {
      type: Sequelize.STRING(),
      allowNull:false,
      validate:{
        notNull:{ args: true, msg: "Quantity cannot be empty !!"}
      }
    },
    unitPrice: {
      type: Sequelize.DOUBLE(),
      allowNull:false,
      validate:{
        notNull:{ args: true, msg: "unitPrice cannot be empty !!"}
      }
    },
    totalPrice: {
      type: Sequelize.STRING(),
      allowNull:false,
      validate:{
        notNull:{ args: true, msg: "Total price cannot be empty !!"}
      }
    },
    status: {
      type: Sequelize.BOOLEAN(100),
      allowNull:false,
      defaultValue: false
    },
    description: {
      type: Sequelize.STRING(),
      allowNull:true,
    },
  },{
    defaultScope: {
      attributes: {
         exclude: ['status','password','createdAt','updatedAt']
      }
    },
    scopes: {
      loginPurpose: {
        attributes: {
          exclude: ['status','createdAt','updatedAt']
        }
      },
      authPurpose: {
        attributes: {
          exclude: ['createdAt','updatedAt']
        }
      }
  }
});
  
  return Tally;
};


// module.exports.findOne = async (params) => {
//         const { columnSet, values } = multipleColumnSet(params)

//         const sql = `SELECT * FROM ${tableName}
//         WHERE ${columnSet}`;

//         const result = await dbQuery.query(sql, [...values]);
//         // return back the first row (user)
//         return result[0];
//     }