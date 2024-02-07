const express = require("express");
const morgan = require("morgan");
const router = require("./router/index");
const app = express();
const port = 3000;

app.use(morgan("short"));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to Bingleshop!");
});

app.use("/api/v1", router);

app.listen(port, () => {
  console.log(`This app running at http://localhost:${port}`);
});
