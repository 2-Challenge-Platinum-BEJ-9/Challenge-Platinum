const router = require("express").Router();
const { UserController } = require("../controller/userController");
const { methodNotAllowed } = require("../middleware/methodProhibited");

router.route("/").get(UserController.allUsers).all(methodNotAllowed); // endpoint /api/v1/users

router
	.route("/:id")
	.get(UserController.detailUser)
	// .put(UserController.updateUser)
	.delete(UserController.deleteUser)
	.all(methodNotAllowed);

module.exports = router;
