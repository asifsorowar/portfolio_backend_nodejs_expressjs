const request = require("supertest");
const { ProjectCategory } = require("../../model/ProjectCategory");
const { User } = require("../../model/User");
const mongoose = require("mongoose");
let server;
let token;
let payload;
describe("/api/categories", () => {
  beforeEach(async () => {
    server = require("../../index");
    token = new User({ role: "admin" }).getJwtToken();
    await ProjectCategory.collection.deleteMany({});
    payload = {
      id: 3,
      name: "test 3",
    };
    await ProjectCategory.collection.insertMany([
      {
        id: 1,
        name: "test 1",
      },
      {
        id: 2,
        name: "test 2",
      },
    ]);
  });

  afterEach(async () => {
    await ProjectCategory.collection.deleteMany({});
    await server.close();
  });

  describe("Get /", () => {
    it("should return all Project categories", async () => {
      const res = await request(server).get("/api/categories");
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
    });
  });

  describe("Post /", () => {
    const exec = async (payload) =>
      await request(server)
        .post("/api/categories")
        .set("x-auth-header", token)
        .send(payload);
    it("should return 401: authentication error ", async () => {
      token = "";
      const res = await exec({ name: "test 3" });
      expect(res.status).toBe(401);
    });

    it("should return 403: not admin", async () => {
      token = new User().getJwtToken();
      const res = await exec({ name: "test 3" });
      expect(res.status).toBe(403);
    });

    it("should return 400: validation error", async () => {
      payload.name = "";
      const res = await exec(payload);
      expect(res.status).toBe(400);
    });

    it("should return 400: duplication error", async () => {
      payload.id = 1;
      const res = await exec(payload);
      expect(res.status).toBe(400);
    });

    it("should return 400: one category has same name", async () => {
      payload.name = "test 1";
      const res = await exec(payload);
      expect(res.status).toBe(400);
    });

    it("should return 200: successfully create the category", async () => {
      const res = await exec(payload);
      expect(res.status).toBe(200);
      expect(res.body.name).toMatch(/3/);
    });
  });

  describe("Put /:_id", () => {
    const exec = async (payload, id) =>
      await request(server)
        .put(`/api/categories/${id}`)
        .set("x-auth-header", token)
        .send(payload);

    it("should return 404: category not found", async () => {
      const response = await exec(
        { name: "test test" },
        mongoose.Types.ObjectId().toHexString()
      );
      expect(response.status).toBe(404);
    });

    it("should return 200: category updated", async () => {
      const category = await ProjectCategory.findOne();
      const response = await exec({ name: "test test updated" }, category._id);
      expect(response.status).toBe(200);
      expect(response.body.name).toMatch(/updated/);
    });
  });

  describe("Delete /:_id", () => {
    const exec = async (id) =>
      await request(server)
        .delete(`/api/categories/${id}`)
        .set("x-auth-header", token);

    it("should return 404: category not found", async () => {
      const response = await exec(mongoose.Types.ObjectId().toHexString());
      expect(response.status).toBe(404);
    });

    it("should return 200: category deleted", async () => {
      const category = await ProjectCategory.findOne();
      const response = await exec(category._id);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("name", category.name);
    });
  });
});
