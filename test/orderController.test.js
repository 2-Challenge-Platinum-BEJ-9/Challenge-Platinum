const { Orders } = require("../controller/orderController");
const { Item, User, Order } = require("../models");

///mock
jest.mock("../models", () => ({
  sequelize: {
    transaction: jest.fn(),
  },
  User: {
    findByPk: jest.fn(),
  },
  Item: {
    findByPk: jest.fn(),
    update: jest.fn(),
  },
  Order: {
    findByPk: jest.fn(),
    create: jest.fn(),
  },
}));

const res = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn().mockReturnThis(),
};

const req = {
  params: {},
  body: {},
};

//testing
describe("Orders Controller testing section", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return notfoundResponse when items are not found", async () => {
    req.body = { userId: 1, itemId: 1, qty: 5 };
    Item.findByPk.mockResolvedValueOnce(null);

    await Orders.createOrder(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Items not found" });
  });

  it("should return successResponse and create order when all conditions are met", async () => {
    const item = { id: 1, qty: 10 };
    const user = { id: 1 };
    const order = { id: 1, userId: 1, itemId: 1, qty: 5, status: "pending" };

    Item.findByPk.mockResolvedValueOnce(item);
    User.findByPk.mockResolvedValueOnce(user);
    Order.create.mockResolvedValueOnce(order);

    await Orders.createOrder(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: "Order created", data: order });
  });

  it("should return errorResponse when item quantity is insufficient", async () => {
    const item = { id: 1, qty: 3 };
    const user = { id: 1 };

    Item.findByPk.mockResolvedValueOnce(item);
    User.findByPk.mockResolvedValueOnce(user);

    await Orders.createOrder(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: `Item ${item.id} insufficient to be ordered` });
  });

  it("should return errorResponse when an error occurs", async () => {
    const error = new Error("Database error");
    Item.findByPk.mockRejectedValueOnce(error);

    await Orders.createOrder(req, res);

    expect(res.status).toHaveBeenCalledWith(500); // Check for internal server error code
    expect(res.json).toHaveBeenCalledWith({ message: error.message });
  });
});
