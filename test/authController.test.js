const { AuthUser } = require("../controller/authController");

const mockRequest = (body = {}, params = {}, query = {}) => {
  return {
    body: body,
    params: params,
    query: query,
  };
};

const mockResponse = () => {
  const res = {};
  res.json = jest.fn().mockReturnValue(res);
  res.status = jest.fn().mockReturnValue(res);

  return res;
};

describe("authController.js register function", () => {
  test(`res.json called with {
        status: 'success', 
        data: {
            id: id, 
            firstName: firstName, 
            lastName: lastName, 
            email: email, 
            phoneNumber: phoneNumber,
            address: address,
            image: image,
            isAdmin: isAdmin
        }
        message: 'Success: New User has been created.'
    }`, (done) => {
    const req = mockRequest();
    const res = mockResponse();

    AuthUser.register();

    expect(res.status).toBeCalledWith(200);
    expect(res.json).toBeCalledWith({
      status: "success",
      data: {
        id: "1",
        firstName: "Prananda",
        lastName: "Yoga",
        email: "pranandayoga@gmail.com",
        phoneNumber: "081337802380",
        address: "Badung, Bali",
        image: null,
        isAdmin: false,
      },
      message: "Success: New User has been created.",
    });
  });
});
