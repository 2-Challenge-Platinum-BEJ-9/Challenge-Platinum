const { User } = require("../models");
const { Op } = require("sequelize");
const {
  successResponse,
  errorResponse,
  serverErrorResponse,
} = require("../helper/formatResponse");
const { sign, verify } = require("../lib/jwt");
const { logger } = require("../helper/logger");
const { MyCustomError } = require("../helper/customError");

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
        throw new MyCustomError("Password not match!");
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
        logger.info(`Register Success!`);
        return successResponse(
          res,
          201,
          data,
          "Success: New User has been created."
        );
      } else {
        throw new MyCustomError(
          `email ${email} or phone number ${phoneNumber} already exist!`
        );
      }
    } catch (error) {
      logger.error(error.message);
      if (error instanceof MyCustomError) {
        return errorResponse(res, error.message);
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

      if (
        user.email !== email ||
        !(await user.CorrectPassword(password, user.password))
      ) {
        throw new MyCustomError("Incorrect email or password!");
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
      if (error instanceof MyCustomError) {
        return errorResponse(res, error.message);
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
        throw new MyCustomError("Unauthorized!");
      }
      verify(token);
    } catch (error) {
      logger.error(error.message);
      if (error instanceof MyCustomError) {
        return errorResponse(res, error.message);
      } else {
        return serverErrorResponse(res, error.message);
      }
    }

    logger.info(`Logout Success!`);
    return successResponse(res, 200, null, "Logout Success");
  }
}

module.exports = AuthUser;
