'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        'users', // table name
        'isActive', // new field name
        {
          type: Sequelize.BOOLEAN(100),
          allowNull:false,
          defaultValue: true
        },
      )
    ]);
  },
  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('users', 'isActive')
    ]);
  }
};