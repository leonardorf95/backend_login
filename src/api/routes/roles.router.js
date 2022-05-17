const router = require('express-promise-router')();
const enumUserRole = require('../../common/helpers/enumRole');
const roleMiddleware = require('../middleware/role.middleware');
const rolesController = require('../controllers/roles.controller');

router
  .route('/')
  .get(
    roleMiddleware.checkRole(enumUserRole.SUPER_ADMIN),
    rolesController.getAll
  );

router
  .route('/:id')
  .get(
    roleMiddleware.checkRole(enumUserRole.SUPER_ADMIN),
    rolesController.getById
  );

router
  .route('/')
  .post(
    roleMiddleware.checkRole(enumUserRole.SUPER_ADMIN),
    rolesController.create
  );

router
  .route('/:id')
  .put(
    roleMiddleware.checkRole(enumUserRole.SUPER_ADMIN),
    rolesController.update
  );

router
  .route('/:id')
  .delete(
    roleMiddleware.checkRole(enumUserRole.SUPER_ADMIN),
    rolesController.remove
  );

module.exports = {
  route: 'roles',
  endpoints: router,
};
