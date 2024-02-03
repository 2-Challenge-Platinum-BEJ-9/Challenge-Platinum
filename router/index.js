const router = require("express").Router();
const userRouter = require("../router/userRouter");
const itemRouter = require("../router/itemRouter");
const orderRouter = require("../router/orderRouter");
const authRouter = require("../router/authRouter");

router.use("api/v1", userRouter);
router.use("api/v1", itemRouter);
router.use("api/v1", orderRouter);
router.use("api/v1", authRouter);

module.exports = router;
