const { Order, Item, sequelize } = require("../models");
const {
  successResponse,
  errorResponse,
  notfoundResponse,
  serverErrorResponse,
} = require("../helper/formatResponse");
const item = require("../models/item");

class Orders {
  static getAllOrders = async (req, res) => {
    try {
      console.log("eror");
      const data = await Order.findAll();
      if (!data || data.length === 0) {
        return notfoundResponse(res, "Database empty");
      }
      successResponse(res, data);
    } catch (error) {
      errorResponse(res, error.message);
    }
  };

  static getOrderById = async (req, res) => {
    try {
      const id = req.params.id;
      const data = await Order.findByPk(id);

      if (!data) {
        return notfoundResponse(res, "Order not found");
      }
      successResponse(res, data);
    } catch (error) {
      errorResponse(res, error.message);
    }
  };

  static createOrder = async (req, res) => {
    const { userId, itemId, qty } = req.body;
    try {
      sequelize.transaction(async (t) => {
        const item = await Item.findByPk(userId, { transaction: t });
        if (!item) {
          return notfoundResponse(res, "Items not found");
        }
        const user = await UserActivation.findByPk(itemId, { transaction: t });
        if (!user) {
          return notfoundResponse(res, "Users not found  not found");
        }
        if (qty > item.qty) {
          const data = await Order.create(
            {
              userId,
              itemId,
              qty,
              status: "pending",
            },
            { transaction: t }
          );
          successResponse(res, data, "Order created");
          await Item.update({ qty: item.qty - qty }, { where: { id: itemId } });
        } else {
          throw new Error(`Item ${itemId} insufficient to be ordered`);
        }
      });
    } catch (error) {
      errorResponse(res, error.message);
    }
  };

  static updateOrder = async (req, res) => {
    const id = req.params.id;
    const { status, itemId, qty } = req.body;

    try {
      sequelize.transaction(async (t) => {
        const data = await Order.findByPk(id);

        if (!id) {
          throw new Error(`id ${id} not found!`);
        }
        if (!data) {
          return notfoundResponse(res, "Order not found");
        } else {
          const updatedOrder = await Order.update(
            { status, itemId, qty },
            { where: { id: itemId }, transaction: t }
          );
          successResponse(res, updatedOrder, "Order updated");
        }
      });
    } catch (error) {
      errorResponse(res, error.message);
    }
  };
}

module.exports = { Orders };
