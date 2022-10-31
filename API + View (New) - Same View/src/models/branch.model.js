module.exports = (sequelize, Sequelize) => {
    const Branch = sequelize.define("branch", {
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
          notNull:{ args: true, msg: "Name cannot be empty !!"}
        }
      },
      description: {
        type: Sequelize.STRING(),
        allowNull:true,
      },
      isActive: {
        type: Sequelize.BOOLEAN(),
        allowNull:false,
        defaultValue: true
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
    return Branch;
  };
  