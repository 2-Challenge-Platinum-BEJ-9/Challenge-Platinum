const router = require("express").Router();
const { methodNotAllowed } = require("../middleware/methodProhibited");

router.route("/").get().all(methodNotAllowed); // endpoint /api/v1/users
router.route("/:id").get().delete().all(methodNotAllowed); // endpoint /api/v1/users/:id

module.exports = router;
