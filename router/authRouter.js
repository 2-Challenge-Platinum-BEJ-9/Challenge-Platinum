const router = require("express").Router();
const AuthUser = require("../controller/authController");
const { methodNotAllowed } = require("../helper/fornatResponse");

router.route("/").post(AuthUser.register); // endpoint /api/v1/auth
router
  .route("/login")
  .post(AuthUser.login)
  .delete(AuthUser.logout)
  .all(methodNotAllowed); // endpoint /api/v1/auth/login

module.exports = router;
