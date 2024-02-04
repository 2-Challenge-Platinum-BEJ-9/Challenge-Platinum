const router = require("express").Router();
const { methodNotAllowed } = require("../helper/errorHandler");

router.route("/auth").post().all(methodNotAllowed); // endpoint /api/v1/auth
router.route("/login").post().delete().all(methodNotAllowed); // endpoint /api/v1/login
