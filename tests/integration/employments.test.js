const request = require("supertest");
const { User } = require("../../model/User");
const { Employment } = require("../../model/Employment");
const mongoose = require("mongoose");
let token;
let payload;
let server;

describe("/api/employments", () => {
  beforeEach(async () => {
    server = require("../../index");
    token = new User({ role: "admin" }).getJwtToken();
    await Employment.collection.deleteMany({});
    payload = {
      id: 3,
      institute: "test 3",
      years: "2021",
      description: "test test 1",
    };
    await Employment.collection.insertMany([
      { id: 1, institute: "test 1", years: "2021", description: "test test 1" },
      { id: 2, institute: "test 2", years: "2021", description: "test test 2" },
    ]);
  });

  afterEach(async () => {
    await Employment.collection.deleteMany({});
    await server.close();
  });

  describe("Get /", () => {
    it("should return all employments", async () => {
      const res = await request(server).get("/api/employments");
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
    });
  });

  describe("Post /", () => {
    const exec = async (payload) =>
      await request(server)
        .post("/api/employments")
        .set("x-auth-header", token)
        .send(payload);
    it("should return 401: authentication error ", async () => {
      token = "";
      const res = await exec({ institute: "test 3" });
      expect(res.status).toBe(401);
    });

    it("should return 403: not admin", async () => {
      token = new User().getJwtToken();
      const res = await exec({ name: "test 3" });
      expect(res.status).toBe(403);
    });

    it("should return 400: validation error", async () => {
      payload.institute = "";
      const res = await exec(payload);
      expect(res.status).toBe(400);
    });

    it("should return 400: duplication error", async () => {
      payload.id = 1;
      const res = await exec(payload);
      expect(res.status).toBe(400);
    });

    it("should return 400: one institute has same name", async () => {
      payload.institute = "test 1";
      const res = await exec(payload);
      expect(res.status).toBe(400);
    });

    it("should return 200: successfully create the employment", async () => {
      const res = await exec(payload);
      expect(res.status).toBe(200);
      expect(res.body.institute).toMatch(/3/);
    });
  });

  describe("Put /:_id", () => {
    const exec = async (payload, id) =>
      await request(server)
        .put(`/api/employments/${id}`)
        .set("x-auth-header", token)
        .send(payload);

    it("should return 404: employment not found", async () => {
      const response = await exec(
        { description: "test test" },
        mongoose.Types.ObjectId().toHexString()
      );
      expect(response.status).toBe(404);
    });

    it("should return 200: employment updated", async () => {
      const employment = await Employment.findOne();
      const response = await exec(
        { description: "test test updated" },
        employment._id
      );
      expect(response.status).toBe(200);
      expect(response.body.description).toMatch(/updated/);
    });
  });

  describe("Delete /:_id", () => {
    const exec = async (id) =>
      await request(server)
        .delete(`/api/employments/${id}`)
        .set("x-auth-header", token);

    it("should return 404: employment not found", async () => {
      const response = await exec(mongoose.Types.ObjectId().toHexString());
      expect(response.status).toBe(404);
    });

    it("should return 200: employment deleted", async () => {
      const employment = await Employment.findOne();
      const response = await exec(employment._id);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("institute", employment.institute);
    });
  });
});
