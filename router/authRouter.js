const router = require("express").Router();
const { methodNotAllowed } = require("../helper/errorHandler");

router.route("/").post().all(methodNotAllowed); // endpoint /api/v1/auth
router.route("/login").post().delete().all(methodNotAllowed); // endpoint /api/v1/auth/login

module.exports = router;
