const handleResponse = require('../../common/helpers/handleResponse');
const sessionService = require('../services/session.services');

class AuthController {
  constructor() {}

  async login(req, res) {
    return res.status(200).send(req.user);
  }

  async logout(req, res) {
    const userId = req.user.id;

    try {
      const response = await sessionService.destroySession(userId);

      const result = {
        message: 'OK',
        description: 'Se cerró sesión con éxito.',
        outPut: response,
      };

      return handleResponse.success(result, res);
    } catch (error) {
      return handleResponse.error(error, res);
    }
  }
}

module.exports = new AuthController();
