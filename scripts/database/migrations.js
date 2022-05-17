const { spawn } = require('child_process');
const path = require('path');
const sequelizeCli = path
  .join(process.cwd(), '/node_modules/sequelize-cli/lib/sequelize')
  .replace(/\\/g, '/');
const logger = require('../../src/common/helpers/logger');

module.exports = (env) => {
  return new Promise((resolve) => {
    const migrate = spawn(`node ${sequelizeCli} db:migrate`, [], {
      shell: true,
      env,
    });

    migrate.stdout.on('data', (data) => {
      if (data + '' !== '\n') {
        logger.info(`${data}`);
      }
    });

    migrate.stderr.on('data', (data) => {
      if (data + '') {
        logger.error(`Error ejcutar las migraciones: ${data}`, sequelizeCli);
      }
    });

    migrate.on('close', (code) => {
      resolve(code);
    });
  });
};
