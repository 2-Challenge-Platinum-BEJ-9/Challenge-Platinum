const router = require("express").Router();
const { methodNotAllowed } = require("../helper/errorHandler");

router.route("/").get().all(methodNotAllowed); // endpoint /api/v1/users
router.route("/:id").get().delete().all(methodNotAllowed); // endpoint /api/v1/users/:id

module.exports = router;
