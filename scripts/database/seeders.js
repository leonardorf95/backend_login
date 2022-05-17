const { spawn } = require('child_process');
const path = require('path');
const sequelizeCli = path
  .join(process.cwd(), '/node_modules/sequelize-cli/lib/sequelize')
  .replace(/\\/g, '/');
const logger = require('../../src/common/helpers/logger');

module.exports = function (env) {
  return new Promise((resolve) => {
    logger.info(`Starting Seeding`);
    const seed = spawn(`node ${sequelizeCli} db:seed:all`, [], {
      shell: true,
      env,
    });

    seed.stdout.on('data', (data) => {
      if (data + '' !== '\n') {
        logger.info(`${data}`);
      }
    });

    seed.stderr.on('data', (data) => {
      if (data + '') {
        logger.error(`${data}`, sequelizeCli);
      }
    });

    seed.on('close', (code) => {
      resolve(code);
    });
  });
};
