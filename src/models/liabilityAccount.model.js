module.exports = (sequelize, Sequelize) => {
  const Table = sequelize.define("liabilityAccount", {
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
    decimalPlaces: {
      type: Sequelize.INTEGER(2),
      allownull:false
    },
    // parentId: {
    //   type: Sequelize.INTEGER(11),
    //   references: {
    //     model: "liabilityAccount",
    //     key: 'id',
    //   },
    //   allownull:true
    // },
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
