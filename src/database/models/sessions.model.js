const { Model, DataTypes } = require('sequelize');

const SESSION_TABLE = 'sessions';

const { USERS_TABLE } = require('./users.model');

const sessionModel = {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    field: 'user_id',
    type: DataTypes.INTEGER,
    references: {
      model: USERS_TABLE,
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
  token: DataTypes.STRING,
  expiredAt: {
    field: 'expired_at',
    type: DataTypes.DATE,
  },
  createdAt: {
    field: 'created_at',
    type: DataTypes.DATE,
  },
  updatedAt: {
    field: 'updated_at',
    type: DataTypes.DATE,
  },
  deletedAt: {
    field: 'deleted_at',
    type: DataTypes.DATE,
  },
};

class Sessions extends Model {
  static associate(models) {
    this.belongsTo(models.users, { as: 'user', foreignKey: 'userId' });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: SESSION_TABLE,
      modelName: 'sessions',
      timestamps: true,
      paranoid: true,
    };
  }
}

module.exports = { SESSION_TABLE, sessionModel, Sessions };
