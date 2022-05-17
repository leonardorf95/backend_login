const router = require('express-promise-router')();
const enumUserRole = require('../../common/helpers/enumRole');
const roleMiddleware = require('../middleware/role.middleware');
const usersController = require('../controllers/users.controller');

router.route('/').post(usersController.create);

router
  .route('/')
  .get(
    roleMiddleware.checkRole(enumUserRole.SUPER_ADMIN),
    usersController.getAll
  );

router
  .route('/:id')
  .get(
    roleMiddleware.checkRole(enumUserRole.SUPER_ADMIN),
    usersController.getById
  );

router
  .route('/:id')
  .put(
    roleMiddleware.checkRole(enumUserRole.SUPER_ADMIN),
    usersController.update
  );

router
  .route('/:id')
  .delete(
    roleMiddleware.checkRole(enumUserRole.SUPER_ADMIN),
    usersController.remove
  );

router.route('/active-account/:token').get(usersController.activeAccount);

router.route('/generate-token/:email').get(usersController.getToken);

router.route('/update-password/:token').put(usersController.updatePassword);

module.exports = {
  route: 'users',
  endpoints: router,
};
