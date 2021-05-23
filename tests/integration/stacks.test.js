const request = require("supertest");
const { Stack } = require("../../model/Stack");
const { User } = require("../../model/User");
const mongoose = require("mongoose");
let token;
let payload;
let server;

describe("/api/stacks", () => {
  beforeEach(async () => {
    server = require("../../index");
    token = new User({ role: "admin" }).getJwtToken();
    payload = {
      name: "test 3",
    };
    await Stack.collection.insertMany([{ name: "test 1" }, { name: "test 2" }]);
  });

  afterEach(async () => {
    await Stack.collection.deleteMany({});
    await server.close();
  });

  describe("Get /", () => {
    const exec = async () =>
      await request(server).get("/api/stacks").set("x-auth-header", token);

    it("should return 401: user not authenticated", async () => {
      token = "";
      const res = await exec();
      expect(res.status).toBe(401);
    });

    it("should return 403: user not admin", async () => {
      token = new User().getJwtToken();
      const res = await exec();
      expect(res.status).toBe(403);
    });
    it("should return all stacks", async () => {
      const res = await exec();
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
    });
  });

  describe("Post /", () => {
    const exec = async (payload) =>
      await request(server)
        .post("/api/stacks")
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

    it("should return 400: one stack has same name", async () => {
      payload.name = "test 1";
      const res = await exec(payload);
      expect(res.status).toBe(400);
    });

    it("should return 200: successfully create the stack", async () => {
      const res = await exec(payload);
      expect(res.status).toBe(200);
      expect(res.body.name).toMatch(/3/);
    });
  });

  describe("Put /:_id", () => {
    const exec = async (payload, id) =>
      await request(server)
        .put(`/api/stacks/${id}`)
        .set("x-auth-header", token)
        .send(payload);

    it("should return 404: stack not found", async () => {
      const response = await exec(
        { name: "test" },
        mongoose.Types.ObjectId().toHexString()
      );
      expect(response.status).toBe(404);
    });

    it("should return 200: stack updated", async () => {
      const stack = await Stack.findOne();
      const response = await exec({ name: "test updated" }, stack._id);
      expect(response.status).toBe(200);
      expect(response.body.name).toMatch(/updated/);
    });
  });

  describe("Delete /:_id", () => {
    const exec = async (id) =>
      await request(server)
        .delete(`/api/stacks/${id}`)
        .set("x-auth-header", token);

    it("should return 404: stack not found", async () => {
      const response = await exec(mongoose.Types.ObjectId().toHexString());
      expect(response.status).toBe(404);
    });

    it("should return 200: stack deleted", async () => {
      const stack = await Stack.findOne();
      const response = await exec(stack._id);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("name", stack.name);
    });
  });
});
