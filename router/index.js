const router = require("express").Router();
const userRouter = require("../router/userRouter");
const itemRouter = require("../router/itemRouter");
const orderRouter = require("../router/orderRouter");
const authRouter = require("../router/authRouter");

router.use("api/v1/users", userRouter);
router.use("api/v1/items", itemRouter);
router.use("api/v1/orders", orderRouter);
router.use("api/v1/", authRouter);

module.exports = router;
