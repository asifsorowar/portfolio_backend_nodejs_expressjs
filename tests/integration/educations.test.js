const request = require("supertest");
const { Education } = require("../../model/Education");
const { User } = require("../../model/User");
const mongoose = require("mongoose");
let token;
let payload;
let server;

describe("/api/educations", () => {
  beforeEach(async () => {
    server = require("../../index");
    token = new User({ role: "admin" }).getJwtToken();
    await Education.collection.deleteMany({});
    payload = {
      id: 3,
      institute: "test 3",
      years: "2021",
      description: "test test 1",
    };
    await Education.collection.insertMany([
      { id: 1, institute: "test 1", years: "2021", description: "test test 1" },
      { id: 2, institute: "test 2", years: "2021", description: "test test 2" },
    ]);
  });

  afterEach(async () => {
    await Education.collection.deleteMany({});
    await server.close();
  });

  describe("Get /", () => {
    it("should return all educations", async () => {
      const res = await request(server).get("/api/educations");
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
    });
  });

  describe("Post /", () => {
    const exec = async (payload) =>
      await request(server)
        .post("/api/educations")
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

    it("should return 200: successfully create the education", async () => {
      const res = await exec(payload);
      expect(res.status).toBe(200);
      expect(res.body.institute).toMatch(/3/);
    });
  });

  describe("Put /:_id", () => {
    const exec = async (payload, id) =>
      await request(server)
        .put(`/api/educations/${id}`)
        .set("x-auth-header", token)
        .send(payload);

    it("should return 404: education not found", async () => {
      const response = await exec(
        { email: "test@email.com" },
        mongoose.Types.ObjectId().toHexString()
      );
      expect(response.status).toBe(404);
    });

    it("should return 200: education updated", async () => {
      const education = await Education.findOne();
      const response = await exec(
        { description: "test test updated" },
        education._id
      );
      expect(response.status).toBe(200);
      expect(response.body.description).toMatch(/updated/);
    });
  });

  describe("Delete /:_id", () => {
    const exec = async (id) =>
      await request(server)
        .delete(`/api/educations/${id}`)
        .set("x-auth-header", token);

    it("should return 404: education not found", async () => {
      const response = await exec(mongoose.Types.ObjectId().toHexString());
      expect(response.status).toBe(404);
    });

    it("should return 200: education deleted", async () => {
      const education = await Education.findOne();
      const response = await exec(education._id);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("institute", education.institute);
    });
  });
});
