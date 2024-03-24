const request = require("supertest");
const app = require("../../main");
const { User, Item } = require("../../models");

let id, token;
const userTest = {
  firstName: "test7654",
  lastName: "",
  email: "test7654@mail.com",
  phoneNumber: "089987236487",
  password: "Test7654",
  address: "address",
  image: "image",
  isAdmin: true,
};

const data = [
  {
    name: "test5467",
    price: 11000,
    stock: 11,
    category: "test1",
    description: "test1",
    image: "https://example.com/image.png",
  },
  {
    name: "test9876",
    price: 11000,
    stock: 11,
    category: "test1",
    description: "test1",
    image: "https://example.com/image.png",
  },
];

beforeAll(async () => {
  try {
    await User.create(userTest);
    const item = await Item.create(data[0], { returning: true });
    id = item.id;
  } catch (error) {
    console.log(error.message);
  }
  const loginResponse = await request(app).post(`/api/v1/auth/login/`).send({
    email: userTest.email,
    password: userTest.password,
  });
  token = loginResponse.body?.data;
});

afterAll(async () => {
  await User.destroy({ truncate: { cascade: false } });
  await Item.destroy({ truncate: { cascade: false } });
});

describe("All Items - GET /api/v1/items", () => {
  it("should return 200", async () => {
    const response = await request(app).get("/api/v1/items");
    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toMatchObject({
      status: "success",
      message: "Success",
    });
    expect(response.body.data).toBeDefined();
    expect(response.body.data).toBeDefined();
    expect(response.body.data).toBeInstanceOf(Array);
    expect(response.body.data).toHaveProperty([0, "id"]);
    expect(response.body.data).toHaveProperty([0, "name"]);
    expect(response.body.data).toHaveProperty([0, "price"]);
    expect(response.body.data).toHaveProperty([0, "stock"]);
    expect(response.body.data).toHaveProperty([0, "category"]);
    expect(response.body.data).toHaveProperty([0, "description"]);
    expect(response.body.data).toHaveProperty([0, "image"]);
  });
  it("should return 404", async () => {
    const response = await request(app)
      .get("/api/v1/items")
      .query({ page: 1000 });
    expect(response.status).toBe(404);
    expect(response.body).toBeDefined();
    expect(response.body).toEqual({
      status: "fail",
      message: "Data Not Found",
    });
    expect(response.body.data).toBeUndefined();
  });
  it("should return 400", async () => {
    const response = await request(app)
      .get("/api/v1/items")
      .query({ page: "error" });
    expect(response.status).toBe(400);
    expect(response.body).toBeDefined();
    expect(response.body).toMatchObject({
      status: "fail",
    });
    expect(response.body.message).toBeDefined();
    expect(response.body.data).toBeUndefined();
  });
});

describe("Create Item - POST /api/v1/items", () => {
  it("should return 201", async () => {
    const response = await request(app)
      .post("/api/v1/items/")
      .set("Authorization", `Bearer ${token}`)
      .send(data[1]);
    expect(response.status).toBe(201);
    expect(response.body).toBeDefined();
    expect(response.body).toMatchObject({
      status: "success",
      data: data[1],
      message: "Created",
    });
  });
  it("should return 400", async () => {
    const response = await request(app)
      .post("/api/v1/items/")
      .set("Authorization", `Bearer ${token}`)
      .send(data[0]);
    expect(response.status).toBe(400);
    expect(response.body).toBeDefined();
    expect(response.body).toEqual({
      status: "fail",
      errors: "Item already exists",
      message: "Bad request. Please check your input",
    });
  });
  it("should return 401", async () => {
    const response = await request(app).post("/api/v1/items/").send(data[0]);
    expect(response.status).toBe(401);
    expect(response.body).toBeDefined();
    expect(response.body).toEqual({
      status: "fail",
      message: "Unauthorized, Log in first!",
    });
    expect(response.body.errors).toBeUndefined();
    expect(response.body.data).toBeUndefined();
  });
});

