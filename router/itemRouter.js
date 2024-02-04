const router = require("express").Router();
const { methodNotAllowed } = require("../helper/errorHandler");

router.route("/").get().post().all(methodNotAllowed); // endpoint http://localhost:3000/api/v1/items
router.route("/:id").get().put().delete().all(methodNotAllowed); // endpoint http://localhost:3000/api/v1/items/:id
