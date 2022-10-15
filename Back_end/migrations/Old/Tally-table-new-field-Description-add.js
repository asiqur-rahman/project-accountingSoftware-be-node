'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        'tallies', // table name
        'description', // new field name
        {
          type: Sequelize.STRING(),
          allowNull:true
        },
      )
    ]);
  },
  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('tallies', 'description')
    ]);
  }
};