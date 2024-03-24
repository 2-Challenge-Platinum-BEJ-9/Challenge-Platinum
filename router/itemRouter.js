const router = require("express").Router();
const Items = require("../controller/itemController");
const { authMiddleware } = require("../middleware/authMiddleware");
const { methodNotAllowed } = require("../middleware/methodProhibited");

router
	.route("/")
	.get(Items.getAllItem)
	.post(authMiddleware, Items.createItem)
	.all(methodNotAllowed); // endpoint /api/v1/items
router
	.route("/:id")
	.get(Items.getDetailItem)
	.put(authMiddleware, Items.updateItem)
	.delete(authMiddleware, Items.deleteItem)
	.all(methodNotAllowed); // endpoint /api/v1/items/:id

module.exports = router;
