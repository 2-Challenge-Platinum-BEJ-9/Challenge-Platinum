jest.mock("../../models", () => {
  return {
    User: {
      findOne: jest.fn(),
      create: jest.fn(),
    },
  };
});

const { ValidationError, ValidationErrorItem } = require("sequelize");
const { AuthUser } = require("../../controller/authController.js");
const { User } = require("../../models/index.js");

const mockReq = (body = {}, params = {}, query = {}) => {
  return {
    body: body,
    params: params,
    query: query,
  };
};

const mockRes = () => {
  const res = {};

  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);

  return res;
};

const mockUserDb = {
  id: 1,
  firstName: "Prananda",
  lastName: "Yoga",
  email: "pranandayoga1@gmail.com",
  phoneNumber: "081337802381",
  address: "Badung, Bali",
  password: "prananda23",
  passwordMatch: "prananda23",
  image: null,
  isAdmin: false,
};

const mockUserDifPass = {
  firstName: "Prananda",
  lastName: "Yoga",
  email: "pranandayoga1@gmail.com",
  phoneNumber: "081337802381",
  address: "Badung, Bali",
  password: "prananda23",
  passwordMatch: "prananda21",
  image: null,
  isAdmin: false,
};

const mockUserNull = {
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  address: "",
  password: "",
  passwordMatch: "",
  image: "",
  isAdmin: "",
};

const mockValidationError = [
  new ValidationErrorItem(
    "first name is empty",
    `validation error`,
    "firstName"
  ),
  new ValidationErrorItem("email is empty", `validation error`, "email"),
  new ValidationErrorItem(
    "Incorrect email format",
    `validation error`,
    "email"
  ),
  new ValidationErrorItem(
    "Phone Number is empty",
    `validation error`,
    "phoneNumber"
  ),
  new ValidationErrorItem("address is empty", `validation error`, "address"),
  new ValidationErrorItem("Password is empty", `validation error`, "password"),
  new ValidationErrorItem(
    "Password must be at least 6-20 characters",
    `validation error`,
    "password"
  ),
  new ValidationErrorItem("image is empty", `validation error`, "image"),
];

const expectedValidationError = [
  {
    path: "firstName",
    message: "first name is empty",
  },
  {
    path: "email",
    message: "email is empty",
  },
  {
    path: "email",
    message: "Incorrect email format",
  },
  {
    path: "phoneNumber",
    message: "Phone Number is empty",
  },
  {
    path: "address",
    message: "address is empty",
  },
  {
    path: "password",
    message: "Password is empty",
  },
  {
    path: "password",
    message: "Password must be at least 6-20 characters",
  },
  {
    path: "image",
    message: "image is empty",
  },
];

describe("Auth Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Unit Testing - register()", () => {
    it("Must return status 500 Internal Server Error", async () => {
      const req = mockReq(mockUserDb);
      const res = mockRes();

      User.findOne.mockReturnValue(null);
      User.create.mockReturnValue(null);

      await AuthUser.register(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Cannot read properties of null (reading 'id')",
        status: "error",
      });
    });

    it("Must return status 400 Bad Request - user already exist", async () => {
      const req = mockReq(mockUserDb);
      const res = mockRes();

      User.findOne.mockReturnValue(req);
      User.create.mockReturnValue(req);
      await AuthUser.register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        status: "fail",
        errors: "User already exist",
        message: "Bad request. Please check your input",
      });
    });

    it("Must return 400 Bad Request - password & passwordMatch not match", async () => {
      const req = mockReq(mockUserDifPass);
      const res = mockRes();

      User.findOne.mockReturnValue(req);
      User.create.mockReturnValue(req);
      await AuthUser.register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        status: "fail",
        errors: "Password not match!",
        message: "Bad request. Please check your input",
      });
    });

    it("Must return 400 Bad Request - Validation Error", async () => {
      const req = mockReq(mockUserNull);
      const res = mockRes();

      User.findOne.mockReturnValue(null);
      User.create.mockReturnValue(
        Promise.reject(
          new ValidationError("Validation error occured", mockValidationError)
        )
      );

      await AuthUser.register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        status: "fail",
        errors: expectedValidationError,
        message: "Validation error occured",
      });
    });

    it("Must return status 201 Created", async () => {
      const req = mockReq(mockUserDb);
      const res = mockRes();

      User.findOne.mockReturnValue(null);
      User.create.mockReturnValue(req.body);
      await AuthUser.register(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        data: {
          id: 1,
          firstName: "Prananda",
          lastName: "Yoga",
          email: "pranandayoga1@gmail.com",
          phoneNumber: "081337802381",
          address: "Badung, Bali",
          image: null,
          isAdmin: false,
        },
        message: "Success: New User has been created.",
        status: "success",
      });
    });
  });
});
