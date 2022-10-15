'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        'tallies', // table name
        'unitPrice', // new field name
        {
          type: Sequelize.DOUBLE(),
          allowNull:false
        },
      )
    ]);
  },
  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('tallies', 'unitPrice')
    ]);
  }
};