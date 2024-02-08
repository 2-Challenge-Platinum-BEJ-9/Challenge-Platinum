const { User } = require("../models");
const { Op } = require("sequelize");
const {
  successResponse,
  errorResponse,
  serverErrorResponse,
} = require("../helper/fornatResponse");
const attributes = [
  "id",
  "firstName",
  "lastName",
  "email",
  "phoneNumber",
  "address",
  "authToken",
];

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
      token,
      image,
      isAdmin,
    } = req.body;

    // // const checkEmail = await User.findOne({ where: { email: email } });
    // // const checkPhone = await User.findOne({
    // //   where: { phoneNumber: phoneNumber },
    // });

    try {
      if (password !== passwordMatch) {
        throw new Error("Password not match!");
      }

      // if (checkEmail) {
      //   throw Error(
      //     `User with email ${email} already exist, try with different email`
      //   );
      // }

      // if (checkPhone) {
      //   throw Error(
      //     `User with phone number ${phoneNumber} already exist, try with different phone number`
      //   );
      // }

      const [user, created] = await User.findOrCreate({
        where: {
          [Op.and]: [{ email: email }, { phoneNumber: phoneNumber }],
        },
        default: {
          firstName: firstName,
          lastName: lastName,
          email: email,
          phoneNumber: phoneNumber,
          address: address,
          password: password,
          token,
          image,
          isAdmin,
        },
      });

      if (created) {
        return successResponse(
          res,
          201,
          user,
          "Success: The request was created."
        );
      } else {
        return errorResponse(res, "Already exist!");
      }
    } catch (error) {
      if (error) {
        errorResponse(res, error.message);
      } else {
        serverErrorResponse(res);
      }
      console.log(error);
    }
  }

  static async login(req, res) {
    const { email, password } = req.body;
    let message;
    let authToken;

    try {
      const findUser = await User.findOne({ where: { email: email } });
      const comparePass = bcrypt.compareSync(
        password,
        findUser.dataValues.password
      );

      if (findUser.dataValues.email !== email || comparePass !== password) {
        throw new Error((message = "Incorrect email or password!"));
      } else {
        authToken = `${email}-${Date.now()}`;
        data = await User.update(
          { authToken: authToken },
          { where: { email: email } }
        );
      }

      successResponse(res, data, message);
    } catch (error) {
      errorResponse(res, error, message);
    }
  }

  static async logout(req, res) {}
}

module.exports = AuthUser;
