const handleResponse = require('../../common/helpers/handleResponse');

const usersService = require('../services/user.services');
const rolesService = require('../services/roles.services');

class UsersController {
  constructor() {}

  async create(req, res) {
    try {
      const payload = req.body;

      const response = await usersService.createUser(payload);

      const result = {
        message: 'Created',
        description: 'El usuario se creó con éxito.',
        outPut: response,
      };

      return handleResponse.success(result, res);
    } catch (error) {
      return handleResponse.error(error, res);
    }
  }

  async getAll(req, res) {
    let queries = req.query;

    try {
      let outPut = await usersService.getAllUsers(queries);

      const result = {
        message: 'OK',
        description: 'La información de los usuarios se obtuvo con éxito.',
        outPut,
      };

      return handleResponse.success(result, res);
    } catch (error) {
      return handleResponse.error(error, res);
    }
  }

  async getById(req, res) {
    const { id } = req.params;

    try {
      const responseUser = await usersService.getUserById(id);

      if (!responseUser) {
        const outPutError = new Error();
        outPutError.message = 'Not Found';
        outPutError.description = 'El usuario enviado no fue encontrado.';
        outPutError.stack = outPutError.stack;
        throw outPutError;
      }

      const responseRole = await rolesService.getRolById(responseUser.roleId);

      const result = {
        message: 'OK',
        description: 'La información del usuario se obtuvo con éxito.',
        outPut: {
          user: responseUser,
          role: responseRole,
        },
      };

      return handleResponse.success(result, res);
    } catch (error) {
      return handleResponse.error(error, res);
    }
  }

  async update(req, res) {
    const id = req.params.id;
    const data = req.body;

    try {
      const responseUser = await usersService.getUserById(id);

      if (!responseUser) {
        const outPutError = new Error();
        outPutError.message = 'Not Found';
        outPutError.description = 'El usuario enviado no fue encontrado.';
        outPutError.stack = outPutError.stack;
        throw outPutError;
      }

      const response = await usersService.updateUser(responseUser, data);

      const result = {
        message: 'OK',
        description: 'La información del usuario se actualizó con éxito.',
        outPut: response,
      };

      return handleResponse.success(result, res);
    } catch (error) {
      return handleResponse.error(error, res);
    }
  }

  async remove(req, res) {
    const id = req.params.id;

    try {
      const responseUser = await usersService.getUserById(id);

      if (!responseUser) {
        const outPutError = new Error();
        outPutError.message = 'Not Found';
        outPutError.description = 'El usuario enviado no fue encontrado.';
        outPutError.stack = outPutError.stack;
        throw outPutError;
      }

      const response = await usersService.deleteUser(responseUser);

      const result = {
        message: 'OK',
        description: 'El usuario se eliminó con éxito.',
        outPut: response,
      };

      return handleResponse.success(result, res);
    } catch (error) {
      return handleResponse.error(error, res);
    }
  }

  async activeAccount(req, res) {
    const token = req.params.token;

    try {
      const response = await usersService.activeUser(token);

      const result = {
        message: 'OK',
        description: 'La cuenta se activó con éxito.',
        outPut: response,
      };

      return handleResponse.success(result, res);
    } catch (error) {
      return handleResponse.error(error, res);
    }
  }

  async getToken(req, res) {
    const email = req.params.email;

    try {
      await usersService.generateNewToken(email);

      const result = {
        message: 'OK',
        description: 'La contraseña del usuario reseteó con éxito.',
        outPut: null,
      };

      return handleResponse.success(result, res);
    } catch (error) {
      return handleResponse.error(error, res);
    }
  }

  async updatePassword(req, res) {
    const token = req.params.token;
    const { password, confirmPassword } = req.body;

    try {
      if (password !== confirmPassword) {
        const outPutError = new Error();
        outPutError.message = 'Bad Request';
        outPutError.description = 'Las contraseñas no coinciden';
        outPutError.stack = outPutError.stack;
        throw outPutError;
      }

      const response = await usersService.updatePassword(token, password);

      const result = {
        message: 'OK',
        description: 'La contraseña del usuario actualizó con éxito.',
        outPut: response,
      };

      return handleResponse.success(result, res);
    } catch (error) {
      return handleResponse.error(error, res);
    }
  }
}

module.exports = new UsersController();
