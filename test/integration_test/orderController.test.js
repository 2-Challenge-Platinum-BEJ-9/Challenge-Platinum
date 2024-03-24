const request = require("supertest");
const app = require("../../main");

describe("Orders Controller", () => {
  it("should get all orders", async () => {
    const response = await request(app).get("/api/v1/orders");
    expect(response.status).toBe(200);
    expect(response.body.status).toBe("success");
    expect(response.body.message).toBe("found all data");
    expect(Array.isArray(response.body.data)).toBe(true);
  });
  it("should create a new order", async () => {
    const newOrder = {
      userId: 1,
      itemId: 1,
      qty: 2,
    };
    const response = await request(app).post("/api/v1/orders").send(newOrder);
    expect(response.status).toBe(200);
    expect(response.body.status).toBe("success");
    expect(response.body.message).toBe("Order created");
    expect(response.body.data.userId).toBe(newOrder.userId);
    expect(response.body.data.itemId).toBe(newOrder.itemId);
    expect(response.body.data.qty).toBe(newOrder.qty);
    expect(response.body.data.status).toBe("pending");
  });
  it("should update an existing order", async () => {
    const updatedOrder = {
      status: "shipped",
      itemId: 1,
      qty: 1,
    };
    const response = await request(app).put("/api/v1/orders/1").send(updatedOrder);
    expect(response.status).toBe(200);
    expect(response.body.status).toBe("success");
    expect(response.body.message).toBe("Order updated");
    expect(response.body.data.itemId).toBe(updatedOrder.itemId);
    expect(response.body.data.qty).toBe(updatedOrder.qty);
    expect(response.body.data.status).toBe(updatedOrder.status);
  });
  it("should get a specific order by ID", async () => {
    const orderId = 1;
    const response = await request(app).get(`/api/v1/orders/${orderId}`);
    expect(response.status).toBe(200);
    expect(response.body.status).toBe("success");
    expect(response.body.message).toBe("data id is found");
    expect(response.body.data.id).toBe(orderId);
  });
});
