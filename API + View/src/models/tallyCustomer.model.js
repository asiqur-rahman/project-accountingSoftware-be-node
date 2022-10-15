const dbQuery = require('../db/database');
const { multipleColumnSet } = require('../utils/common.utils');
const tableName="tallyCustomers";
module.exports = (sequelize, Sequelize) => {
  const TallyCustomers = sequelize.define(tableName, {
    id: {
      type: Sequelize.INTEGER(11),
      allownull:false,
      autoIncrement:true,
      primaryKey: true
    },
    fullName: {
      type: Sequelize.STRING(),
      allowNull:false,
      validate:{
        notNull:{ args: true, msg: "FullName cannot be empty !!"}
      }
    },
    email: {
      type: Sequelize.STRING(100),
      isEmail:true,
      allowNull:false,
      validate:{
        isEmail:{ args: true, msg: "Enter a valid email !!"}
      }
    },
    contactNo: {
      type: Sequelize.STRING(),
      allowNull:false,
      validate:{
        notNull:{ args: true, msg: "ContactNo cannot be empty !!"}
      }
    },
    address: {
      type: Sequelize.STRING(),
      allowNull:false,
      validate:{
        notNull:{ args: true, msg: "Address cannot be empty !!"}
      }
    },
    status: {
      type: Sequelize.BOOLEAN(100),
      allowNull:false,
      defaultValue: false
    } 
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
  
  return TallyCustomers;
};


// module.exports.findOne = async (params) => {
//         const { columnSet, values } = multipleColumnSet(params)

//         const sql = `SELECT * FROM ${tableName}
//         WHERE ${columnSet}`;

//         const result = await dbQuery.query(sql, [...values]);
//         // return back the first row (user)
//         return result[0];
//     }