const express = require("express");
const router = express.Router();
const userRouter = require("./userRouter");
const itemRouter = require("./itemRouter");
const orderRouter = require("./orderRouter");
const authRouter = require("./authRouter");

router.use("/auth", authRouter);
router.use("/users", userRouter);
router.use("/items", itemRouter);
router.use("/orders", orderRouter);

module.exports = router;
