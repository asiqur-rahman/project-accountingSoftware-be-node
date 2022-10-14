const dbQuery = require('../db/database');
const tableName="users";
module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define(tableName, {
    id: {
      type: Sequelize.INTEGER(11),
      allownull:false,
      autoIncrement:true,
      primaryKey: true
    },
    username: {
      type: Sequelize.STRING(100),
      allowNull:false,
      unique:{ args: true, msg: "Username already used !!"},
      validate:{
        notNull:{ args: true, msg: "Username cannot be empty !!"}
      }
    },
    // email: {
    //   type: Sequelize.STRING(100),
    //   isEmail:true,
    //   allowNull:false,
    //   validate:{
    //     isEmail:{ args: true, msg: "Enter a valid email !!"}
    //   }
    // },
    password: {
      type: Sequelize.STRING(100),
      allowNull:false,
      validate:{
        notNull:{ args: true, msg: "Password cannot be empty !!"},
        notEmpty:{ args: true, msg: "Password cannot be empty !!"},
      }
    },
    forceChangePassword: {
      type: Sequelize.BOOLEAN(100),
      allowNull:false,
      defaultValue: true
    },
    isActive: {
      type: Sequelize.BOOLEAN(100),
      allowNull:false,
      defaultValue: false
    },
    status: {
      type: Sequelize.BOOLEAN(100),
      allowNull:false,
      defaultValue: false
    } 
  },{
    defaultScope: {
      attributes: {
         exclude: ['isActive','password','createdAt','updatedAt']
      }
    },
    scopes: {
      loginPurpose: {
        attributes: {
          exclude: ['createdAt','updatedAt']
        }
      },
      authPurpose: {
        attributes: {
          exclude: ['createdAt','updatedAt']
        }
      }
  }
});
  
  return User;
};


// module.exports.findOne = async (params) => {
//         const { columnSet, values } = multipleColumnSet(params)

//         const sql = `SELECT * FROM ${tableName}
//         WHERE ${columnSet}`;

//         const result = await dbQuery.query(sql, [...values]);
//         // return back the first row (user)
//         return result[0];
//     }