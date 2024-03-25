const request = require("supertest");
const app = require("../../main.js");
const { flushTable } = require("../testhelper.js");

const user = {
	firstName: "Prananda",
	lastName: "Yoga",
	email: "pranandayoga3@gmail.com",
	phoneNumber: "081337802387",
	address: "Badung, Bali",
	password: "prananda23",
	passwordMatch: "prananda23",
	image: null,
	isAdmin: false,
};

const userPassNotMatch = {
	firstName: "Prananda",
	lastName: "Yoga",
	email: "pranandayoga3@gmail.com",
	phoneNumber: "081337802387",
	address: "Badung, Bali",
	password: "prananda23",
	passwordMatch: "prananda21",
	image: null,
	isAdmin: false,
};

const userEmpty = {
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

describe("Integration testing - authController", () => {
	beforeAll(async () => {
		await flushTable();
	});

	describe("Integration Testing - POST /register", () => {
		it("Return status 201 and JSON format that contain data and message 'Success: New User has been created.'", async () => {
			await request(app)
				.post("/api/v1/auth/register")
				.send(user)
				.then((res) => {
					expect(res.status).toBe(201);
					expect(res.body).toHaveProperty("data");
					expect(res.body).toHaveProperty("message");
					expect(res.body.message).toEqual(
						"Success: New User has been created."
					);
				});
		});

		it("Return status 400 and JSON format that contain errors: `Password not match!` and message: `Bad request. Please check your input`", async () => {
			await request(app)
				.post("/api/v1/auth/register")
				.send(userPassNotMatch)
				.then((res) => {
					expect(res.status).toBe(400);
					expect(res.body).toHaveProperty("errors");
					expect(res.body).toHaveProperty("message");
					expect(res.body.errors).toEqual("Password not match!");
					expect(res.body.message).toEqual(
						"Bad request. Please check your input"
					);
				});
		});

		it("Return status 400 and JSON format that contain errors: `User already exist` and message: `Bad request. Please check your input`", async () => {
			await request(app)
				.post("/api/v1/auth/register")
				.send(user)
				.then((res) => {
					expect(res.status).toBe(400);
					expect(res.body).toHaveProperty("errors");
					expect(res.body).toHaveProperty("message");
					expect(res.body.errors).toEqual("User already exist");
					expect(res.body.message).toEqual(
						"Bad request. Please check your input"
					);
				});
		});

		it("Return status 400 and JSON format that contain errors: `User already exist` and message: `Validation error occured`", async () => {
			await request(app)
				.post("/api/v1/auth/register")
				.send(userEmpty)
				.then((res) => {
					expect(res.status).toBe(400);
					expect(res.body).toHaveProperty("errors");
					expect(res.body).toHaveProperty("message");
					expect(res.body.errors).toEqual(expectedValidationError);
					expect(res.body.message).toEqual("Validation error occured");
				});
		});

		it("Return status 500 and JSON format that contain message: WHERE parameter `email` has invalid `undefined` value", async () => {
			await request(app)
				.post("/api/v1/auth/register")
				.send(null)
				.then((res) => {
					expect(res.status).toBe(500);
					expect(res.body).toHaveProperty("message");
					expect(res.body.message).toContain(
						'WHERE parameter "email" has invalid "undefined" value'
					);
				});
		});
	});

	describe("Integration Testing - POST /login", () => {
		it("Return status 200 and JSON format that contain token and message `Welcome, ${user.firstName} ${user.lastName}`", async () => {
			await request(app)
				.post("/api/v1/auth/login")
				.send({ email: "pranandayoga3@gmail.com", password: "prananda23" })
				.then((res) => {
					expect(res.status).toBe(200);
					expect(res.body).toHaveProperty("status");
					expect(res.body).toHaveProperty("data");
					expect(res.body).toHaveProperty("message");
					expect(res.body.message).toEqual(`Welcome, Prananda Yoga`);
					expect(res.body.status).toEqual("success");
				});
		});

		it("Return status 400 and JSON format that contain errors `User not found!` and message `Bad request. Please check your input`", async () => {
			await request(app)
				.post("/api/v1/auth/login")
				.send({ email: "pranandayoga2@gmail.com", password: "prananda21" })
				.then((res) => {
					expect(res.status).toBe(400);
					expect(res.body).toHaveProperty("status");
					expect(res.body).toHaveProperty("errors");
					expect(res.body).toHaveProperty("message");
					expect(res.body.status).toEqual("fail");
					expect(res.body.errors).toEqual("User not found!");
					expect(res.body.message).toEqual(
						`Bad request. Please check your input`
					);
				});
		});

		it("Return status 400 and JSON format that contain errors `Wrong password!` and message `Bad request. Please check your input`", async () => {
			await request(app)
				.post("/api/v1/auth/login")
				.send({ email: "pranandayoga3@gmail.com", password: "prananda21" })
				.then((res) => {
					expect(res.status).toBe(400);
					expect(res.body).toHaveProperty("status");
					expect(res.body).toHaveProperty("errors");
					expect(res.body).toHaveProperty("message");
					expect(res.body.status).toEqual("fail");
					expect(res.body.errors).toEqual("Wrong password!");
					expect(res.body.message).toEqual(
						`Bad request. Please check your input`
					);
				});
		});

		it("Return status 500 and JSON format that contain message `Bad request. Please check your input`", async () => {
			await request(app)
				.post("/api/v1/auth/login")
				.send({})
				.then((res) => {
					expect(res.status).toBe(500);
					expect(res.body).toHaveProperty("message");
					expect(res.body.message).toEqual(
						'WHERE parameter "email" has invalid "undefined" value'
					);
				});
		});
	});

	describe("Integration Testing - POST /logout", () => {
		it("Return status 200 and JSON format that contain message 'Logout Success'", async () => {
			await request(app)
				.post("/api/v1/auth/logout")
				.set(
					"Authorization",
					"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZmlyc3ROYW1lIjoiUHJhbmFuZGEiLCJsYXN0TmFtZSI6IllvZ2EiLCJlbWFpbCI6InByYW5hbmRheW9nYTNAZ21haWwuY29tIiwicGhvbmVOdW1iZXIiOiIwODEzMzc4MDIzODciLCJhZGRyZXNzIjoiQmFkdW5nLCBCYWxpIiwiaXNBZG1pbiI6ZmFsc2UsImltYWdlIjpudWxsLCJpYXQiOjE3MTA2OTEyMDgsImV4cCI6MTcxMDcwMjAwOH0.EGjbljLxh1Gb0VHDCn6jkshGl0fwV4UmLFOgJD7bls8"
				)

				.then((res) => {
					expect(res.status).toBe(200);
					expect(res.body).toHaveProperty("message");
					expect(res.body.message).toEqual("Logout Success");
				});
		});

		it("Return status 401 and JSON format that contain message 'Unauthorized, Log in first!'", async () => {
			await request(app)
				.post("/api/v1/auth/logout")
				.set("Authorization", null)
				.then((res) => {
					expect(res.status).toBe(401);
					expect(res.body).toHaveProperty("message");
					expect(res.body.message).toEqual("Unauthorized, Log in first!");
				});
		});
	});
});