describe("Detail Item - GET /api/v1/items/:id", () => {
  it("should return 200", async () => {
    const response = await request(app).get(`/api/v1/items/${id}`);
    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
    expect(response.body).toEqual({
      status: "success",
      data: { id, ...data[0] },
      message: "Success",
    });
  });
  it("should return 404", async () => {
    const response = await request(app).get("/api/v1/items/0");
    expect(response.status).toBe(404);
    expect(response.body).toBeDefined();
    expect(response.body).toEqual({
      status: "fail",
      message: "Data Not Found",
    });
    expect(response.body.data).toBeUndefined();
  });
  it("should return 400", async () => {
    const response = await request(app).get("/api/v1/items/error");
    expect(response.status).toBe(400);
    expect(response.body).toBeDefined();
    expect(response.body).toMatchObject({
      status: "fail",
      message: "Bad request. Please check your input",
    });
    expect(response.body.errors).toBeDefined();
    expect(response.body.data).toBeUndefined();
  });
});

describe("Update Item - PUT /api/v1/items/:id", () => {
  it("should return 200", async () => {
    data[0].description = "new description";
    const response = await request(app)
      .put(`/api/v1/items/${id}`)
      .set("Authorization", `Bearer ${token}`)
      .send(data[0]);
    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
    expect(response.body).toEqual({
      status: "success",
      data: { id, ...data[0] },
      message: "Updated",
    });
  });
  it("should return 404", async () => {
    data[0].description = "new description";
    const response = await request(app)
      .put(`/api/v1/items/0`)
      .set("Authorization", `Bearer ${token}`)
      .send(data[0]);
    expect(response.status).toBe(404);
    expect(response.body).toBeDefined();
    expect(response.body).toEqual({
      status: "fail",
      message: "Data Not Found",
    });
    expect(response.body.data).toBeUndefined();
  });
  it("should return 400", async () => {
    data[0].description = "new description";
    const response = await request(app)
      .put(`/api/v1/items/error`)
      .set("Authorization", `Bearer ${token}`)
      .send(data[0]);
    expect(response.status).toBe(400);
    expect(response.body).toBeDefined();
    expect(response.body).toMatchObject({
      status: "fail",
      message: "Bad request. Please check your input",
    });
    expect(response.body.errors).toBeDefined();
    expect(response.body.data).toBeUndefined();
  });
  it("should return 401", async () => {
    data[0].description = "new description";
    const response = await request(app)
      .put(`/api/v1/items/${id}`)
      .send(data[0]);
    expect(response.status).toBe(401);
    expect(response.body).toBeDefined();
    expect(response.body).toEqual({
      status: "fail",
      message: "Unauthorized, Log in first!",
    });
    expect(response.body.errors).toBeUndefined();
    expect(response.body.data).toBeUndefined();
  });
});

describe("Delete Item - DELETE /api/v1/items/:id", () => {
  it("should return 200", async () => {
    const response = await request(app)
      .delete(`/api/v1/items/${id}`)
      .set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
    expect(response.body).toEqual({
      status: "success",
      message: "Deleted",
    });
  });
  it("should return 404", async () => {
    const response = await request(app)
      .delete("/api/v1/items/0")
      .set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(404);
    expect(response.body).toBeDefined();
    expect(response.body).toEqual({
      status: "fail",
      message: "Data Not Found",
    });
    expect(response.body.data).toBeUndefined();
  });
  it("should return 400", async () => {
    const response = await request(app)
      .delete("/api/v1/items/error")
      .set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(400);
    expect(response.body).toBeDefined();
    expect(response.body).toMatchObject({
      status: "fail",
      message: "Bad request. Please check your input",
    });
    expect(response.body.errors).toBeDefined();
    expect(response.body.data).toBeUndefined();
  });
  it("should return 401", async () => {
    const response = await request(app).delete(`/api/v1/items/${id}`);
    expect(response.status).toBe(401);
    expect(response.body).toBeDefined();
    expect(response.body).toEqual({
      status: "fail",
      message: "Unauthorized, Log in first!",
    });
    expect(response.body.errors).toBeUndefined();
    expect(response.body.data).toBeUndefined();
  });
});
