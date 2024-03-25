const { Item } = require("../../models");
const {
  getAllItem,
  getDetailItem,
  createItem,
  updateItem,
  deleteItem,
} = require("../../controller/itemController");

jest.mock("../../models", () => {
  return {
    Item: {
      findAll: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      destroy: jest.fn(),
    },
  };
});

const req = {
  query: {},
  params: {},
  body: {},
};

const res = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn().mockReturnThis(),
};

describe("Test func getAllItem", () => {
  it("should return all items", async () => {
    const listItems = [
      {
        id: "1",
        name: "item 2",
        price: 10000,
        stock: 10,
        category: "langka",
        description: "ini deskripsi",
        image: "https://example.com/image.png",
      },
    ];
    Item.findAll.mockReturnValue(Promise.resolve(listItems));

    await getAllItem(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: "success",
      data: listItems,
      message: "Success",
    });
  });
  it("should return error: data not found", async () => {
    Item.findAll.mockReturnValue(Promise.resolve([]));
    await getAllItem(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      status: "fail",
      message: "Data Not Found",
    });
  });
  it("should return error: bad request", async () => {
    Item.findAll.mockReturnValue(
      Promise.reject(new Error('column "nan" does not exist'))
    );
    await getAllItem(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      status: "fail",
      errors: 'column "nan" does not exist',
      message: "Bad request. Please check your input",
    });
  });
});

describe("Test func getDetailItem", () => {
  it("should return the detail of an item", async () => {
    const item = {
      id: "1",
      name: "item 2",
      price: 10000,
      stock: 10,
      category: "langka",
      description: "ini deskripsi",
      image: "https://example.com/image.png",
    };
    Item.findOne.mockReturnValue(Promise.resolve(item));

    await getDetailItem(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: "success",
      data: item,
      message: "Success",
    });
  });
  it("should return error: data not found", async () => {
    Item.findOne.mockReturnValue(Promise.resolve(null));
    await getDetailItem(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      status: "fail",
      message: "Data Not Found",
    });
  });
  it("should return error: bad request", async () => {
    Item.findOne.mockReturnValue(
      Promise.reject(new Error('invalid input syntax for type bigint: "test"'))
    );
    await getDetailItem(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      status: "fail",
      errors: 'invalid input syntax for type bigint: "test"',
      message: "Bad request. Please check your input",
    });
  });
});

describe("Test func createItem", () => {
  it("should create a new item", async () => {
    const item = {
      id: "39",
      name: "item 2",
      price: 10000,
      stock: 10,
      category: "langka",
      description: "ini deskripsi",
      image: "https://example.com/image.png",
      updatedAt: "2024-03-17T10:28:03.864Z",
      createdAt: "2024-03-17T10:28:03.864Z",
    };

    Item.create.mockReturnValue(Promise.resolve(item));

    await createItem(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      status: "success",
      data: item,
      message: "Created",
    });
  });
  it("should return error: item already exists", async () => {
    Item.create.mockReturnValue(
      Promise.reject(new Error("Item already exists"))
    );
    await createItem(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      status: "fail",
      errors: "Item already exists",
      message: "Bad request. Please check your input",
    });
  });
});

describe("Test func updateItem", () => {
  it("should update an existing item", async () => {
    const item = {
      id: "1",
      name: "item 1",
      price: 10000,
      stock: 10,
      category: "langka2",
      description: "ini deskripsi",
      image: "https://example.com/image.png",
    };

    Item.update.mockReturnValue(Promise.resolve([1, [item]]));

    await updateItem(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: "success",
      data: item,
      message: "Updated",
    });
  });
  it("should return error: data not found", async () => {
    Item.update.mockReturnValue(Promise.resolve([0, undefined]));
    await updateItem(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      status: "fail",
      message: "Data Not Found",
    });
  });
  it("should return error: bad request", async () => {
    Item.update.mockReturnValue(
      Promise.reject(new Error("Name cannot be empty."))
    );
    await updateItem(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      status: "fail",
      errors: "Name cannot be empty.",
      message: "Bad request. Please check your input",
    });
  });
});

describe("Test func deleteItem", () => {
  it("should delete an item", async () => {
    Item.destroy.mockReturnValue(Promise.resolve(1));

    await deleteItem(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: "success",
      message: "Deleted",
    });
  });
  it("should return error: data not found", async () => {
    Item.destroy.mockReturnValue(Promise.resolve(0));
    await deleteItem(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      status: "fail",
      message: "Data Not Found",
    });
  });
  it("should return error: bad request", async () => {
    Item.destroy.mockReturnValue(
      Promise.reject(new Error(`invalid input syntax for type bigint: "as"`))
    );
    await deleteItem(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      status: "fail",
      errors: 'invalid input syntax for type bigint: "as"',
      message: "Bad request. Please check your input",
    });
  });
});
