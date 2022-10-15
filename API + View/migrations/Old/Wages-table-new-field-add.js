'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        'employeeWages', // table name
        'cash', // new field name
        {
          type: Sequelize.DOUBLE(),
          allowNull:false
        },
      ),
      queryInterface.addColumn(
        'employeeWages', // table name
        'dateTo', // new field name
        {
          type: Sequelize.DATE(),
          allowNull:false
        },
      ),
      queryInterface.renameColumn(
        'employeeWages', // table name
        'date', // field name
        'dateFrom' // new field name
      )
    ]);
  },
  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('employeeWages', 'cash'),
      queryInterface.removeColumn('employeeWages', 'dateTo'),
      queryInterface.renameColumn('employeeWages', 'dateFrom', 'date')
    ]);
  }
};