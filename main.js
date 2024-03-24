require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const router = require("./router/index");
const app = express();
const passport = require("./middleware/passport");
const { logger } = require("./helper/logger");

app.use(morgan("short"));
app.use(express.json());
app.use(passport.initialize());

app.get("/", (req, res) => {
  let message = "Welcome to Bingleshop!";
  res.json({ message });
});

app.use("/api/v1", router);

app.use((err, req, res, next) => {
  logger.error(err.message);
  return res.status(500).json({ message: err.message });
});

module.exports = app;
