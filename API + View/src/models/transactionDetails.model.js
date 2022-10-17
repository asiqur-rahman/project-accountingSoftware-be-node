module.exports = (sequelize, Sequelize) => {
  const Table = sequelize.define("transactionDetails", {
    id: {
      type: Sequelize.INTEGER(11),
      allownull:false,
      autoIncrement:true,
      primaryKey: true
    },
    amount: {
      type: Sequelize.DOUBLE(),
      allowNull:false,
      validate:{
        notNull:{ args: true, msg: "Amount cannot be empty !!"}
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
  return Table;
};
