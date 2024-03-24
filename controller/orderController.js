const { Order, Item, User, sequelize } = require("../models");
const { successResponse, errorResponse, notfoundResponse, serverErrorResponse } = require("../helper/formatResponse");
const order = require("../models/order");

class Orders {
  static getAllOrders = async (req, res) => {
    try {
      console.log("eror");
      const data = await Order.findAll();
      if (!data || data.length === 0) {
        return notfoundResponse(res, "Database empty");
      }
      return successResponse(res, 200, data, "found all data");
    } catch (error) {
      return errorResponse(res, error.message);
    }
  };

  static getOrderById = async (req, res) => {
    try {
      const id = req.params.id;
      const data = await Order.findByPk(id);

      if (!data) {
        return notfoundResponse(res, "Order not found");
      }
      return successResponse(res, 200, data, "data id is found");
    } catch (error) {
      return errorResponse(res, error.message);
    }
  };

  static createOrder = async (req, res) => {
    const { userId, itemId, qty } = req.body;
    const t = await sequelize.transaction();

    try {
      const user = await User.findByPk(userId);
      if (!user) {
        return notfoundResponse(res, "Users not found");
      }
      const item = await Item.findByPk(itemId);

      if (!item) {
        return notfoundResponse(res, "Items not found");
      }

      if (qty > item.qty) {
        throw new Error(`Item ${itemId} insufficient to be ordered`);
      }
      const totalPrice = qty * item.price;
      await Order.create(
        {
          userId,
          itemId,
          qty,
          status: "pending",
          totalPrice,
        },
        { transaction: t }
      );
      const orderedData = {
        userId,
        itemId,
        qty,
        status: "pending",
        totalPrice,
      };
      await Item.update({ qty: item.qty - req.body.qty }, { where: { id: req.body.itemId }, transaction: t });
      await t.commit();
      return successResponse(res, 200, orderedData, "Order created");
    } catch (error) {
      await t.rollback();
      return serverErrorResponse(res, error.message);
    }
  };

  static updateOrder = async (req, res) => {
    const id = req.params.id;
    const { status, itemId, qty } = req.body;
    const item = await Item.findByPk(itemId);
    const totalPrice = qty * item.price;
    const t = await sequelize.transaction();

    try {
      const data = await Order.findByPk(id);

      if (!id) {
        throw new Error(`id ${id} not found!`);
      }
      if (!data) {
        return notfoundResponse(res, "Order not found");
      } else {
        await Order.update({ status, itemId, qty, totalPrice }, { where: { id: id }, transaction: t });
        const updatedData = {
          status,
          itemId,
          qty,
          totalPrice,
        };
        await t.commit();

        return successResponse(res, 200, updatedData, "Order updated");
      }
    } catch (error) {
      await t.rollback();
      return errorResponse(res, "Failed to update order");
    }
  };
}

module.exports = { Orders };
