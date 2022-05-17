const { models } = require('../../common/config/database/configuration');
const sessions = models.sessions;

class SessionService {
  constructor() {}

  async createSession(payload) {
    try {
      return await sessions.create({
        userId: payload.userId,
        token: payload.token,
        expiredAt: payload.expiredAt,
      });
    } catch (error) {
      throw error;
    }
  }

  async destroySession(userId) {
    try {
      return await sessions.destroy({
        where: {
          userId,
        },
      });
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new SessionService();
