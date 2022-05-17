const path = require('path');
const passport = require('passport');
const logger = require('../common/helpers/logger');

const strategies = path.join(process.cwd(), '/src/common/strategies');

passport.use('local', require(`${strategies}/local.strategy`)());
passport.use('jwt', require(`${strategies}/jwt.strategy`)());

logger.info('Sessions service started');

module.exports = passport;
