const { Model, DataTypes } = require('sequelize');

const USERS_TABLE = 'users';

const { ROLES_TABLE } = require('./roles.model');
const usersModel = {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  roleId: {
    field: 'role_id',
    type: DataTypes.INTEGER,
    references: {
      model: ROLES_TABLE,
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    toLowerCase: true,
    allowNull: false,
  },
  firstName: {
    field: 'first_name',
    type: DataTypes.STRING,
    toLowerCase: true,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    toLowerCase: true,
    allowNull: true,
    unique: true,
  },
  phoneNumber: {
    field: 'phone_number',
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  password: DataTypes.STRING,
  isVerified: {
    field: 'is_verified',
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  tokenActivation: {
    field: 'token_activation',
    type: DataTypes.STRING,
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

class Users extends Model {
  static associate(models) {
    this.belongsTo(models.roles, { as: 'role', foreignKey: 'roleId' });

    this.hasMany(models.sessions, {
      as: 'session',
      foreignKey: 'userId',
    });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: USERS_TABLE,
      modelName: 'users',
      timestamps: true,
      paranoid: true,
    };
  }
}

module.exports = { USERS_TABLE, usersModel, Users };
