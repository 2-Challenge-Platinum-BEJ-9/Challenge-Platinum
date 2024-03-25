const jwt = require("jsonwebtoken");

function sign(payload) {
  return jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: "3h" });
}

function verify(token) {
  try {
    return jwt.verify(token, process.env.SECRET_KEY);
  } catch (error) {
    return null
  }
}

module.exports = { sign, verify };
