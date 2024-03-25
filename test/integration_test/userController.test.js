const request = require("supertest");
const app = require("../../main.js");
const model = require("../../models/index.js");
const { flushTable } = require("../testhelper.js");

describe("Integration testing - userController", () => {
	// Reminder: Before testing in user controller, make sure you run the auth controller test first.
	// because to make sure this test running successfully you need make new mock user
	// except

	describe("GET /users", () => {
		it("should return status 200, data and message", async () => {
			await request(app)
				.get("/api/v1/users")
				.set(
					"Authorization",
					"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYiLCJmaXJzdE5hbWUiOiJQcmFuYW5kYSIsImxhc3ROYW1lIjoiWW9nYSIsImVtYWlsIjoicHJhbmFuZGF5b2dhMjFAZ21haWwuY29tIiwicGhvbmVOdW1iZXIiOiIwODEzMzc4MDIzODAiLCJhZGRyZXNzIjoiQmFkdW5nLCBCYWxpIiwiaXNBZG1pbiI6ZmFsc2UsImltYWdlIjpudWxsLCJpYXQiOjE3MTEzNTc4NjEsImV4cCI6MTcxMTM2ODY2MX0.vRYrQFoxcMbCwczGx1cRhvgexPFVF0p6oY7ufNthcyg"
				) // sometimes need to change the token because expirate
				.then((res) => {
					expect(res.status).toBe(200);
					expect(res.body).toHaveProperty("status");
					expect(res.body).toHaveProperty("data");
					expect(res.body).toHaveProperty("message");
				});
		});

		it("should return status 404 and message", async () => {
			// happen when Database empty
			await request(app)
				.get("/api/v1/users")
				.set(
					"Authorization",
					"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYiLCJmaXJzdE5hbWUiOiJQcmFuYW5kYSIsImxhc3ROYW1lIjoiWW9nYSIsImVtYWlsIjoicHJhbmFuZGF5b2dhMjFAZ21haWwuY29tIiwicGhvbmVOdW1iZXIiOiIwODEzMzc4MDIzODAiLCJhZGRyZXNzIjoiQmFkdW5nLCBCYWxpIiwiaXNBZG1pbiI6ZmFsc2UsImltYWdlIjpudWxsLCJpYXQiOjE3MTEzNTc4NjEsImV4cCI6MTcxMTM2ODY2MX0.vRYrQFoxcMbCwczGx1cRhvgexPFVF0p6oY7ufNthcyg"
				) // sometimes need to change the token because expirate
				.then((res) => {
					expect(res.status).toBe(404);
					expect(res.body).toHaveProperty("status");
					expect(res.body).toHaveProperty("message");
				});
		});
	});

	describe("GET /users/{id}", () => {
		it("should return status 200, data and message", async () => {
			const userId = 1;

			await request(app)
				.get("/api/v1/users/" + userId)
				.set(
					"Authorization",
					"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYiLCJmaXJzdE5hbWUiOiJQcmFuYW5kYSIsImxhc3ROYW1lIjoiWW9nYSIsImVtYWlsIjoicHJhbmFuZGF5b2dhMjFAZ21haWwuY29tIiwicGhvbmVOdW1iZXIiOiIwODEzMzc4MDIzODAiLCJhZGRyZXNzIjoiQmFkdW5nLCBCYWxpIiwiaXNBZG1pbiI6ZmFsc2UsImltYWdlIjpudWxsLCJpYXQiOjE3MTEzNjE1NTksImV4cCI6MTcxMTM3MjM1OX0.2AvMcotMqb7nrt1vhw87krAHxm0XDJ_xqwO3G3ivVGM"
				) // sometimes need to change the token because expirate
				.query("id")
				.then((res) => {
					expect(res.status).toBe(200);
					expect(res.body).toHaveProperty("status");
					expect(res.body).toHaveProperty("data");
					expect(res.body).toHaveProperty("message");
				});
		});

		it("should return status 404 and message", async () => {
			const userId = 0;

			await request(app)
				.get("/api/v1/users/" + userId)
				.set(
					"Authorization",
					"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYiLCJmaXJzdE5hbWUiOiJQcmFuYW5kYSIsImxhc3ROYW1lIjoiWW9nYSIsImVtYWlsIjoicHJhbmFuZGF5b2dhMjFAZ21haWwuY29tIiwicGhvbmVOdW1iZXIiOiIwODEzMzc4MDIzODAiLCJhZGRyZXNzIjoiQmFkdW5nLCBCYWxpIiwiaXNBZG1pbiI6ZmFsc2UsImltYWdlIjpudWxsLCJpYXQiOjE3MTEzNjE1NTksImV4cCI6MTcxMTM3MjM1OX0.2AvMcotMqb7nrt1vhw87krAHxm0XDJ_xqwO3G3ivVGM"
				) // sometimes need to change the token because expirate
				// .query("id")
				.then((res) => {
					expect(res.status).toBe(404);
					expect(res.body).toHaveProperty("status");
					expect(res.body.status).toEqual("fail");
					expect(res.body).toHaveProperty("message");
					expect(res.body.message).toEqual(
						`data User by id (${userId}) is not found`
					);
				});
		});
	});
	describe("PUT /users/{id}", () => {
		it("should return status 200, data and message", async () => {
			const userId = 1;
			const userData = {
				firstName: "Albob",
				lastName: "Kumar",
			};

			await request(app)
				.get("/api/v1/users/" + userId)
				.set(
					"Authorization",
					"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYiLCJmaXJzdE5hbWUiOiJQcmFuYW5kYSIsImxhc3ROYW1lIjoiWW9nYSIsImVtYWlsIjoicHJhbmFuZGF5b2dhMjFAZ21haWwuY29tIiwicGhvbmVOdW1iZXIiOiIwODEzMzc4MDIzODAiLCJhZGRyZXNzIjoiQmFkdW5nLCBCYWxpIiwiaXNBZG1pbiI6ZmFsc2UsImltYWdlIjpudWxsLCJpYXQiOjE3MTEzNjE1NTksImV4cCI6MTcxMTM3MjM1OX0.2AvMcotMqb7nrt1vhw87krAHxm0XDJ_xqwO3G3ivVGM"
				) // sometimes need to change the token because expirate
				.query("id")
				.send(userData)
				.then((res) => {
					expect(res.status).toBe(200);
					expect(res.body).toHaveProperty("status");
					expect(res.body).toHaveProperty("data");
					expect(res.body).toHaveProperty("message");
				});
		});

		it("should return status 404 and message", async () => {
			const userId = 0;
			const userData = {
				firstName: "Albob",
				lastName: "Kumar",
			};

			await request(app)
				.get("/api/v1/users/" + userId)
				.set(
					"Authorization",
					"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYiLCJmaXJzdE5hbWUiOiJQcmFuYW5kYSIsImxhc3ROYW1lIjoiWW9nYSIsImVtYWlsIjoicHJhbmFuZGF5b2dhMjFAZ21haWwuY29tIiwicGhvbmVOdW1iZXIiOiIwODEzMzc4MDIzODAiLCJhZGRyZXNzIjoiQmFkdW5nLCBCYWxpIiwiaXNBZG1pbiI6ZmFsc2UsImltYWdlIjpudWxsLCJpYXQiOjE3MTEzNjE1NTksImV4cCI6MTcxMTM3MjM1OX0.2AvMcotMqb7nrt1vhw87krAHxm0XDJ_xqwO3G3ivVGM"
				) // sometimes need to change the token because expirate
				.query("id")
				.send(userData)
				.then((res) => {
					expect(res.status).toBe(404);
					expect(res.body).toHaveProperty("status");
					expect(res.body.status).toEqual("fail");
					expect(res.body).toHaveProperty("message");
					expect(res.body.message).toEqual(
						`data User by id (${userId}) is not found`
					);
				});
		});
	});

	describe("DELETE /users/{id}", () => {
		it("should return status 200, data and message", async () => {
			const userId = 1;

			await request(app)
				.get("/api/v1/users/" + userId)
				.set(
					"Authorization",
					"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYiLCJmaXJzdE5hbWUiOiJQcmFuYW5kYSIsImxhc3ROYW1lIjoiWW9nYSIsImVtYWlsIjoicHJhbmFuZGF5b2dhMjFAZ21haWwuY29tIiwicGhvbmVOdW1iZXIiOiIwODEzMzc4MDIzODAiLCJhZGRyZXNzIjoiQmFkdW5nLCBCYWxpIiwiaXNBZG1pbiI6ZmFsc2UsImltYWdlIjpudWxsLCJpYXQiOjE3MTEzNjE1NTksImV4cCI6MTcxMTM3MjM1OX0.2AvMcotMqb7nrt1vhw87krAHxm0XDJ_xqwO3G3ivVGM"
				) // sometimes need to change the token because expirate
				.query("id")
				.then((res) => {
					expect(res.status).toBe(200);
					expect(res.body).toHaveProperty("status");
					expect(res.body.status).toEqual("success");
					expect(res.body).toHaveProperty("data");
					expect(res.body).toHaveProperty("message");
					expect(res.body.message).toEqual(
						`delete user by id (${userId}) successfully`
					);
				});
		});

		it("should return status 404 and message", async () => {
			const userId = 0;

			await request(app)
				.get("/api/v1/users/" + userId)
				.set(
					"Authorization",
					"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYiLCJmaXJzdE5hbWUiOiJQcmFuYW5kYSIsImxhc3ROYW1lIjoiWW9nYSIsImVtYWlsIjoicHJhbmFuZGF5b2dhMjFAZ21haWwuY29tIiwicGhvbmVOdW1iZXIiOiIwODEzMzc4MDIzODAiLCJhZGRyZXNzIjoiQmFkdW5nLCBCYWxpIiwiaXNBZG1pbiI6ZmFsc2UsImltYWdlIjpudWxsLCJpYXQiOjE3MTEzNjE1NTksImV4cCI6MTcxMTM3MjM1OX0.2AvMcotMqb7nrt1vhw87krAHxm0XDJ_xqwO3G3ivVGM"
				) // sometimes need to change the token because expirate
				.query("id")
				.send(userData)
				.then((res) => {
					expect(res.status).toBe(404);
					expect(res.body).toHaveProperty("status");
					expect(res.body.status).toEqual("fail");
					expect(res.body).toHaveProperty("message");
					expect(res.body.message).toEqual(
						`data user by id (${userId}) is not found`
					);
				});
		});
	});
});
