module.exports = (sequelize, Sequelize) => {
  const Table = sequelize.define("tax", {
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
    percentage: {
      type: Sequelize.DOUBLE(),
      allowNull:false, 
      validate:{
        notNull:{ args: true, msg: "Percentage cannot be empty !!"}
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
