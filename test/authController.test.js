const supertest = require("supertest");
const app = require("../main.js");
const { AuthUser } = require("../controller/authController.js");
jest.mock("../controller/authController.js");
AuthUser.save = jest.fn().mockResolvedValue({});

const mockReq = (body = {}, params = {}, query = {}) => {
  return {
    body: body,
    params: params,
    query: query,
  };
};

const mockRes = () => {
  const res = {};

  res.json = jest.fn().mockReturnValue(res);
  res.status = jest.fn().mockReturnValue(res);

  return res;
};

describe("Test Register", () => {
  test("Must return status 201 and json", (done) => {
    const req = mockReq({
      firstName: "Prananda",
      lastName: "Yoga",
      email: "pranandayoga1@gmail.com",
      phoneNumber: "081337802381",
      address: "Badung, Bali",
      password: "prananda23",
      passwordMatch: "prananda23",
    });
    const res = mockRes();

    AuthUser.register(req, res);

    expect(res.status).toBeCalledWith(201);
    expect(res.json).toBeCalledWith({
      status: "success",
      data: {
        id: expect.any(String),
        firstName: "Prananda",
        lastName: "Yoga",
        email: "pranandayoga1@gmail.com",
        phoneNumber: "081337802381",
        address: "Badung, Bali",
        image: null,
        isAdmin: false,
      },
      message: "Success: New User has been created.",
    });
    done();
  });
});
