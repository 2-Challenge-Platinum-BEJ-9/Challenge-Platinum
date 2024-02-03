const router = require("express").Router();
const { methodNotAllowed } = require("../helper/errorHandler");

router.route("/orders").get().post().all(methodNotAllowed);
router.route("/orders/:id").get().put().all(methodNotAllowed);
