const express = require("express");
const morgan = require("morgan");
const app = express();
const port = 3000;

app.use(morgan("short"));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to Bingleshop!");
});

// add router below this comment
app.use("/users");

app.listen(port, () => {
  console.log(`This app running at http://localhost:${port}`);
});
