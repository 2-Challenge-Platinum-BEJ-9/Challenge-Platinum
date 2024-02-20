const router = require("express").Router();
const AuthUser = require("../controller/authController");
const { methodNotAllowed } = require("../middleware/methodProhibited");

router.route("/register").post(AuthUser.register).all(methodNotAllowed); // endpoint /api/v1/auth/register

router.route("/login").post(AuthUser.login).all(methodNotAllowed); // endpoint /api/v1/auth/login

router.route("/logout").post(AuthUser.logout).all(methodNotAllowed); // endpoint /api/v1/auth/logout

module.exports = router;
