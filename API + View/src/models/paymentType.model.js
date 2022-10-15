module.exports = (sequelize, Sequelize) => {
    const PaymentType = sequelize.define("paymentTypes", {
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
          notNull:{ args: true, msg: "PaymentTypeName cannot be empty !!"}
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
    },
    
    {
      defaultScope: {
        where:{
          isActive: true
        },
        attributes: {
           exclude: ['id','createdAt','updatedAt']
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
    return PaymentType;
  };
  