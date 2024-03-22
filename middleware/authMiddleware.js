const { unauthorizedResponse } = require("../helper/formatResponse");
const { verify } = require("../lib/jwt");

function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  console.log(req.headers.authorization, "<=>");
  const verified = verify(token);
  console.log(verified, "<<<");
  if (verified && verified.exp > Date.now() / 1000) {
    if (verified.isAdmin) {
      next();
    } else {
      unauthorizedResponse(res);
    }
  } else {
    unauthorizedResponse(res);
  }
}

module.exports = authMiddleware;
