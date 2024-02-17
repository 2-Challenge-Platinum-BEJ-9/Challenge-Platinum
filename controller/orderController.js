const order = require("../models/order");
const { successResponse, errorResponse, notfoundResponse, serverErrorResponse } = require("../helper/fornatResponse");

class Orders {
  static getAllOrders = async (req, res) => {
    try {
      const data = await order.findAll();
      if (!data || data.length === 0) {
        return notfoundResponse(res, error);
      }
      successResponse(res, data, "success", 200);
    } catch (error) {
      console.error(error);
      serverErrorResponse(res);
    }
  };

  static getOrderById = async (req, res) => {
    try {
      const id = req.params.id;
      const data = await order.findByPk(id);

      if (!data) {
        return notfoundResponse(res, error);
      }
      successResponse(res, data);
    } catch (error) {
      console.error(error);
      serverErrorResponse(res);
    }
  };

  static createOrder = async (req, res) => {
    try {
      const { userId, itemId, qty } = req.body;

      const data = await order.create({
        userId,
        itemId,
        qty,
        status: "pending",
      });
      successResponse(res, data, "Order created", 200);
    } catch (error) {
      console.error(error);
      errorResponse(res, error);
    }
  };

  static updateOrder = async (req, res) => {
    try {
      const id = req.params.id;
      if (!id) {
        return notfoundResponse(res, error);
      }
      const { status, itemId, qty } = req.body;

      const order = await order.findByPk(id); // Find the order by ID

      if (!order) {
        return notfoundResponse(res, error);
      }

      const updatedOrder = await order.update({ status, itemId, qty }); // Update the order

      successResponse(res, updatedOrder, "Order updated", 200);
    } catch (error) {
      console.error(error);
      errorResponse(res, error);
    }
  };
}

module.exports = { Orders };
