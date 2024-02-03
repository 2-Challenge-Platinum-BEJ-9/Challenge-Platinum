const express = require("express");
const morgan = require("morgan");
const router = require("./router/index");
const app = express();
const port = 3000;

app.use(morgan("short"));
app.use(express.json());
app.use(router);

app.get("/", (req, res) => {
  res.send("Welcome to Bingleshop!");
});

// router bellow!

app.listen(port, () => {
  console.log(`This app running at http://localhost:${port}`);
});
