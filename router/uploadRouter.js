const { Upload } = require("../controller/uploadController");
const { upload } = require("../lib/multer");
const { methodNotAllowed } = require("../middleware/methodProhibited");

const router = require("express").Router();

router
  .route("/avatar")
  .post(upload.single("avatar"), Upload.uploadFile)
  .all(methodNotAllowed); // /api/v1/upload/avatar
router
  .route("/pictures")
  .post(upload.array("pictures"), Upload.uploadMultipleFiles)
  .all(methodNotAllowed); // /api/v1/upload/pictures

module.exports = router;
