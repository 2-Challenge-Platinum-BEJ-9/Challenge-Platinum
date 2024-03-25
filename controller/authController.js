const { User } = require("../models");
const { ValidationError } = require("sequelize");
const {
	successResponse,
	errorResponse,
	serverErrorResponse,
	unauthorizedResponse,
} = require("../helper/formatResponse");
const { sign, verify } = require("../lib/jwt");
const logger = require("../helper/logger");
const {
	sendVerificationEmail,
	generateVerificationToken,
} = require("../lib/nodemailer");

class AuthUser {
	static async register(req, res) {
		const {
			firstName,
			lastName,
			email,
			phoneNumber,
			address,
			password,
			passwordMatch,
			image,
			isAdmin,
		} = req.body;

		try {
			if (password !== passwordMatch) {
				return errorResponse(res, "Password not match!");
			}

			const existingEmail = await User.findOne({ where: { email: email } });
			const existingPhoneNumber = await User.findOne({
				where: { phoneNumber: phoneNumber },
			});

			if (existingEmail || existingPhoneNumber) {
				return errorResponse(res, "User already exist");
			}

			const user = await User.create({
				firstName: firstName,
				lastName: lastName,
				email: email,
				phoneNumber: phoneNumber,
				password: password,
				address: address,
				password: password,
				image: image,
				isAdmin: isAdmin,
				isVerified: false,
			});

			const data = {
				id: user.id,
				firstName: user.firstName,
				lastName: user.lastName,
				email: user.email,
				phoneNumber: user.phoneNumber,
				address: user.address,
				image: user.image,
				isAdmin: user.isAdmin,
				isVerified: user.isVerified,
			};

			sendVerificationEmail(email);

			logger.info(`Register Success!`);
			return successResponse(
				res,
				201,
				data,
				"Success: New User has been created."
			);
		} catch (error) {
			logger.error(error.message);
			if (error instanceof ValidationError) {
				const errors = error.errors.map((error) => ({
					path: error.path,
					message: error.message,
				}));
				return errorResponse(res, errors, "Validation error occured");
			} else {
				return serverErrorResponse(res, error.message);
			}
		}
	}

	static async login(req, res) {
		const { email, password } = req.body;

		try {
			const user = await User.findOne({
				where: { email: email },
			});

			if (!user) {
				return errorResponse(res, "User not found!");
			}

			const checkPass = await user.CorrectPassword(password, user.password);
			if (!checkPass) {
				return errorResponse(res, "Wrong password!");
			}

			let userData = {
				id: user.dataValues.id,
				firstName: user.dataValues.firstName,
				lastName: user.dataValues.lastName,
				email: user.dataValues.email,
				phoneNumber: user.dataValues.phoneNumber,
				address: user.dataValues.address,
				isAdmin: user.dataValues.isAdmin,
				image: user.dataValues.image,
			};
			const token = sign(userData);
			logger.info(`Login Success!`);
			return successResponse(
				res,
				200,
				token,
				`Welcome, ${user.firstName} ${user.lastName}`
			);
		} catch (error) {
			logger.error(error.message);
			return serverErrorResponse(res, error.message);
		}
	}

	static async logout(req, res) {
		try {
			const token = req.headers.authorization?.split(" ")[1];

			if (!token || token === undefined) {
				return unauthorizedResponse(res);
			}
			verify(token);
		} catch (error) {
			logger.error(error.message);
			return serverErrorResponse(res, error.message);
		}

		logger.info(`Logout Success!`);
		return successResponse(res, 200, null, "Logout Success");
	}
}

module.exports = { AuthUser };
