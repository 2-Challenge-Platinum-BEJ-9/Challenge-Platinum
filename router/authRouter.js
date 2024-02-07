const router = require("express").Router();
const AuthUser = require("../controller/authController");
const { methodNotAllowed } = require("../helper/errorHandler");

router.route("/").post(AuthUser.postRegister).all(methodNotAllowed); // endpoint /api/v1/auth
router.route("/login").post().delete().all(methodNotAllowed); // endpoint /api/v1/auth/login
