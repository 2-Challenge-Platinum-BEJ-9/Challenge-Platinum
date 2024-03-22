const request = require("supertest");
const app = require("../../main");
const { flushTable } = require("../testhelper.js");

let id, token;
const data = {
  name: "test",
  price: 10000,
  stock: 10,
  category: "test",
  description: "test",
  image: "https://example.com/image.png",
};

beforeAll(async () => {
  // Run the login request to obtain the token
  const loginResponse = await request(app).post(`/api/v1/auth/login/`).send({
    email: "pranandayoga3@gmail.com",
    password: "prananda23",
  });
  token = loginResponse.body.data; // Store the token for later use
  console.log(loginResponse.body);
});

afterAll(async () => {
  await flushTable();
});

describe("POST /api/v1/items", () => {
  it("should return 201", async () => {
    console.log(token);
    const response = await request(app)
      .post("/api/v1/items/")
      .set("Authorization", `Bearer ${token}`)
      .send(data);
    console.log(response.body);
    id = response.body?.data?.id;
    expect(response.status).toBe(201);
    expect(response.body).toBeDefined();
    expect(response.body).toMatchObject({
      status: "success",
      data: { id, ...data },
      message: "Created",
    });
  });
  it("should return 400", async () => {
    const response = await request(app)
      .post("/api/v1/items/")
      .set("Authorization", `Bearer ${token}`)
      .send(data);
    expect(response.status).toBe(400);
    expect(response.body).toBeDefined();
    expect(response.body).toEqual({
      status: "fail",
      errors: "Item already exists",
      message: "Bad request. Please check your input",
    });
  });
  it("should return 401", async () => {
    const response = await request(app).post("/api/v1/items/").send(data);
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
describe("GET /api/v1/items", () => {
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

describe("GET /api/v1/items/:id", () => {
  it("should return 200", async () => {
    const response = await request(app).get(`/api/v1/items/${id}`);
    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
    expect(response.body).toEqual({
      status: "success",
      data: { id, ...data },
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

describe("PUT /api/v1/items/:id", () => {
  it("should return 200", async () => {
    data.description = "new description";
    const response = await request(app)
      .put(`/api/v1/items/${id}`)
      .set("Authorization", `Bearer ${token}`)
      .send(data);
    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
    expect(response.body).toEqual({
      status: "success",
      data: { id, ...data },
      message: "Updated",
    });
  });
  it("should return 404", async () => {
    data.description = "new description";
    const response = await request(app)
      .put(`/api/v1/items/0`)
      .set("Authorization", `Bearer ${token}`)
      .send(data);
    expect(response.status).toBe(404);
    expect(response.body).toBeDefined();
    expect(response.body).toEqual({
      status: "fail",
      message: "Data Not Found",
    });
    expect(response.body.data).toBeUndefined();
  });
  it("should return 400", async () => {
    data.description = "new description";
    const response = await request(app)
      .put(`/api/v1/items/error`)
      .set("Authorization", `Bearer ${token}`)
      .send(data);
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
    data.description = "new description";
    const response = await request(app).put(`/api/v1/items/${id}`).send(data);
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

describe("DELETE /api/v1/items/:id", () => {
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
