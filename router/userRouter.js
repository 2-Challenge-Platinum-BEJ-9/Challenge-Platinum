const router = require("express").Router();
const { methodNotAllowed } = require("../helper/errorHandler");
const { userController } = require("../Controller/userController");

router.route("/").get(userController).all(methodNotAllowed); // endpoint /api/v1/users
router.route("/:id").get().delete().all(methodNotAllowed); // endpoint /api/v1/users/:id

module.exports = router;