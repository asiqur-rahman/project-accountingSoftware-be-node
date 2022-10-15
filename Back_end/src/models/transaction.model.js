module.exports = (sequelize, Sequelize) => {
  const Table = sequelize.define("transaction", {
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
    description: {
      type: Sequelize.STRING(),
      allowNull:true
    },
    dateTime: {
      type: Sequelize.DATE(),
      allowNull:false,
      validate:{
        notNull:{ args: true, msg: "DateTime cannot be empty !!"}
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
