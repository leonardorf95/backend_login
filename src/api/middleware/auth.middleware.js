const env = process.env.NODE_ENV || 'development';
const path = require('path');
const jwt = require('jsonwebtoken');
const configJwt = require(path.join(
  process.cwd(),
  `/src/common/config/environments/${env}.config.json`
)).JwtSecret;
const usersService = require('../services/user.services');
const rolesService = require('../services/roles.services');

const authMiddleware = async (req, res, next) => {
  try {
    let session;

    const urlsAllow = [
      '/api/auth/login',
      '/api/users/active-account/',
      '/api/users/generate-token/email',
      '/api/users/update-password/token',
    ];

    if (!req.headers.authorization && !urlsAllow.includes(req.url)) {
      return res.status(401).json({
        statusCode: 401,
        message: 'La sesión a expirado, por favor inicie sesión nuevamente',
      });
    }

    if (req.headers.authorization) {
      const decode = jwt.decode(
        req.headers.authorization.replace('Bearer ', ''),
        configJwt.secret
      );

      session = await usersService.getSessionUser({
        userId: decode.id,
      });

      if (!session) {
        return res.status(401).json({
          statusCode: 401,
          message: 'Su sesión en Karpay a caducado, favor de inicie sesión',
        });
      }

      const user = await usersService.getById(session.userId);
      const findRole = await rolesService.getRolById(user.roleId);

      req.user = {
        id: user.id,
        roleId: user.roleId,
        nameRole: findRole.name,
        organizationId: user.organizationId,
        businessId: user.businessId,
        name: user.name,
        email: user.email,
      };
    }

    next();
  } catch (error) {
    return res.status(500).json({
      statusCode: 500,
      message: 'Internal Server Error',
      error: error.stack,
    });
  }
};

module.exports = authMiddleware;
