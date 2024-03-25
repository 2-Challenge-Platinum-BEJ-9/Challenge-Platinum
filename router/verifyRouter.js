const router = require("express").Router();
const {
	successResponse,
	errorResponse,
	serverErrorResponse,
} = require("../helper/formatResponse");
const { User } = require("../models");
const { methodNotAllowed } = require("../middleware/methodProhibited");

router
	.route("")
	.get(async (req, res) => {
		const { email } = req.query;

		try {
			if (!email) {
				return errorResponse(res, "Missing verification email");
			}

			const user = await User.findOne({ where: { email: email } });
			if (!user) {
				return errorResponse(res, "Invalid verification email");
			}

			await User.update({ isVerified: true }, { where: { email: email } });

			const data = {
				id: user.id,
				firstName: user.firstName,
				lastName: user.lastName,
				email: user.email,
				phoneNumber: user.phoneNumber,
				address: user.address,
				isAdmin: user.isAdmin,
				isVerified: user.isVerified,
			};

			return successResponse(
				res,
				200,
				data,
				"Your email has been verified successfully!"
			);
		} catch (error) {
			return serverErrorResponse(res, error.message);
		}
	})
	.all(methodNotAllowed);

module.exports = router;
