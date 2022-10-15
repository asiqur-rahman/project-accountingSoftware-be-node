module.exports = (sequelize, Sequelize) => {
    const Expense = sequelize.define("expenses", {
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
      shopRent: {
        type: Sequelize.DOUBLE(),
        allowNull:false,
        validate:{
          notNull:{ args: true, msg: "ShopRent cannot be empty !!"}
        }
      },
      accountantFee: {
        type: Sequelize.DOUBLE(),
        allowNull:false,
        validate:{
          notNull:{ args: true, msg: "Accountant Fee cannot be empty !!"}
        }
      },
      bankFee: {
        type: Sequelize.DOUBLE(),
        allowNull:false,
        validate:{
          notNull:{ args: true, msg: "BankFee cannot be empty !!"}
        }
      },
      gst: {
        type: Sequelize.DOUBLE(),
        allowNull:false,
        validate:{
          notNull:{ args: true, msg: "GST cannot be empty !!"}
        }
      },
      electricityBill: {
        type: Sequelize.DOUBLE(),
        allowNull:false,
        validate:{
          notNull:{ args: true, msg: "ElectricityBill cannot be empty !!"}
        }
      },
      mobileBill: {
        type: Sequelize.DOUBLE(),
        allowNull:false,
        validate:{
          notNull:{ args: true, msg: "MobileBill cannot be empty !!"}
        }
      },
      truckBill: {
        type: Sequelize.DOUBLE(),
        allowNull:false,
        validate:{
          notNull:{ args: true, msg: "TruckBill cannot be empty !!"}
        }
      },
      insuranceFee: {
        type: Sequelize.DOUBLE(),
        allowNull:false,
        validate:{
          notNull:{ args: true, msg: "InsuranceFee cannot be empty !!"}
        }
      },
      othersSourceName: {
        type: Sequelize.STRING(),
        allowNull:false,
        validate:{
          notNull:{ args: true, msg: "OthersSourceName cannot be empty !!"}
        }
      },
      others: {
        type: Sequelize.DOUBLE(),
        allowNull:false,
        validate:{
          notNull:{ args: true, msg: "Others cannot be empty !!"}
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
    return Expense;
  };
  