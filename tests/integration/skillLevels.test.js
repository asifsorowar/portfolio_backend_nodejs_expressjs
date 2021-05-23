const request = require("supertest");
const { SkillLevel } = require("../../model/SkillLevel");
const { User } = require("../../model/User");
const mongoose = require("mongoose");
let token;
let payload;
let server;

describe("/api/skill_levels", () => {
  beforeEach(async () => {
    server = require("../../index");
    token = new User({ role: "admin" }).getJwtToken();
    payload = {
      level: "test 3",
    };
    await SkillLevel.collection.insertMany([
      { level: "test 1" },
      { level: "test 2" },
    ]);
  });

  afterEach(async () => {
    await SkillLevel.collection.deleteMany({});
    await server.close();
  });

  describe("Get /", () => {
    const exec = async () =>
      await request(server)
        .get("/api/skill_levels")
        .set("x-auth-header", token);

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
    it("should return all skill levels", async () => {
      const res = await exec();
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
    });
  });

  describe("Post /", () => {
    const exec = async (payload) =>
      await request(server)
        .post("/api/skill_levels")
        .set("x-auth-header", token)
        .send(payload);
    it("should return 401: authentication error ", async () => {
      token = "";
      const res = await exec({ level: "test 3" });
      expect(res.status).toBe(401);
    });

    it("should return 403: not admin", async () => {
      token = new User().getJwtToken();
      const res = await exec({ level: "test 3" });
      expect(res.status).toBe(403);
    });

    it("should return 400: validation error", async () => {
      payload.level = "";
      const res = await exec(payload);
      expect(res.status).toBe(400);
    });

    it("should return 400: duplication error", async () => {
      payload.id = 1;
      const res = await exec(payload);
      expect(res.status).toBe(400);
    });

    it("should return 400: one level has same name", async () => {
      payload.level = "test 1";
      const res = await exec(payload);
      expect(res.status).toBe(400);
    });

    it("should return 200: successfully create the skill level", async () => {
      const res = await exec(payload);
      expect(res.status).toBe(200);
      expect(res.body.level).toMatch(/3/);
    });
  });

  describe("Put /:_id", () => {
    const exec = async (payload, id) =>
      await request(server)
        .put(`/api/skill_levels/${id}`)
        .set("x-auth-header", token)
        .send(payload);

    it("should return 404: skill level not found", async () => {
      const response = await exec(
        { level: "test" },
        mongoose.Types.ObjectId().toHexString()
      );
      expect(response.status).toBe(404);
    });

    it("should return 200: skill level updated", async () => {
      const skillLevel = await SkillLevel.findOne();
      const response = await exec({ level: "test updated" }, skillLevel._id);
      expect(response.status).toBe(200);
      expect(response.body.level).toMatch(/updated/);
    });
  });

  describe("Delete /:_id", () => {
    const exec = async (id) =>
      await request(server)
        .delete(`/api/skill_levels/${id}`)
        .set("x-auth-header", token);

    it("should return 404: skill level not found", async () => {
      const response = await exec(mongoose.Types.ObjectId().toHexString());
      expect(response.status).toBe(404);
    });

    it("should return 200: skill level deleted", async () => {
      const skillLevel = await SkillLevel.findOne();
      const response = await exec(skillLevel._id);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("level", skillLevel.level);
    });
  });
});
