const router = require("express").Router();
const Items = require("../controller/itemController");
const { methodNotAllowed } = require("../middleware/methodProhibited");

router
  .route("/")
  .get(Items.getAllItem)
  .post(Items.createItem)
  .all(methodNotAllowed); // endpoint /api/v1/items
router
  .route("/:id")
  .get(Items.getDetailItem)
  .put(Items.updateItem)
  .delete(Items.deleteItem)
  .all(methodNotAllowed); // endpoint /api/v1/items/:id

module.exports = router;
