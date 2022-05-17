const env = process.env.NODE_ENV || 'development';

const path = require('path');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const { Op } = require('sequelize');
const logger = require('../../common/helpers/logger');
const configServer = require(path.join(
  process.cwd(),
  `/src/common/config/environments/${env}.config.json`
)).ServerFrontend;
const { models } = require('../../common/config/database/configuration');
const users = models.users;
const rolesService = require('./roles.services');

class UsersService {
  constructor() {}

  async createUser(payload) {
    try {
      let tempPassword = '';

      if (!payload.password || payload.password === '') {
        tempPassword = new Date().getTime();
        tempPassword = String(tempPassword);
      } else {
        tempPassword = payload.password;
      }

      const phoneRegexp = /^[0-9]{10}$/;
      const checkPhone = phoneRegexp.test(payload.phoneNumber);

      if (!checkPhone) {
        const error = new Error();
        error.message = 'Bad Request';
        error.description = 'Número de teléfono incorrecto';
        error.stack = 'The pattern does not match';
        throw error;
      }

      const findRole = await rolesService.getRolById(payload.roleId);

      if (!findRole) {
        const error = new Error();
        error.message = 'Not Found';
        error.description = 'El rol enviado no fue encontrado.';
        error.stack = error.stack;
        throw error;
      }

      const findUserByEmail = await users.findOne({
        where: {
          email: payload.email,
        },
      });

      if (findUserByEmail) {
        const error = new Error();
        error.message = 'Bad Request';
        error.description = 'El correo electrónico ingresado ya existe.';
        error.stack = error.stack;
        throw error;
      }

      const findUserByPhone = await users.findOne({
        where: {
          [Op.or]: [
            { email: payload.email },
            { phoneNumber: payload.phoneNumber },
          ],
        },
      });

      if (findUserByPhone) {
        const error = new Error();
        error.message = 'Bad Request';
        error.description = 'El teléfono ingresado ya existe';
        error.stack = error.stack;
        throw error;
      }

      const hashPassword = await bcrypt.hash(tempPassword, 12);
      const tokenActivation = uuidv4();

      const model = {
        name: payload.name.trim().toLowerCase(),
        firstName: payload.firstName.trim().toLowerCase(),
        email: payload.email.trim().toLowerCase(),
        phoneNumber: payload.phoneNumber,
        password: hashPassword,
        tokenActivation: tokenActivation,
        roleId: payload.roleId,
      };

      /// TODO: Falta enviar correo de confirmacion de cuenta

      return await users.create(model);
    } catch (error) {
      logger.error('Error al crear un nuevo usuario: ', error);
      throw error;
    }
  }

  async updateUser(user, payload) {
    try {
      return await user.update(payload);
    } catch (error) {
      logger.error('Error al actualizar un usuario: ', error);
      throw error;
    }
  }

  async getUserById(id) {
    try {
      return await users.findOne({ where: { id } });
    } catch (error) {
      logger.error('Error al buscar el usuario: ', error);
      throw error;
    }
  }

  async getAllUsers(queries) {
    try {
      const { limit, offset } = queries;
      let where = {};

      const { rows, count: total } = await users.findAndCountAll({
        where,
        order: [['id', 'DESC']],
        attributes: [
          'id',
          'name',
          'firstName',
          'email',
          'phoneNumber',
          'isVerified',
        ],
        include: [
          {
            model: models.roles,
            as: 'role',
            required: true,
            attributes: ['id', 'name'],
          },
        ],
        limit,
        offset,
      });

      let pages = 1;

      if (limit) pages = Math.ceil(total / limit);

      return { rows, pages };
    } catch (error) {
      logger.error('Error al obtener todos los usuarios: ', error);
      throw error;
    }
  }

  async deleteUser(user) {
    try {
      return await user.destroy();
    } catch (error) {
      logger.error('Error al eliminar el usuario: ', error);
      throw error;
    }
  }

  async activeUser(tokenActivation) {
    try {
      const findUser = await users.findOne({ where: { tokenActivation } });

      if (!findUser) {
        const error = new Error();
        error.message = 'Bad Request';
        error.description = 'No se encontro el usuario.';
        error.stack = error.stack;
        throw error;
      }

      findUser.isVerified = true;

      return await findUser.save();
    } catch (error) {
      logger.error('Error al activar al usuario: ', error);
      throw error;
    }
  }

  async getValidUser(email) {
    try {
      return await users.findOne({
        where: { email, isVerified: true },
      });
    } catch (error) {
      logger.error('Error al buscar el usuario valido: ', error);
      throw error;
    }
  }

  async generateNewToken(email) {
    try {
      const findUser = await users.findOne({ where: { email } });

      if (!findUser) {
        const error = new Error();
        error.message = 'Bad Request';
        error.description = 'No se encontro el usuario.';
        error.stack = error.stack;
        throw error;
      }

      const tokenActivation = uuidv4();

      findUser.tokenActivation = tokenActivation;
      await findUser.save();

      /// TODO: Falta enviar correo con token
    } catch (error) {
      logger.error('Error al generar un nuevo token para el usuario: ', error);
      throw error;
    }
  }

  async updatePassword(tokenActivation, password) {
    try {
      const findUser = await users.findOne({ where: { tokenActivation } });

      if (!findUser) {
        const error = new Error();
        error.message = 'Bad Request';
        error.description = 'No se encontro el usuario.';
        error.stack = error.stack;
        throw error;
      }

      const hashPassword = await bcrypt.hash(password, 12);

      findUser.password = hashPassword;

      return await findUser.save();
    } catch (error) {
      logger.error('Error al actualizar las contraseñas del usuario: ', error);
      throw error;
    }
  }
}

module.exports = new UsersService();
