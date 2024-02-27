const { Item } = require("../models");
const { Op } = require("sequelize");
const {
  successResponse,
  errorResponse,
  notfoundResponse,
} = require("../helper/formatResponse");
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
      page = 1,
      pageSize = 10,
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

      if (items?.length === 0) {
        throw new Error(404)
      }
      successResponse(res, 200, items, "Success")
    } catch (error) {
      switch (error?.message) {
        case "404":
          notfoundResponse(res, "Data Not Found")
          break;
        default:
          errorResponse(res, error.message);
          break;
      }
    }
  }

  static async getDetailItem(req, res) {
    const { id } = req.params;

    try {
      const item = await Item.findOne({
        where: { id },
        attributes,
      });

      if (!item) {
        throw new Error(404)
      }
      successResponse(res, 200, item, "Success")
    } catch (error) {
      switch (error?.message) {
        case "404":
          notfoundResponse(res, "Data Not Found")
          break;
        default:
          errorResponse(res, error.message);
          break;
      }
    }
  }

  static async createItem(req, res) {
    const { name, price, stock, category, description, image } = req.body;
    try {
      const item = await Item.create(
        { name, price, stock, category, description, image },
        { returning: true }
      );
      successResponse(res, 201, item, "Created")
    } catch (error) {
      errorResponse(res, error.errors?.[0]?.message || error.message);
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


      if (rowCount === 0) {
        throw new Error(404)
      }
      successResponse(res, 200, updatedItems[0], "Updated")
    } catch (error) {
      switch (error?.message) {
        case "404":
          notfoundResponse(res, "Data Not Found")
          break;
        default:
          errorResponse(res, res, error.errors?.[0]?.message || error.message);
          break;
      }
    }
  }

  static async deleteItem(req, res) {
    const { id } = req.params;

    try {
      const item = await Item.destroy({ where: { id } });
      if (!item) {
        throw new Error(404)
      }
      successResponse(res, 200, undefined, "Deleted")
    } catch (error) {
      switch (error?.message) {
        case "404":
          notfoundResponse(res, "Data Not Found")
          break;
        default:
          errorResponse(res, error.message);
          break;
      }
    }
  }
}

module.exports = Items;
