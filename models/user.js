"use strict";
const { Model } = require("sequelize");
const bcrypt = require("bcrypt");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init(
    {
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        notEmpty: true,
        validate: {
          notNull: {
            msg: "first name is null",
          },
          notEmpty: {
            msg: "first name is empty",
          },
        },
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "last name is null",
          },
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        notEmpty: true,
        unique: {
          args: true,
          msg: "email is already", //harus unik
        },
        isEmail: true,
        validate: {
          notNull: {
            msg: "Email is null",
          },
          notEmpty: {
            msg: "email is empty",
          },
          isEmail: {
            msg: "Incorrect email format", //format email
          },
        },
      },
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        notEmpty: true,
        unique: {
          args: true,
          msg: "phone number is already",
        },
        validate: {
          notNull: {
            msg: "Email is null",
          },
          notEmpty: {
            msg: "Phone Number is empty",
          },
        },
      },
      address: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      password: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Password is null",
          },
          len: {
            args: [6, 20],
            msg: "Password must be at least 6-20 characters",
          },
        },
      },
      token: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      isAdmin: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      image: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "User",
    }
  );

  User.beforeCreate((user) => {
    user.password = bcrypt.hashSync(
      user.password,
      bcrypt.genSaltSync(10),
      null
    );
  });

  User.prototype.CorrectPassword = async (reqPassword, passwordDB) => {
    return await bcrypt.compareSync(reqPassword, passwordDB);
  };

  return User;
};
