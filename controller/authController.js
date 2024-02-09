const { User } = require("../models");
const { Op } = require("sequelize");
const {
  successResponse,
  errorResponse,
  serverErrorResponse,
  unauthorizedResponse,
} = require("../helper/fornatResponse");

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

      if (user.token !== null) {
        throw new Error("Already login!");
      }

      let token = `${email} - ${Date.now()}`;
      await User.update(
        {
          token: token,
        },
        { where: { email: email } }
      );

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
    let { email } = req.body;

    try {
      const user = await User.findOne({
        where: { email: email },
      });

      if (!user.token) {
        throw Error("Unauthorized!");
      }

      await User.update(
        {
          token: null,
        },
        { where: { email: email } }
      );

      return successResponse(res, 200, null, "Logout Success");
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
  }
}

module.exports = AuthUser;
