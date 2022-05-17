const { Model, DataTypes } = require('sequelize');

const ROLES_TABLE = 'roles';

const rolesModel = {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: { type: DataTypes.STRING, toLowerCase: true, unique: true },
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

class Roles extends Model {
  static associate() {}

  static config(sequelize) {
    return {
      sequelize,
      tableName: ROLES_TABLE,
      modelName: 'roles',
      timestamps: true,
      paranoid: true,
    };
  }
}

module.exports = { ROLES_TABLE, rolesModel, Roles };
