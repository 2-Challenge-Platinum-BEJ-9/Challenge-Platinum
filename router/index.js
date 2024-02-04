const router = require("express").Router();
const userRouter = require("../router/userRouter");
const itemRouter = require("../router/itemRouter");
const orderRouter = require("../router/orderRouter");
const authRouter = require("../router/authRouter");

router.use("/", authRouter);
router.use("/users", userRouter);
router.use("/items", itemRouter);
router.use("/orders", orderRouter);

module.exports = router;
