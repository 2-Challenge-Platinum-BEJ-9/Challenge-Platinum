const router = require("express").Router();
const AuthUser = require("../controller/authController");
const { methodNotAllowed } = require("../helper/fornatResponse");

router.route("/register").post(AuthUser.register).all(methodNotAllowed); // endpoint /api/v1/auth/register

router
  .route("/login")
  .post(AuthUser.login)
  .delete(AuthUser.logout)
  .all(methodNotAllowed); // endpoint /api/v1/auth/login

module.exports = router;
