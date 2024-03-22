const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadCloudinary(filePath) {
  try {
    let result = await cloudinary.uploader.upload(filePath, {
      use_filename: true,
    });
    return result;
  } catch (error) {
    throw error;
  }
}

async function rollbackUploadCloudinary(arrOfPublicId) {
  try {
    await cloudinary.api.delete_resources(arrOfPublicId);
  } catch (error) {
    console.log(error);
  }
}

module.exports = { uploadCloudinary, rollbackUploadCloudinary };
