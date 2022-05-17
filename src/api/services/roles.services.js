const { models } = require('../../common/config/database/configuration');
const roles = models.roles;

class RolesService {
  constructor() {}

  /**
   *
   * @param {*} payload Modelo basado en la entidad de la base de datos
   * @returns
   */
  async createRoles(payload) {
    try {
      return await roles.create(payload);
    } catch (error) {
      throw error;
    }
  }

  /**
   * @returns Regresa el listado de todos los roles basados en la busqueda
   */
  async getAllRoles() {
    try {
      return roles.findAll({ order: [['id', 'ASC']] });
    } catch (error) {
      throw error;
    }
  }

  /**
   *
   * @param {*} id Id del role
   * @returns Objeto completo del rol
   */
  async getRolById(id) {
    try {
      return await roles.findOne({ where: { id } });
    } catch (error) {
      throw error;
    }
  }

  /**
   *
   * @param {*} role Entidad actual del rol
   * @param {*} payload Campos a actualizar
   * @returns Recurso actualizado
   */
  async updateRole(role, payload) {
    try {
      return await role.update(payload);
    } catch (error) {
      throw error;
    }
  }

  /**
   *
   * @param {*} role Entidad a eliminar
   * @returns Recuerso Eliminado
   */
  async deleteRole(role) {
    try {
      return await role.destroy();
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new RolesService();
