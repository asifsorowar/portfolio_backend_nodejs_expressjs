const request = require("supertest");
const { SkillLabel } = require("../../model/SkillLabel");
const { User } = require("../../model/User");
const mongoose = require("mongoose");
let token;
let payload;
let server;

describe("/api/skill_labels", () => {
  beforeEach(async () => {
    server = require("../../index");
    token = new User({ role: "admin" }).getJwtToken();
    payload = {
      id: 3,
      label: "test 3",
    };
    await SkillLabel.collection.insertMany([
      { id: 1, label: "test 1" },
      { id: 2, label: "test 2" },
    ]);
  });

  afterEach(async () => {
    await SkillLabel.collection.deleteMany({});
    await server.close();
  });

  describe("Get /", () => {
    it("should return all skill labels", async () => {
      const res = await request(server).get("/api/skill_labels");
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
    });
  });

  describe("Post /", () => {
    const exec = async (payload) =>
      await request(server)
        .post("/api/skill_labels")
        .set("x-auth-header", token)
        .send(payload);
    it("should return 401: authentication error ", async () => {
      token = "";
      const res = await exec({ label: "test 3" });
      expect(res.status).toBe(401);
    });

    it("should return 403: not admin", async () => {
      token = new User().getJwtToken();
      const res = await exec({ label: "test 3" });
      expect(res.status).toBe(403);
    });

    it("should return 400: validation error", async () => {
      payload.label = "";
      const res = await exec(payload);
      expect(res.status).toBe(400);
    });

    it("should return 400: duplication error", async () => {
      payload.id = 1;
      const res = await exec(payload);
      expect(res.status).toBe(400);
    });

    it("should return 400: one label has same name", async () => {
      payload.label = "test 1";
      const res = await exec(payload);
      expect(res.status).toBe(400);
    });

    it("should return 200: successfully create the skill label", async () => {
      const res = await exec(payload);
      expect(res.status).toBe(200);
      expect(res.body.label).toMatch(/3/);
    });
  });

  describe("Put /:_id", () => {
    const exec = async (payload, id) =>
      await request(server)
        .put(`/api/skill_labels/${id}`)
        .set("x-auth-header", token)
        .send(payload);

    it("should return 404: skill label not found", async () => {
      const response = await exec(
        { label: "test" },
        mongoose.Types.ObjectId().toHexString()
      );
      expect(response.status).toBe(404);
    });

    it("should return 200: skill label updated", async () => {
      const skillLabel = await SkillLabel.findOne();
      const response = await exec({ label: "test updated" }, skillLabel._id);
      expect(response.status).toBe(200);
      expect(response.body.label).toMatch(/updated/);
    });
  });

  describe("Delete /:_id", () => {
    const exec = async (id) =>
      await request(server)
        .delete(`/api/skill_Labels/${id}`)
        .set("x-auth-header", token);

    it("should return 404: skill label not found", async () => {
      const response = await exec(mongoose.Types.ObjectId().toHexString());
      expect(response.status).toBe(404);
    });

    it("should return 200: skill label deleted", async () => {
      const skillLabel = await SkillLabel.findOne();
      const response = await exec(skillLabel._id);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("label", skillLabel.label);
    });
  });
});
