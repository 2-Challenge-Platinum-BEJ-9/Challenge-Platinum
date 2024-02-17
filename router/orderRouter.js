const router = require("express").Router();
const { methodNotAllowed } = require("../helper/errorHandler");
const { Orders } = require("../controller/orderController");
router.route("/").get(Orders.getAllOrders).post(Orders.createOrder).all(methodNotAllowed); // endpoint /api/v1/orders
router.route("/:id").get(Orders.getOrderById).put(Orders.updateOrder).all(methodNotAllowed); // endpoint /api/v1/orders/:id

module.exports = router;
