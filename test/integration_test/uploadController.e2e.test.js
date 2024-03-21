const request = require("supertest");
const app = require("../../main.js");
const fs = require("fs");
const path = require("path");

const filePath = "./test/assets_test/pic_1.png";

const mockReq = {
  body: {},
  file: {
    avatar: {
      filename: "pic_1.png",
      mimetype: ["image/png", "image/jpg"],
      size: 1024 * 1024 * 5,
      path: "./test/assets_test/pic4.png",
    },
  },
  // file: {
  //   avatar: {

  //   }
  //   // ...
  // },
};

function getMockFileData(filePath) {
  return fs.promises
    .readFile(filePath)
    .then((buffer) => Buffer.from(buffer).toString("base64"));
}

describe("Integration testing - uploadController", () => {
  // describe("POST /avatar", () => {
  it("should return status 201, data and message", async () => {
    const filePath = path.join(__dirname, "../../test/assets_test/pic4.png");
    const mockFileData = fs.readFileSync(filePath);

    // const formData = new FormData();
    // formData.append("avatar", mockFileData, "pic_1.png");
    // const req = mockReq

    // try {
    // const mockFileData = await getMockFileData(filePath);
    // const bufferData = Buffer.from(mockReq.toString(), "base64");

    const res = await request(app).post("/api/v1/upload/avatar");
    // .set("Content-Type", "multipart/form-data")
    // .set("Accept", "*/*")
    // .send(formData);
    // .send(mockReq);
    // .req(mockReq);
    // .attach("avatar", mockFileData);
    // .then((res) => {
    expect(res.status).toBe(201);
    // expect(res.body).toHaveProperty("status");
    // expect(res.body.status).toBe("success");
    // expect(res.body).toHaveProperty("data");
    // expect(res.body).toHaveProperty("message");
    // } catch (error) {
    //   console.log(error);
    // }
  }, 30000);

  // it("should return status 400, errors and message", async () => {
  //   const filePath = path.join("./test/assets_test/pic_1.png");
  //   const mockFileData = await fs.readFile(filePath);

  //   const bufferData = Buffer.from(mockFileData, "base64");
  //   const res = await request(app)
  //     .post("/api/v1/upload/avatar")
  //     .set("Content-Type", "multipart/form-data")
  //     .set("Accept", "*/*")
  //     .attach("avatar", bufferData);

  //   expect(res.status).toBe(400);
  //   expect(res.body).toHaveProperty("status");
  //   expect(res.body.status).toBe("fail");
  //   expect(res.body).toHaveProperty("errors");
  //   expect(res.body).toHaveProperty("message");
  // }, 15000);
});
// });
