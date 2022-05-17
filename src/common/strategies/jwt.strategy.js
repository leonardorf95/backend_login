const env = process.env.NODE_ENV || 'development';
const path = require('path');
const passportJWT = require('passport-jwt');
const jwtStrategy = passportJWT.Strategy;
const extractJWT = passportJWT.ExtractJwt;
const configJwt = require(path.join(
  process.cwd(),
  `/src/common/config/environments/${env}.config.json`
)).JwtSecret;

module.exports = () => {
  return new jwtStrategy(
    {
      jwtFromRequest: extractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: configJwt.secret,
    },
    (payload, done) => {
      return done(null, payload);
    }
  );
};
