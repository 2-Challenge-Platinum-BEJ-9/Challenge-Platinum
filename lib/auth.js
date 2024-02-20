const passport = require("../middleware/passport");
const { unauthorizedResponse } = require("../helper/formatResponse");

const authentication = passport.authenticate("jwt", {
  session: false,
  failureMessage: true,
  failureRedirect: false,
});

const authorization = (req, res, next) => {
  if (!req.user) {
    return unauthorizedResponse();
  } else {
    if (req.user.isAdmin) {
      return unauthorizedResponse(res, "You are not an admin!");
    }
  }
};

module.exports = { authentication, authorization };
