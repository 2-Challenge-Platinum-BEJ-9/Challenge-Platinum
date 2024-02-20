const router = require("express").Router();
const { methodNotAllowed } = require("../middleware/methodProhibited");

router.route("/").get().post().all(methodNotAllowed); // endpoint /api/v1/orders
router.route("/:id").get().put().all(methodNotAllowed); // endpoint /api/v1/orders/:id

module.exports = router;
