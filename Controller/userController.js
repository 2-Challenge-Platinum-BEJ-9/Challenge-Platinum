const { User } = require("../models");
const {
  successResponse,
  errorResponse,
  notfoundResponse,
  serverErrorResponse,
} = require("../helper/fornatResponse");

class UserController {
  static allUsers = async (req, res) => {
    try {
      const data = await User.findAll(); //ambil semua data user
      successResponse(res, data, "all  data Users", 200); //respon sukses dengan status 200
    } catch (error) {
      serverErrorResponse(res);
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
