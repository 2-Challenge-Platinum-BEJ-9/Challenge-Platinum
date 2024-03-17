const request = require("supertest");
const app = require("../../main.js");
const model = require("../../models/index.js");
const { flushTable } = require("../testhelper.js");

describe("Integration testing - authController", () => {
  beforeAll(async () => {
    await flushTable();
  });

  describe("Integration Testing - POST /register", () => {
    it("Return status 201 and JSON format that contain data and message 'Success: New User has been created.'", async () => {
      await request(app)
        .post("/api/v1/auth/register")
        .send({
          firstName: "Prananda",
          lastName: "Yoga",
          email: "pranandayoga3@gmail.com",
          phoneNumber: "081337802387",
          address: "Badung, Bali",
          password: "prananda23",
          passwordMatch: "prananda23",
          image: null,
          isAdmin: false,
        })
        .then((res) => {
          expect(res.status).toBe(201);
          expect(res.body).toHaveProperty("data");
          expect(res.body).toHaveProperty("message");
          expect(res.body.message).toEqual(
            "Success: New User has been created."
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
          expect(res.body).toHaveProperty("data");
          expect(res.body).toHaveProperty("message");
          expect(res.body.message).toEqual(`Welcome, Prananda Yoga`);
        });
    });
  });

  describe("Integration Testing - POST /logout", () => {
    it("Return status 200 and JSON format that contain message 'Logout Success'", async () => {
      await request(app)
        .post("/api/v1/auth/logout")
        .auth(
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJmaXJzdE5hbWUiOiJQcmFuYW5kYSIsImxhc3ROYW1lIjoiWW9nYSIsImVtYWlsIjoicHJhbmFuZGF5b2dhMUBnbWFpbC5jb20iLCJwaG9uZU51bWJlciI6IjA4MTMzNzgwMjM4MSIsImFkZHJlc3MiOiJCYWR1bmcsIEJhbGkiLCJpc0FkbWluIjpmYWxzZSwiaW1hZ2UiOm51bGwsImlhdCI6MTcxMDY3Mjg4NiwiZXhwIjoxNzEwNjgzNjg2fQ.yw1PIVMa0YXRxpAmeCdLgGJikggcCf8JTqICUdpYojw",
          { type: "bearer" }
        )
        .send({ email: "pranandayoga1@gmail.com" })
        .then((res) => {
          expect(res.status).toBe(200);
          expect(res.body).toHaveProperty("message");
          expect(res.body.message).toEqual("Logout Success");
        });
    });
  });
});
