const express = require("express");
const router = express.Router();
const userRouter = require("./userRouter");
const itemRouter = require("./itemRouter");
const orderRouter = require("./orderRouter");
const authRouter = require("./authRouter");
const uploadRouter = require("./uploadRouter");

router.use("/auth", authRouter);
router.use("/users", userRouter);
router.use("/items", itemRouter);
router.use("/orders", orderRouter);
router.use("/upload", uploadRouter);

module.exports = router;
