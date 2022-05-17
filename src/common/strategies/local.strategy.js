const { Strategy } = require('passport-local');
const { setSecondsDate } = require('../helpers');
const authService = require('../service/auth.service');
const rolesServices = require('../../api/services/roles.services');

module.exports = () => {
  return new Strategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      try {
        let user = await authService.validateUser(email, password);

        if (!user) {
          return done(null, {
            statusCode: 401,
            message: 'Credenciales incorrectas y/o usuario no verificado',
          });
        }

        const findRole = await rolesServices.getRolById(user.roleId);
        user.roleName = findRole.name;

        const token = await authService.generateJwt(user);

        const expiredAt = setSecondsDate(token.expiresIn).format();

        await authService.generateSession(
          user.id,
          token.access_token,
          expiredAt
        );

        const sessionData = {
          statusCode: 200,
          user: {
            id: user.id,
            roleId: user.roleId,
            name: user.name,
            email: user.email,
          },
          session: {
            access_token: token.access_token,
            expiresIn: expiredAt,
          },
        };

        return done(null, sessionData);
      } catch (error) {
        return done(null, false, {
          message: 'Esta cuenta no existe',
        });
      }
    }
  );
};
