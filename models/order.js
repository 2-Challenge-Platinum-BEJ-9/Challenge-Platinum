"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Order.belongsTo(models.User, { foreignKey: "userId" }); // An order belongs to a user
      Order.belongsTo(models.Item, { foreignKey: "itemId" });
    }
  }
  Order.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        notEmpty: true,
        unique: true,
        references: {
          model: "Users",
          key: "id",
        },
      },

      itemId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        notEmpty: true,
        unique: true,
        references: {
          model: "Items",
          key: "id",
        },
      },
      qty: {
        type: DataTypes.INTEGER,
        allowNull: false,
        notEmpty: true,
        validate: {
          notNull: {
            msg: "order quantity is null",
          },
          notEmpty: {
            msg: "order quantity is empty",
          },
        },
      },
      totalPrice: {
        type: DataTypes.FLOAT,
        allowNull: false,
        notEmpty: true,

        validate: {
          notNull: {
            msg: "total price is null",
          },
          notEmpty: {
            msg: "total price is empty",
          },
        },
      },
      status: {
        type: DataTypes.ENUM("pending", "processing", "shipped", "delivered", "canceled"),
        allowNull: false,
        notEmpty: true,
        validate: {
          notNull: {
            msg: "order status is null",
          },
          notEmpty: {
            msg: "order status is empty",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "Order",
    }
  );
  return Order;
};
