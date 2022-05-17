const router = require('express-promise-router')();
const authController = require('../controllers/auth.controller');
const passport = require('../session');

router
  .route('/login')
  .post([
    passport.authenticate('local', { session: false }),
    authController.login,
  ]);

router.route('/logout').get(authController.logout);

module.exports = {
  route: 'auth',
  endpoints: router,
};
