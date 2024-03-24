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
      User.hasMany(models.Order, { foreignKey: "userId" });
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
            msg: "phone number is null",
          },
          notEmpty: {
            msg: "Phone Number is empty",
          },
        },
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
        notEmpty: true,
        validate: {
          notNull: {
            msg: "address is null",
          },
          notEmpty: {
            msg: "address is empty",
          },
        },
      },
      password: {
        type: DataTypes.TEXT,
        allowNull: false,
        notEmpty: true,
        validate: {
          notEmpty: {
            msg: "Password is empty",
          },
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
        allowNull: false,
        notEmpty: true,
        validate: {
          notNull: {
            msg: "token is null",
          },
          notEmpty: {
            msg: "token is empty",
          },

        },
      },
      isAdmin: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        validate: {
          notNull: {
            msg: "isAdmin is null",
          },
        },
      },
      image: {
        type: DataTypes.TEXT,
        allowNull: true,
        notEmpty: true,
        validate: {
          notEmpty: {
            msg: "image is empty",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "User",
      tableName: "Users",
    }
  );


  User.beforeCreate((user) => {
    user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10), null);

  User.addHook("beforeCreate", async (user) => {
    user.password = await bcrypt.hash(user.password, bcrypt.genSaltSync(10));

  });

  User.prototype.CorrectPassword = async (reqPassword, passwordDB) => {
    return bcrypt.compare(reqPassword, passwordDB);
  };

  return User;
};
