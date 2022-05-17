const env = Object.create(process.env);
env.NODE_ENV || (env.NODE_ENV = 'development');

const logger = require('../src/common/helpers/logger');
const initalServer = require('./initialServer');
const migrationDatabase = require('./database/migrations');
const seederData = require('./database/seeders');

(async () => {
  const migration = await migrationDatabase(env);
  logger.info(`Migration finished with code: ${migration}`);

  const seeders = await seederData(env);
  logger.info(`Seeders finished with code: ${seeders}`);

  initalServer();
})();
