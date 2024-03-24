const router = require("express").Router();
const { methodNotAllowed } = require("../middleware/methodProhibited");
const { UserController } = require("../controller/userController.js");

router.route("/").get(UserController.allUsers).all(methodNotAllowed); // endpoint /api/v1/users

router
	.route("/:id")
	.get(UserController.detailUser)
	.put(UserController.updateUser)
	.delete(UserController.deleteUser)
	.all(methodNotAllowed); // endpoint /api/v1/users/detailUser:id

module.exports = router;
