const router = require("express").Router();
const { methodNotAllowed } = require("../helper/errorHandler");
const { UserController } = require("../Controller/userController");

router.route("/").get(UserController.allUsers).all(methodNotAllowed); // endpoint /api/v1/users
router.route("/deleteUser:id").delete(UserController.deleteUser).all(methodNotAllowed); // endpoint /api/v1/users/:id
router.route("/detailUser:id").get(UserController.detailUser).all(methodNotAllowed); // endpoint /api/v1/users/:id

module.exports = router;