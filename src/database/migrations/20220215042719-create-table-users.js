'use strict';

const { USERS_TABLE, usersModel } = require('../models/users.model');

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable(USERS_TABLE, usersModel);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.dropTable(USERS_TABLE);
  },
};
