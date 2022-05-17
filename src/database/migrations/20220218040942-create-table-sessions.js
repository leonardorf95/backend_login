'use strict';

const { SESSION_TABLE, sessionModel } = require('../models/sessions.model');

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable(SESSION_TABLE, sessionModel);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.dropTable(SESSION_TABLE);
  },
};
