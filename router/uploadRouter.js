const { Upload } = require("../controller/uploadController");
// const { upload } = require("../lib/multer");
const { methodNotAllowed } = require("../middleware/methodProhibited");

// const multer = require("multer");
// const multer = require("multer");

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     console.log("Masuk destination");
//     cb(null, "./uploads");
//   },
//   filename: function (req, file, cb) {
//     console.log("Masuk filename");
//     cb(null, file.originalname);
//   },
// });

// const uploadMiddleware = multer({
//   storage: storage,
//   limits: { fileSize: 1024 * 1024 * 5, fieldSize: 1024 * 1024 * 5 },
//   fileFilter: function (req, file, cb) {
//     console.log("Masuk fileFilter");
//     if (file.mimetype === "image/png" || file.mimetype === "image/jpg") {
//       return cb(null, true);
//     } else {
//       return cb(new Error("Only .png & .jpg format allowed!"));
//     }
//   },
// });

const router = require("express").Router();

// router
//   .route("/avatar")
//   .post(uploadMiddleware.single("avatar"), Upload.uploadFile)
//   .all(methodNotAllowed); // /api/v1/upload/avatar
// router
//   .route("/pictures")
//   .post(uploadMiddleware.array("pictures"), Upload.uploadMultipleFiles)
//   .all(methodNotAllowed); // /api/v1/upload/pictures

module.exports = router;
