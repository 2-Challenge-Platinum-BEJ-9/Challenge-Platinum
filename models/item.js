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
          msg: "item is already",
        },
        validate: {
          notNull: {
            msg: "item name is null",
          },
          notEmpty: {
            msg: "item name is empty",
          },
        },
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: false,
        notEmpty: true,
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
        notEmpty: true,
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
        notEmpty: true,
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
        notEmpty: true,
        validate: {
          notNull: {
            msg: "item image is null",
          },
          notEmpty: {
            msg: "item image is empty",
          },
        },
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        notEmpty: true,
        validate: {
          notNull: {
            msg: "item description is null",
          },
          notEmpty: {
            msg: "item description is empty",
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
