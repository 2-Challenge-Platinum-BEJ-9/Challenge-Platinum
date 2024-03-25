const { User } = require("../models");
const {
	successResponse,
	notfoundResponse,
	serverErrorResponse,
} = require("../helper/formatResponse");

class UserController {
	static allUsers = async (req, res) => {
		try {
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

			if (!data || data.length === 0) {
				return notfoundResponse(res, "User empty");
			}
			return successResponse(res, 200, data, "all  data Users");
		} catch (error) {
			return serverErrorResponse(res, error.message);
		}
	};

	static detailUser = async (req, res) => {
		try {
			const { id } = req.params;
			const data = await User.findByPk(id);
			if (!data) {
				return notfoundResponse(res, `data User by id (${id}) is not found`);
			} else {
				let result = {
					id: data.id,
					firstName: data.firstName,
					lastName: data.lastName,
					email: data.email,
					phoneNumber: data.phoneNumber,
					address: data.address,
					isAdmin: data.isAdmin,
					image: data.image,
				};
				return successResponse(res, 200, result, `detail user by id (${id})`);
			}
		} catch (error) {
			return serverErrorResponse(res, error.message);
		}
	};

	static updateUser = async (req, res) => {
		const { id } = req.params;
		const {
			firstName,
			lastName,
			email,
			password,
			phoneNumber,
			address,
			isAdmin,
			image,
		} = req.body;

		try {
			await User.update(
				{
					firstName: firstName,
					lastName: lastName,
					email: email,
					password: password,
					phoneNumber: phoneNumber,
					address: address,
					isAdmin: isAdmin,
					image: image,
				},
				{
					where: {
						id: id,
					},
				}
			);
			const data = await User.findByPk(id);

			const user = {
				id: data.id,
				firstName: data.firstName,
				lastName: data.lastName,
				email: data.email,
				phoneNumber: data.phoneNumber,
				address: data.address,
				isAdmin: data.isAdmin,
				image: data.image,
			};
			return successResponse(res, 200, user);
		} catch (error) {
			return serverErrorResponse(res, error.message);
		}
	};

	static deleteUser = async (req, res) => {
		try {
			const { id } = req.params;
			const newData = await User.findByPk(id);
			if (newData === null) {
				return notfoundResponse(res, `data user by id (${id}) is not found`);
			}
			await User.destroy({
				where: {
					id: id,
				},
			});
			successResponse(res, 200, null, `delete user by id (${id}) successfully`);
		} catch (error) {
			serverErrorResponse(res, error.message);
		}
	};
}
module.exports = { UserController };
