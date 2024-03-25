const { Orders } = require("../../controller/orderController");
const { Item, User, Order, sequelize } = require("../../models");

///mock
jest.mock("../models", () => ({
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
	sequelize: {
		transaction: jest.fn(),
	},
}));

const mockRes = () => {
	const res = {};

	res.status = jest.fn().mockReturnThis();
	res.json = jest.fn().mockReturnThis();

	return res;
};

const mockReq = (body = {}, params = {}) => {
	return { body: body, params: params };
};

const item = { itemId: 1, qty: 15, price: 1000 };
const user = { userId: 1 };
const order = { userId: 1, itemId: 1, qty: 5 };
const bulkOrder = { userId: 1, itemId: 1, qty: 100 };

//testing
describe("Orders Controller testing section", () => {
	beforeEach(async () => {
		t = { commit: jest.fn(), rollback: jest.fn() };
		sequelize.transaction.mockResolvedValue(t);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it("should return notfoundResponse if item is not found in the Item table", async () => {
		const req = mockReq(order);
		const res = mockRes();

		Item.findByPk.mockReturnValue(null);
		User.findByPk.mockReturnValue(user);

		await Orders.createOrder(req, res);
		expect(Item.findByPk).toHaveBeenCalledWith(order.itemId);
		expect(User.findByPk).toHaveBeenCalledWith(order.userId);
		expect(res.status).toHaveBeenCalledWith(404);
		expect(res.json).toHaveBeenCalledWith({
			status: "fail",
			message: "Items not found",
		});
	});

	it("should return notfoundResponse if user is not found in the User table", async () => {
		const req = mockReq(order);
		const res = mockRes();

		Item.findByPk.mockReturnValue(item.itemId);
		User.findByPk.mockReturnValue(null);

		await Orders.createOrder(req, res);
		expect(User.findByPk).toHaveBeenCalledWith(order.userId);
		expect(res.status).toHaveBeenCalledWith(404);
		expect(res.json).toHaveBeenCalledWith({
			status: "fail",
			message: "Users not found",
		});
	});

	it("should return successResponse and create order when all conditions are met", async () => {
		const req = mockReq(order);
		const res = mockRes();
		const expectedTotalPrice = order.qty * item.price;

		Item.findByPk.mockReturnValue(item);
		User.findByPk.mockReturnValue(user);

		await Orders.createOrder(req, res);

		expect(Item.findByPk).toHaveBeenCalledWith(order.itemId);
		expect(User.findByPk).toHaveBeenCalledWith(order.userId);

		expect(Item.update).toHaveBeenCalledWith(
			{ qty: item.qty - order.qty },
			{ where: { id: order.itemId }, transaction: t }
		);
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith({
			status: "success",
			data: {
				userId: order.userId,
				itemId: order.itemId,
				qty: order.qty,
				status: "pending",
				totalPrice: expectedTotalPrice,
			},
			message: "Order created",
		});
	});

	it("should return errorResponse when item quantity is insufficient", async () => {
		const req = mockReq(bulkOrder);
		const res = mockRes();

		Item.findByPk.mockReturnValue(item);
		User.findByPk.mockReturnValue(user.userId);

		await Orders.createOrder(req, res);

		expect(Item.findByPk).toHaveBeenCalledWith(1);
		expect(User.findByPk).toHaveBeenCalledWith(1);
		expect(res.status).toHaveBeenCalledWith(500);
		expect(res.json).toHaveBeenCalledWith({
			status: "error",
			message: "Item 1 insufficient to be ordered",
		});
	});

	it("should return serverErrorResponse if failed to create order", async () => {
		const req = mockReq(order);
		const res = mockRes();

		Item.findByPk.mockReturnValue({ id: item.itemId, qty: 10 });
		User.findByPk.mockReturnValue(user);
		Order.create.mockRejectedValue(new Error("Failed to create order"));

		await Orders.createOrder(req, res);
		expect(Item.findByPk).toHaveBeenCalledWith(order.itemId);
		expect(User.findByPk).toHaveBeenCalledWith(order.userId);
		expect(res.status).toHaveBeenCalledWith(500);
	});
});
