const router = require("express").Router();
const { UserController } = require("../controller/userController");
const { authorization } = require("../middleware/authMiddleware");
const { methodNotAllowed } = require("../middleware/methodProhibited");

router
	.route("/")
	.get(authorization, UserController.allUsers)
	.all(methodNotAllowed); // endpoint /api/v1/users

router
	.route("/:id")
	.get(authorization, UserController.detailUser)
	.put(authorization, UserController.updateUser)
	.delete(authorization, UserController.deleteUser)
	.all(methodNotAllowed);

module.exports = router;


