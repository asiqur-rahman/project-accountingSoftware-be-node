'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        'sales', // table name
        'card2', // new field name
        {
          type: Sequelize.DOUBLE(),
          allowNull:false,
          validate:{
            notNull:{ args: true, msg: "Card 2 cannot be empty !!"}
          }
        },
      )
    ]);
  },
  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('sales', 'card2')
    ]);
  }
};