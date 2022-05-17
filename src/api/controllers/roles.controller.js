const handleResponse = require('../../common/helpers/handleResponse');
const rolesService = require('../services/roles.services');

class RolesController {
  constructor() {}

  async create(req, res) {
    try {
      const payload = req.body;
      const response = await rolesService.createRoles(payload);
      const result = {
        message: 'Created',
        description: 'El rol se creó con éxito.',
        outPut: response,
      };

      return handleResponse.success(result, res);
    } catch (error) {
      return handleResponse.error(error, res);
    }
  }

  async getAll(req, res) {
    try {
      const response = await rolesService.getAllRoles();
      return handleResponse.success(response, res);
    } catch (error) {
      return handleResponse.error(error, res);
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;
      const response = await rolesService.getRolById(+id);
      return handleResponse.success(response, res);
    } catch (error) {
      return handleResponse.error(error, res);
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const payload = req.body;
      const response = await rolesService.updateRole(+id, payload);
      return handleResponse.success(response, res);
    } catch (error) {
      return handleResponse.error(error, res);
    }
  }

  async remove(req, res) {
    try {
      const { id } = req.params;
      const findRole = await rolesService.getRolById(+id);
      const response = await rolesService.deleteRole(findRole);
      return handleResponse.success(response, res);
    } catch (error) {
      return handleResponse.error(error, res);
    }
  }
}

module.exports = new RolesController();
