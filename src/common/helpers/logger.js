const env = process.env.NODE_ENV || 'development';

const moment = require('moment-timezone');
const winston = require('winston');
const _ = require('underscore');

const options = {
  file: {
    maxFiles: 5,
    json: true,
    timestamp: true,
    colorize: true,
    level: 'info',
    maxsize: 5242880,
    filename: `${process.cwd()}/common/logs/app.log`,
  },
  console: {
    handleExceptions: true,
    colorize: true,
    timestamp: true,
    json: false,
    level: 'debug',
  },
  console: {
    level: 'error',
    filename: `${process.cwd()}/common/logs/errors.log`,
  },
};

let logger;

if (env !== 'development') {
  logger = winston.createLogger({
    exitOnError: false,
    format: winston.format.combine(
      winston.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss',
      }),
      winston.format.printf((info) => {
        if (!info.message) return;

        return `[${info.timestamp}] [${info.level.toUpperCase()}]: ${
          info.message
        }`;
      })
    ),
    transports: [
      new winston.transports.File(options.file),
      new winston.transports.Console(options.console),
    ],
  });

  logger.stream = {
    write: function (message) {
      logger.info(message);
    },
  };
} else {
  logger = {
    info: function (message) {
      const time = moment().format('YYYY-MM-DD HH:mm:ss');
      console.log(`[INFO] - ${time} - ${message}`);
    },
    error: function (message) {
      const time = moment().format('YYYY-MM-DD HH:mm:ss');
      console.log(`[ERROR] - ${time} - ${message}`);
    },
  };
}

module.exports.info = function () {
  const data = _.map(arguments, (arg) =>
    arg instanceof Error
      ? arg.stack
      : _.isObject(arg)
      ? JSON.stringify(arg, null, 2)
      : arg
  );

  logger.info.call(logger, data.join(' '));
};

module.exports.error = function () {
  const data = _.map(arguments, (arg) =>
    arg instanceof Error
      ? arg.stack
      : _.isObject(arg)
      ? JSON.stringify(arg, null, 2)
      : arg
  );

  logger.error.call(logger, data.join(' '));
};
