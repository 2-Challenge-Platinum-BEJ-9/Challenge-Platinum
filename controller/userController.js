const { User } = require("../models");
const {
	successResponse,
	errorResponse,
	notfoundResponse,
	serverErrorResponse,
	unauthorizedResponse,
} = require("../helper/formatResponse");
const { verify } = require("../lib/jwt");

class UserController {
	static allUsers = async (req, res) => {
		const token = req.headers.authorization?.split(" ")[1];
		const verified = verify(token);
		try {
			if (!token) {
				return unauthorizedResponse(res);
			}

			const data = await User.findAll({
				attributes: [
					"id",
					"firstName",
					"lastName",
					"email",
					"phoneNumber",
					"address",
					"isAdmin",
					"image",
				],
			});

			if (data.length === 0) {
				return notfoundResponse(res, "User empty");
			}
			return successResponse(res, data, "all  data Users", 200);
		} catch (error) {
			console.log(error);
			return serverErrorResponse(res);
		}
	};

	static detailUser = async (req, res) => {
		try {
			// view detail User
			const { id } = req.params;
			const data = await User.findByPk(id); //check data user by id request
			if (data === null) {
				//check is null
				notfoundResponse(res, `data User by id (${id}) is not found`);
			} else {
				//check success respon
				successResponse(res, data, `detail user by id (${id})`, 200);
			}
		} catch (error) {
			//server error
			serverErrorResponse(res);
		}
	};

	static deleteUser = async (req, res) => {
		try {
			// delete user
			const { id } = req.params;
			const newData = await User.findByPk(id);
			if (newData === null) {
				//if user not found
				return notfoundResponse(res, `data user by id (${id}) is not found`);
			}
			await User.destroy({
				where: {
					id: id,
				},
			});
			successResponse(
				res,
				newData,
				`delete user by id (${id}) successfully`,
				200
			);
		} catch (error) {
			serverErrorResponse(res);
		}
	};
}
module.exports = { UserController };
