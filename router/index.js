const router = require("express").Router();
const userRouter = require("../router/userRouter");
const itemRouter = require("../router/itemRouter");
const orderRouter = require("../router/orderRouter");
const authRouter = require("../router/authRouter");

router.route("/auth", authRouter);
router.route("/users", userRouter);
router.route("/items", itemRouter);
router.route("/orders", orderRouter);

module.exports = router;
