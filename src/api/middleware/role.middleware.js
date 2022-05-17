const enumUserRole = require('../../common/helpers/enumRole');
const logger = require('../../common/helpers/logger');

class RoleMiddleware {
  constructor() {}

  checkRole(...roles) {
    return (req, res, next) => {
      const user = req.user;

      if (!roles.includes(user.roleName)) {
        const roleId = req.user ? req.user.roleId : 0;
        let role;

        switch (roleId) {
          case 1:
            role = enumUserRole.SUPER_ADMIN;
            break;
          case 2:
            role = enumUserRole.ADMIN;
            break;
          default:
            'Usuario desconocido';
            break;
        }

        const endpoint = req.originalUrl;

        logger.error(
          `Role: ${role}, trying to access: ${req.hostname}${endpoint}`
        );

        const error = new Error('Unauthorized');
        error.path = __filename;

        return res.status(401).json({
          statusCode: 401,
          message:
            'The user does not have valid authentication credentials for the target resource.',
          error,
        });
      }

      next();
    };
  }
}

module.exports = new RoleMiddleware();
