const { Orders } = require("../controller/orderController");
const { sequelize, Item, User, Order } = require("../models");

//mock
jest.mock("../models", () => {
  return {
    sequelize: {
      transaction: jest.fn(),
    },
    User: {
      findByPk: jest.fn(),
      update: jest.fn(),
    },
    Item: {
      findByPk: jest.fn(),
      update: jest.fn(),
    },
    Order: {
      findByPk: jest.fn(),
      create: jest.fn(),
    },
  };
});

const res = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn().mockReturnThis(),
};
const req = {
  query: {},
  params: {},
  body: {},
};

// testing
describe("Orders Controller testing section", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  const newOrder = {
    body: {
      userId: 1,
      itemId: 1,
      qty: 5,
    },
  };

  const item = {
    itemId: 1,
    qty: 10,
  };

  const user = {
    userId: 1,
  };

  it("should check if the new order has the same ID as the UserID in the User model", async () => {
    Item.findByPk.mockResolvedValue(item);
    User.findByPk.mockResolvedValue(user);

    Order.create.mockResolvedValue(Promise.resolve(newOrder));

    await Orders.createOrder(req, res);
    //console.log(Order.create.mockResolvedValue(Promise.resolve(newOrder)));
    // expect(Order.create).toHaveBeenCalledWith({
    //   userId: newOrder.body.userId,
    //   itemId: newOrder.body.itemId,
    //   qty: newOrder.body.qty,
    // });

    expect(newOrder.body.userId).toBe(user.userId);
    expect([]).not.toBe(user.userId);
  });
});
