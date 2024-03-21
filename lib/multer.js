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

const upload = multer({
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

module.exports = { upload };
