const passport = require("passport");
const { Strategy: JWTStrategy, ExtractJwt } = require("passport-jwt");

const option = {
  secretOrKey: process.env.SECRET_KEY,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

function decode(payload, done) {
  if (!payload.iat) {
    done("Session timed out!", null);
  } else {
    done(null, payload);
  }
}

passport.use(new JWTStrategy(option, decode));

module.exports = passport;
