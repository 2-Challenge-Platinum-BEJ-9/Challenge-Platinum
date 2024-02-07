const bcrypt = require("bcrypt");
const { User } = require("../models");
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
  "createdAt",
  "updatedAt",
];

class AuthUser {
  static async postRegister(req, res) {
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
    } = req.body;
    let message;

    const checkEmail = await User.findOne({ where: { email: email } });
    const checkPhone = await User.findOne({
      where: { phoneNumber: phoneNumber },
    });

    try {
      if (password !== passwordMatch) {
        throw new Error((message = "Password not match!"));
      }

      if (checkEmail) {
        throw Error(
          (message = `User with email ${email} already exist, try with different email`)
        );
      }

      if (checkPhone) {
        throw Error(
          (message = `User with phone number ${phoneNumber} already exist, try with different phone number`)
        );
      }

      const saltRounds = 10;
      let hash = bcrypt.hashSync(password, saltRounds);
      const data = await User.create({
        firstName: firstName,
        lastName: lastName,
        email: email,
        phoneNumber: phoneNumber,
        address: address,
        password: hash,
        token: token,
        image: image,
        isAdmin: false,
      });

      // const data = await User.findOne({
      //   where: { firstName: firstName, lastName: lastName, email: email },
      //   attributes: attributes,
      // });

      return successResponse(
        res,
        201,
        data,
        "Success: The request was created."
      );
    } catch (error) {
      if (error.errors) {
        errorResponse(
          res,
          error.errors.map((err) => err.message)
        );
      } else {
        serverErrorResponse(res);
      }
      console.log(error);
    }
  }

  static async postLogin(req, res) {
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

  static async deleteLogout(req, res) {}
}

module.exports = AuthUser;
