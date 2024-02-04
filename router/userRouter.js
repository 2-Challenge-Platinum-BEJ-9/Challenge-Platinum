const router = require("express").Router();
const { methodNotAllowed } = require("../helper/errorHandler");

router.route("/users").get().all(methodNotAllowed); // endpoint http://localhost:3000/api/v1/users
router.route("/users/:id").get().delete().all(methodNotAllowed); // endpoint http://localhost:3000/api/v1/users/:id
