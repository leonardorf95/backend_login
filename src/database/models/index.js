const logger = require('../../common/helpers/logger');

const { Roles, rolesModel } = require('./roles.model');
const { Users, usersModel } = require('./users.model');
const { Sessions, sessionModel } = require('./sessions.model');

const initialModels = (sequelize) => {
  Roles.init(rolesModel, Roles.config(sequelize));
  Users.init(usersModel, Users.config(sequelize));
  Sessions.init(sessionModel, Sessions.config(sequelize));

  Users.associate(sequelize.models);
  Sessions.associate(sequelize.models);
};

logger.info('Models Loaded...');

module.exports = initialModels;
