"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Item extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Item.hasMany(models.Order, { foreignKey: "itemId" });
    }
  }
  Item.init(
    {
      name: {
        type: DataTypes.STRING(30),
        allowNull: false,
        notEmpty: true,
        unique: {
          args: true,
          msg: "Item already exists",
        },
        validate: {
          notNull: {
            msg: "Name cannot be empty.",
          },
          notEmpty: {
            msg: "Name cannot be empty.",
          },
        },
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: false,
        notEmpty: true,
        validate: {
          notNull: {
            msg: "Price cannot be empty.",
          },
          notEmpty: {
            msg: "Price cannot be empty.",
          },
        },
      },
      stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        notEmpty: true,
        validate: {
          notNull: {
            msg: "Stock cannot be empty.",
          },
          notEmpty: {
            msg: "Stock cannot be empty.",
          },
        },
      },
      category: {
        type: DataTypes.STRING(30),
        allowNull: false,
        notEmpty: true,
        validate: {
          notNull: {
            msg: "Category cannot be empty.",
          },
          notEmpty: {
            msg: "Category cannot be empty.",
          },
        },
      },
      image: {
        type: DataTypes.TEXT,
        allowNull: false,
        notEmpty: true,
        validate: {
          notNull: {
            msg: "Image cannot be empty.",
          },
          notEmpty: {
            msg: "Image cannot be empty.",
          },
        },
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        notEmpty: true,
        validate: {
          notNull: {
            msg: "Description cannot be empty.",
          },
          notEmpty: {
            msg: "Description cannot be empty.",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "Item",
    }
  );
  return Item;
};
