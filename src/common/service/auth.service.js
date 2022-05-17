const env = process.env.NODE_ENV || 'development';
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const configJwt = require(path.join(
  process.cwd(),
  `/src/common/config/environments/${env}.config.json`
)).JwtSecret;
const usersService = require('../../api/services/user.services');
const sessionService = require('../../api/services/session.services');

class AuthService {
  constructor() {}

  async validateUser(email, password) {
    const user = await usersService.getValidUser(email);

    if (!user) return null;

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) return null;

    return user;
  }

  async generateJwt(user) {
    const payload = {
      id: user.id,
      roleId: user.roleId,
      roleName: user.roleName,
    };

    const expiresIn = 60 * 60 * 24;

    return {
      access_token: jwt.sign(payload, configJwt.secret, { expiresIn }),
      expiresIn,
    };
  }

  async generateSession(id, token, expiredAt) {
    await sessionService.createSession({
      userId: id,
      token,
      expiredAt,
    });
  }
}

module.exports = new AuthService();
