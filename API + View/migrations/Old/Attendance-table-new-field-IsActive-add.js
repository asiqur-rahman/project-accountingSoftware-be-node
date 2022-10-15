'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        'attendances', // table name
        'code', // new field name
        {
          type: Sequelize.STRING(),
          allowNull:false,
          validate:{
            notNull:{ args: true, msg: "Code cannot be empty !!"}
          }
        },
      )
    ]);
  },
  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('attendances', 'code')
    ]);
  }
};