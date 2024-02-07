const router = require("express").Router();
const { methodNotAllowed } = require("../helper/errorHandler");

router.route("/").get().post().all(methodNotAllowed); // endpoint /api/v1/items
router.route("/:id").get().put().delete().all(methodNotAllowed); // endpoint /api/v1/items/:id

module.exports = router;
