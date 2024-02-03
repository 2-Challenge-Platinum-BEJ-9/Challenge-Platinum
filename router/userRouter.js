const router = require("express").Router();
const { methodNotAllowed } = require("../helper/errorHandler");

router.route("/users").get().all(methodNotAllowed);
router.route("/users/:id").get().delete().all(methodNotAllowed);
