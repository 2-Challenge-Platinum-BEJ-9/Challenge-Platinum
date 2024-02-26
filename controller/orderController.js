const { Order, Item } = require("../models");
const { successResponse, errorResponse, notfoundResponse, serverErrorResponse } = require("../helper/fornatResponse");
const item = require("../models/item");
const { where } = require("sequelize");

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
      errorResponse(res, error);
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
      errorResponse(res, error);
    }
  };

  static createOrder = async (req, res) => {
    try {
      const { userId, itemId, qty } = req.body;
      const item = await Item.findByPk(itemId);
      if (!item) {
        return notfoundResponse(res, "Items not found");
      } else {
        if (qty > item.qty) {
          const data = await Order.create({
            userId,
            itemId,
            qty,
            status: "pending",
          });
          successResponse(res, data, "Order created");
          await Item.update({ qty: item.qty - qty }, { where: { id: itemId } });
        } else {
          throw new Error("Item ${itemId} insufficient to be ordered");
        }
      }
    } catch (error) {
      errorResponse(res, error);
    }
  };

  static updateOrder = async (req, res) => {
    try {
      const id = req.params.id;
      const { status, itemId, qty } = req.body;
      const data = await Order.findByPk(id);

      if (!id) {
        throw new Error("id ${id} is empty");
      }
      if (!data) {
        return notfoundResponse(res, "Order not found");
      } else {
        const updatedOrder = await Order.update({ status, itemId, qty }, { where: { id: itemId } });
        successResponse(res, updatedOrder, "Order updated");
      }
    } catch (error) {
      errorResponse(res, error);
    }
  };
}

module.exports = { Orders };
