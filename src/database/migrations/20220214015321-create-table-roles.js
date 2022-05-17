'use strict';

const { ROLES_TABLE, rolesModel } = require('../models/roles.model');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable(ROLES_TABLE, rolesModel);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable(ROLES_TABLE);
  },
};
