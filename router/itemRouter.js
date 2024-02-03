const router = require("express").Router();
const { methodNotAllowed } = require("../helper/errorHandler");

router.route("/items").get().post().all(methodNotAllowed);
router.route("/items/:id").get().put().delete().all(methodNotAllowed);
