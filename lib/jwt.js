const jwt = require("jsonwebtoken");

function sign(payload) {
  return jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: "3h" });
}

module.exports = { sign };
