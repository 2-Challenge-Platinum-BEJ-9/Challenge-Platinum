const bcrypt = require("bcrypt");
const { User } = require("../models");
const {
  successResponse,
  successCreatedResponse,
  errorResponse,
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
    const { firstName, lastName, email, phoneNumber, address, password } =
      req.body;
    let message;

    const checkEmail = await User.findOne({ where: { email: email } });
    const checkPhone = await User.findOne({
      where: { phoneNumber: phoneNumber },
    });

    try {
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

      const saltRounds = 20;
      let hash = bcrypt.hashSync(password, saltRounds);
      await User.create({
        firstName: firstName,
        lastName: lastName,
        email: email,
        phoneNumber: phoneNumber,
        address: address,
        password: hash,
        token,
        isAdmin,
        image,
      });

      const data = await User.findOne({
        where: { firstName: firstName, lastName: lastName, email: email },
        attributes: attributes,
      });

      successCreatedResponse(res, data, message);
    } catch (error) {
      errorResponse(res, error, message);
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
