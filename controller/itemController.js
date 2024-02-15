const { Item } = require("../models");
const { Op } = require("sequelize");
const {
  successResponse,
  errorResponse,
  notfoundResponse,
} = require("../helper/fornatResponse");
const attributes = [
  "id",
  "name",
  "price",
  "stock",
  "category",
  "description",
  "image",
];

class Items {
  static async getAllItem(req, res) {
    const {
      page,
      pageSize,
      minPrice,
      maxPrice,
      orderBy,
      orderType = "ASC",
    } = req.query;

    try {
      /**
       * Find all items with:
       * - Pagination
       * - Filter minPrice, maxPrice, orderBy
       */
      const items = await Item.findAll({
        where:
          minPrice && maxPrice
            ? {
                price: {
                  [Op.between]: [minPrice, maxPrice],
                },
              }
            : minPrice
            ? {
                price: {
                  [Op.gte]: minPrice,
                },
              }
            : maxPrice && {
                price: {
                  [Op.lte]: maxPrice,
                },
              },
        ...(page &&
          pageSize && {
            offset: (page - 1) * pageSize,
            limit: pageSize,
          }),
        ...(orderBy && { order: [[orderBy, orderType]] }),
        attributes,
      });
      successResponse(res, items);
    } catch (error) {
      errorResponse(res, error.message);
    }
  }

  static async getDetailItem(req, res) {
    const { id } = req.params;

    try {
      const item = await Item.findOne({
        where: { id },
        attributes,
      });

      successResponse(res, item);
    } catch (error) {
      errorResponse(res, error.message);
    }
  }

  static async createItem(req, res) {
    const { name, price, stock, category, description, image } = req.body;
    try {
      const item = await Item.create(
        { name, price, stock, category, description, image },
        { returning: true }
      );
      successResponse(res, item);
    } catch (error) {
      errorResponse(res, error.message);
    }
  }

  static async updateItem(req, res) {
    const { id } = req.params;
    const { name, price, stock, category, description, image } = req.body;

    try {
      const [rowCount, updatedItems] = await Item.update(
        { name, price, stock, category, description, image },
        {
          where: { id },
          returning: attributes,
        }
      );
      if (rowCount > 0) {
        successResponse(res, updatedItems[0]);
      } else {
        notfoundResponse(res, "Item Not Found");
      }
    } catch (error) {
      errorResponse(res, error.message);
    }
  }

  static async deleteItem(req, res) {
    const { id } = req.params;

    try {
      await Item.destroy({ where: { id } });
      successResponse(res, null);
    } catch (error) {
      errorResponse(res, error.message);
    }
  }
}

module.exports = Items;
