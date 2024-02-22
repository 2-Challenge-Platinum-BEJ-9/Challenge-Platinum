const { User } = require("../models");
const { Op } = require("sequelize");
const {
  successResponse,
  errorResponse,
  serverErrorResponse,
  unauthorizedResponse,
} = require("../helper/formatResponse");
const { sign, verify } = require("../lib/jwt");

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
    let token;
    console.log(req.body);

    try {
      if (password !== passwordMatch) {
        throw new Error("Password not match!");
      }

      const [user, created] = await User.findOrCreate({
        where: {
          [Op.and]: [{ email: email }, { phoneNumber: phoneNumber }],
        },
        defaults: {
          firstName: firstName,
          lastName: lastName,
          email: email,
          phoneNumber: phoneNumber,
          address: address,
          password: password,
          token,
          image: image,
          isAdmin: isAdmin,
        },
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
      };

      if (created) {
        return successResponse(
          res,
          201,
          data,
          "Success: New User has been created."
        );
      } else {
        return errorResponse(
          res,
          `email ${email} or phone number ${phoneNumber} already exist!`
        );
      }
    } catch (error) {
      if (error.errors) {
        errorResponse(
          res,
          error.errors.map((err) => err.message)
        );
      } else {
        serverErrorResponse(res, error.message);
      }
    }
  }

  static async login(req, res) {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({
        where: { email: email },
      });

      if (
        user.email !== email ||
        !(await user.CorrectPassword(password, user.password))
      ) {
        throw new Error("Incorrect email or password!");
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

      return successResponse(
        res,
        200,
        token,
        `Welcome, ${user.firstName} ${user.lastName}`
      );
    } catch (error) {
      if (error.errors) {
        return errorResponse(
          res,
          error.errors.map((err) => err.message)
        );
      } else {
        return serverErrorResponse(res, error.message);
      }
    }
  }

  static async logout(req, res) {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(" ")[1];

    try {
      if (!authHeader || authHeader === undefined) {
        throw Error("Unauthorized!");
      }
      verify(token);
    } catch (error) {
      if (error.errors) {
        return errorResponse(
          res,
          error.errors.map((err) => err.message)
        );
      } else if (Error) {
        return unauthorizedResponse(res);
      } else {
        return serverErrorResponse(res);
      }
    }

    return successResponse(res, 200, null, "Logout Success");
  }
}

module.exports = AuthUser;
