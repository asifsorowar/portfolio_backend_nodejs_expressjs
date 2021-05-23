const request = require("supertest");
const { Skill } = require("../../model/Skill");
const { SkillLabel } = require("../../model/SkillLabel");
const { SkillLevel } = require("../../model/SkillLevel");
const { User } = require("../../model/User");
const mongoose = require("mongoose");
let token;
let payload;
let server;
let validMongooseId;

describe("/api/skills", () => {
  beforeEach(async () => {
    server = require("../../index");
    token = new User({ role: "admin" }).getJwtToken();
    const label = await SkillLabel.create({ id: 1, label: "test" });
    const level = await SkillLevel.create({ id: 1, level: "test" });
    validMongooseId = mongoose.Types.ObjectId().toHexString();
    payload = {
      label: label._id,
      name: "test 3",
      level: level._id,
      value: 90,
    };

    await Skill.collection.insertMany([
      { label: label._id, name: "test 1", level: level._id, value: 70 },
      { label: label._id, name: "test 2", level: level._id, value: 70 },
    ]);
  });

  afterEach(async () => {
    await Skill.collection.deleteMany({});
    await SkillLabel.collection.deleteMany({});
    await SkillLevel.collection.deleteMany({});
    await server.close();
  });

  describe("Get /", () => {
    it("should return all skills", async () => {
      const res = await request(server).get("/api/skills");
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
    });
  });

  describe("Post /", () => {
    const exec = async (payload) =>
      await request(server)
        .post("/api/skills")
        .set("x-auth-header", token)
        .send(payload);
    it("should return 401: authentication error ", async () => {
      token = "";
      const res = await exec({
        label: validMongooseId,
        name: "test 1",
        level: validMongooseId,
      });
      expect(res.status).toBe(401);
    });

    it("should return 403: not admin", async () => {
      token = new User().getJwtToken();
      const res = await exec(payload);
      expect(res.status).toBe(403);
    });

    it("should return 400: validation error", async () => {
      payload.name = "";
      const res = await exec(payload);
      expect(res.status).toBe(400);
    });

    it("should return 400: label not found", async () => {
      payload.label = validMongooseId;
      const res = await exec(payload);
      expect(res.status).toBe(400);
    });

    it("should return 400: level not found", async () => {
      payload.level = validMongooseId;
      const res = await exec(payload);
      expect(res.status).toBe(400);
    });

    it("should return 400: one skill has same name", async () => {
      payload.name = "test 1";
      const res = await exec(payload);
      expect(res.status).toBe(400);
    });

    it("should return 200: successfully create the skill", async () => {
      const res = await exec(payload);
      expect(res.status).toBe(200);
      expect(res.body.name).toMatch(/3/);
    });
  });

  describe("Put /:_id", () => {
    const exec = async (payload, id) =>
      await request(server)
        .put(`/api/skills/${id}`)
        .set("x-auth-header", token)
        .send(payload);

    it("should return 404: skill not found", async () => {
      const response = await exec({ name: "test" }, validMongooseId);
      expect(response.status).toBe(404);
    });

    it("should return 400: skill label not valid", async () => {
      const skill = await Skill.findOne();
      const response = await exec({ label: "1234" }, skill._id);
      expect(response.status).toBe(400);
    });

    it("should return 400: skill level not valid", async () => {
      const skill = await Skill.findOne();
      const response = await exec({ level: "1234" }, skill._id);
      expect(response.status).toBe(400);
    });

    it("should return 400: skill label not found", async () => {
      const skill = await Skill.findOne();
      const response = await exec({ label: validMongooseId }, skill._id);
      expect(response.status).toBe(400);
    });

    it("should return 400: skill level not found", async () => {
      const skill = await Skill.findOne();
      const response = await exec({ level: validMongooseId }, skill._id);
      expect(response.status).toBe(400);
    });

    it("should return 200: skill updated", async () => {
      const skill = await Skill.findOne();
      const response = await exec({ name: "test updated" }, skill._id);
      expect(response.status).toBe(200);
      expect(response.body.name).toMatch(/updated/);
    });
  });

  describe("Delete /:_id", () => {
    const exec = async (id) =>
      await request(server)
        .delete(`/api/skills/${id}`)
        .set("x-auth-header", token);

    it("should return 404: skill not found", async () => {
      const response = await exec(validMongooseId);
      expect(response.status).toBe(404);
    });

    it("should return 200: skill deleted", async () => {
      const skill = await Skill.findOne();
      const response = await exec(skill._id);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("name", skill.name);
    });
  });
});
