require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const router = require("./router/index");
const app = express();
const passport = require("./middleware/passport");
const logger = require("./helper/logger");
const { Upload } = require("./controller/uploadController");

app.use(morgan("short"));
app.use(express.json());
app.use(passport.initialize());

const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log("Masuk destination");
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    console.log("Masuk filename");
    cb(null, file.originalname);
  },
});

const uploadMiddleware = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5, fieldSize: 1024 * 1024 * 5 },
  fileFilter: function (req, file, cb) {
    console.log("Masuk fileFilter");
    if (file.mimetype === "image/png" || file.mimetype === "image/jpg") {
      return cb(null, true);
    } else {
      return cb(new Error("Only .png & .jpg format allowed!"));
    }
  },
});

app.get("/", (req, res) => {
  let message = "Welcome to Bingleshop!";
  res.json({ message });
});

app.post(
  "/api/v1/upload/avatar",
  uploadMiddleware.single("avatar"),
  // Upload.uploadFile
  (req, res) => {
    console.log(req.file, "<<<");
    return res.status(200);
  }
);

app.use("/api/v1", router);

app.use((err, req, res, next) => {
  logger.error(err.message);
  return res.status(500).json({ message: err.message });
});

module.exports = app;
