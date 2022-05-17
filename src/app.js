const env = process.env.NODE_ENV || 'development';

const express = require('express');
const session = require('express-session');
const morgan = require('morgan');
const cors = require('cors');

const logger = require('./common/helpers/logger');
const router = require('./api/router');
const passport = require('./api/session');
const authMiddleware = require('./api/middleware/auth.middleware');

const server = express();

if (env !== 'development') {
  server.use(
    morgan('combined', {
      stream: logger.stream,
    })
  );

  logger.info(`Enviroment it's running in mode ${env}`);
}

server.use(express.json({}));

server.use(
  express.urlencoded({
    extended: true,
  })
);

server.use(cors());

server.use(
  session({
    secret: 'devmx.io',
    resave: true,
    saveUninitialized: true,
  })
);

server.use(passport.initialize());

server.use(passport.session());

server.use((req, res, next) => {
  if (req.url.indexOf('/app') === -1) return next();

  return authMiddleware(req, res, next);
});

server.use((req, res, next) => {
  if (!req.headers.authorization && req.url.indexOf('/app') === -1)
    return next();

  return passport.authenticate('jwt', {
    session: false,
  })(req, res, next);
});

router(server);

server.get('*', (req, res) => {
  return res.status(200).json({
    statusCode: 200,
    message: `Welcome to backend server, it's running in mode ${env}`,
  });
});

logger.info('The server is started');

module.exports = server;
