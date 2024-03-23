const { Order, Item, User } = require("../models");
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
      return successResponse(res, data);
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
      return successResponse(res, data);
    } catch (error) {
      return errorResponse(res, error.message);
    }
  };

  static createOrder = async (req, res) => {
    const { userId, itemId, qty } = req.body;

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
      console.log(item.price);
      const data = await Order.create({
        userId,
        itemId,
        qty,
        status: "pending",
      });
      await Item.update({ qty: item.qty - req.body.qty }, { where: { id: req.body.itemId } });
      return successResponse(
        res,
        200,
        {
          itemId: req.body.itemId,
          qty: req.body.qty,
          userId: req.body.userId,
          status: "pending",
        },
        "Order created"
      );
    } catch (error) {
      return serverErrorResponse(res, error.message);
    }
  };

  static updateOrder = async (req, res) => {
    const id = req.params.id;
    const { status, itemId, qty } = req.body;

    try {
      const data = await Order.findByPk(id);

      if (!id) {
        throw new Error(`id ${id} not found!`);
      }
      if (!data) {
        return notfoundResponse(res, "Order not found");
      } else {
        const updatedOrder = await Order.update({ status, itemId, qty }, { where: { id: itemId } });
        return successResponse(res, updatedOrder, "Order updated");
      }
    } catch (error) {
      return errorResponse(res, "Failed to create order");
    }
  };
}

module.exports = { Orders };
