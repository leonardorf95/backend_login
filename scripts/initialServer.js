const { spawn } = require('child_process');

const logger = require('../src/common/helpers/logger');

module.exports = (env) => {
  logger.info('Starting Server...');

  const server = spawn('nodemon bin/www', [], {
    shell: true,
    env,
  });

  server.stdout.on('data', (data) => {
    console.log(data + '');
  });

  server.stderr.on('data', (data) => {
    if (data + '') {
      console.error(`${data}`);
    }
  });

  server.on('close', (code) => {
    console.log(code);
  });

  return server;
};
