module.exports = (sequelize, Sequelize) => {
    const Sale = sequelize.define("sales", {
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
      cash: {
        type: Sequelize.DOUBLE(),
        allowNull:false,
        validate:{
          notNull:{ args: true, msg: "Cash cannot be empty !!"}
        }
      },
      card: {
        type: Sequelize.DOUBLE(),
        allowNull:false,
        validate:{
          notNull:{ args: true, msg: "Card 1 cannot be empty !!"}
        }
      },
      card2: {
        type: Sequelize.DOUBLE(),
        allowNull:false,
        validate:{
          notNull:{ args: true, msg: "Card 2 cannot be empty !!"}
        }
      },
      cheque: {
        type: Sequelize.DOUBLE(),
        allowNull:false,
        validate:{
          notNull:{ args: true, msg: "Cheque cannot be empty !!"}
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
    return Sale;
  };
  