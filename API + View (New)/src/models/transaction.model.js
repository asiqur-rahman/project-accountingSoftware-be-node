module.exports = (sequelize, Sequelize) => {
  const Table = sequelize.define("transaction", {
    id: {
      type: Sequelize.INTEGER(11),
      allownull:false,
      autoIncrement:true,
      primaryKey: true
    },
    transactionNo: {
      type: Sequelize.STRING(),
      allowNull:false,
      validate:{
        notNull:{ args: true, msg: "Transaction No cannot be empty !!"}
      }
    },
    amount: {
      type: Sequelize.DOUBLE(),
      allowNull:false,
      validate:{
        notNull:{ args: true, msg: "Amount cannot be empty !!"}
      }
    },
    description: {
      type: Sequelize.STRING(),
      allowNull:true
    },
    dateTime: {
      type: Sequelize.DATEONLY(),
      allowNull:false,
      validate:{
        notNull:{ args: true, msg: "DateTime cannot be empty !!"}
      }
    },
    isItIncome: {
      type: Sequelize.BOOLEAN(),
      allowNull:true,
      defaultValue: null
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
  return Table;
};
