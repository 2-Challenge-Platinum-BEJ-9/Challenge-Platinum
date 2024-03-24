require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const router = require("./router/index");
const app = express();
const port = 3000;
const passport = require("./middleware/passport");

app.use(morgan("short"));
app.use(express.json());
app.use(passport.initialize());

app.get("/", (req, res) => {
  let message = "Welcome to Bingleshop!";
  res.json({ message });
});

app.use("/api/v1", router);

app.use((err, req, res, next) => {
  return res.status(500).json({ message: err.message });
});

app.listen(port, () => {
  console.log(`This app running at http://localhost:${port}`);
});

module.exports = app;
