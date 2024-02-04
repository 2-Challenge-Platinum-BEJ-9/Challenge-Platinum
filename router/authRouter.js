const router = require("express").Router();
const { methodNotAllowed } = require("../helper/errorHandler");

router.route("/auth").post().all(methodNotAllowed); // endpoint http://localhost:3000/api/v1/auth
router.route("/login").post().delete().all(methodNotAllowed); // endpoint http://localhost:3000/api/v1/login
