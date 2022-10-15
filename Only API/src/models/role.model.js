module.exports = (sequelize, Sequelize) => {
    const Role = sequelize.define("roles", {
      id: {
        type: Sequelize.INTEGER(11),
        allownull:false,
        autoIncrement:true,
        primaryKey: true
      },
      name: {
        type: Sequelize.STRING(),
        allowNull:false,
        validate:{
          notNull:{ args: true, msg: "Role cannot be empty !!"}
        }
      },
      code: {
        type: Sequelize.STRING(),
        allowNull:false,
        validate:{
          notNull:{ args: true, msg: "Code cannot be empty !!"}
        }
      },
      isActive: {
        type: Sequelize.BOOLEAN(),
        allowNull:false,
        defaultValue: true
      } 
    },{
      defaultScope: {
        where:{
          
        },
        attributes: {
           exclude: ['createdAt','updatedAt']
        }
      },
      scopes: {
      
    }
  });
    return Role;
  };
  