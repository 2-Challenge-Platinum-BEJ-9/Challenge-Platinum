const router = require("express").Router();
const { methodNotAllowed } = require("../helper/errorHandler");

router.route("/orders").get().post().all(methodNotAllowed); // endpoint http://localhost:3000/api/v1/orders
router.route("/orders/:id").get().put().all(methodNotAllowed); // endpoint http://localhost:3000/api/v1/orders/:id
