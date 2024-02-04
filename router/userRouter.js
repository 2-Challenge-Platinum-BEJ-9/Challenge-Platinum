const router = require("express").Router();
const { methodNotAllowed } = require("../helper/errorHandler");

router.route("/").get().all(methodNotAllowed); // endpoint http://localhost:3000/api/v1/users
router.route("/:id").get().delete().all(methodNotAllowed); // endpoint http://localhost:3000/api/v1/users/:id
