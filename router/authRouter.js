const router = require("express").Router();
const AuthUser = require("../controller/authController");
const { upload } = require("../lib/multer");
const { methodNotAllowed } = require("../middleware/methodProhibited");
const { authentication, authorization } = require("../lib/auth");

router
  .route("/register")
  .post(upload.single("image"), AuthUser.register)
  .all(methodNotAllowed); // endpoint /api/v1/auth/register

router.route("/login").post(AuthUser.login).all(methodNotAllowed); // endpoint /api/v1/auth/login

router.route("/logout").post(AuthUser.logout).all(methodNotAllowed); // endpoint /api/v1/auth/logout

module.exports = router;
