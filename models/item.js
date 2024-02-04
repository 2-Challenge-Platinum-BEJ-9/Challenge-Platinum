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
      // define association here
    }
  }
  Item.init(
    {
      name: {
        type: DataTypes.STRING(30),
        allowNull: false,
        unique: {
          args: true,
          msg: "item is already",
        },
        validate: {
          notNull: {
            msg: "item name is null",
          },
          notEmpty: {
            msg: "item name is null",
          },
        },
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
        validate: {
          notNull: {
            msg: "item price is null",
          },
          notEmpty: {
            msg: "item price is empty",
          },
        },
      },
      stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
          notNull: {
            msg: "item stock is null",
          },
          notEmpty: {
            msg: "item stock is empty",
          },
        },
      },
      category: {
        type: DataTypes.STRING(30),
        allowNull: false,
        validate: {
          notNull: {
            msg: "item category is null",
          },
          notEmpty: {
            msg: "item category is empty",
          },
        },
      },
      image: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notNull: {
            msg: "item image is null",
          },
          notEmpty: {
            msg: "item image is empty",
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
