const {
	uploadCloudinary,
	rollbackUploadCloudinary,
} = require("../lib/cloudinary");
const {
	successResponse,
	errorResponse,
	serverErrorResponse,
} = require("../helper/formatResponse");
const fs = require("fs");
const logger = require("../helper/logger");

class Upload {
	static async uploadFile(req, res) {
		let statusCode = 201;
		let data = null;

		try {
			let uploadResult = await uploadCloudinary(req.file.path);
			data = {
				public_id: uploadResult.public_id,
				format: uploadResult.format,
				resource_type: uploadResult.resource_type,
				width: uploadResult.width,
				height: uploadResult.height,
				bytes: uploadResult.bytes,
				original_filename: uploadResult.original_filename,
				secure_URL: uploadResult.secure_url,
			};

			fs.unlink(req.file.path, (err) => {
				if (err) {
					logger.error(err.message);
					return serverErrorResponse(res, err.message);
				}
			});
		} catch (error) {
			logger.error(error.message);
			return errorResponse(res, error.message);
		}

		logger.info(data);
		return successResponse(res, statusCode, data);
	}

	static async uploadMultipleFiles(req, res) {
		let statusCode = 201;
		let result = [];

		for (let i = 0; i < req.files.length; i++) {
			try {
				let uploadResult;
				uploadResult = await uploadCloudinary(req.files[i].path);
				const data = {
					public_id: uploadResult.public_id,
					format: uploadResult.format,
					resource_type: uploadResult.resource_type,
					width: uploadResult.width,
					height: uploadResult.height,
					bytes: uploadResult.bytes,
					original_filename: uploadResult.original_filename,
					secure_URL: uploadResult.secure_url,
				};
				result.push(data);
			} catch (error) {
				logger.error(error.message);
				if (i > 0) {
					let arrOfPublicId = [];
					for (let j = 0; j < result.length; j++) {
						arrOfPublicId.push(result[j].public_id);
					}

					rollbackUploadCloudinary(arrOfPublicId);
					result = null;
					return errorResponse(res, "Error uploading files");
				}
			}
		}

		for (let i = 0; i < req.files.length; i++) {
			fs.unlink(req.files[i].path, (err) => {
				if (err) {
					logger.error(err.message);
					return serverErrorResponse(res, err.message);
				}
			});
		}

		logger.info(result);
		return successResponse(res, statusCode, result);
	}
}

module.exports = { Upload };
