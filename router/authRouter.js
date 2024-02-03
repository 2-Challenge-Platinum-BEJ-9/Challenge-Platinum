const router = require("express").Router();
const { methodNotAllowed } = require("../helper/errorHandler");

router.route("/auth").post().all(methodNotAllowed);
router.route("/login").post().delete().all(methodNotAllowed);
