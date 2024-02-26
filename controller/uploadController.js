const {
  uploadCloudinary,
  rollbackUploadCloudinary,
} = require("../lib/cloudinary");
const fs = require("fs");

class Upload {
  static async uploadFile(req, res) {
    let statusCode = 201;
    let result = {
      message: "Success",
      data: null,
    };

    try {
      let uploadResult = await uploadCloudinary(req.file.path);
      result.data = uploadResult;

      fs.unlink(req.file.path, (err) => {
        if (err) {
          result.message = err.message;
          statusCode = 500;
        }
      });
    } catch (error) {
      result.message = error.message;
      statusCode = 500;
    }

    return res.status(statusCode).json(result);
  }

  static async uploadMultipleFiles(req, res) {
    let statusCode = 201;
    let result = [];
    let message = "Success";

    for (let i = 0; i < req.files.length; i++) {
      try {
        let uploadResult;
        uploadResult = await uploadCloudinary(req.files[i].path);
        result.push(uploadResult);
      } catch (error) {
        console.log(error);
        if (i > 0) {
          let arrOfPublicId = [];
          for (let j = 0; j < result.length; j++) {
            arrOfPublicId.push(result[j].public_id);
          }

          rollbackUploadCloudinary(arrOfPublicId);
          result = null;
          message = "Error uploading files";
          statusCode = 400;
        }
      }
    }

    for (let i = 0; i < req.files.length; i++) {
      fs.unlink(req.files[i].path, (err) => {
        if (err) {
          console.log(err);
        }
      });
    }

    return res.status(statusCode).json({ message: message, data: result });
  }
}

module.exports = { Upload };
