const request = require("supertest");
const { User } = require("../../model/User");
const { My_Info } = require("../../model/My_Info");
let server;
let token;
let filePath;
let payload;

describe("/api/my_infos", () => {
  beforeEach(async () => {
    server = require("../../index");
    token = new User({ role: "admin" }).getJwtToken();
    await My_Info.collection.deleteMany({});
    payload = {
      name: "test",
      email: "test@gmail.com",
      phone: "01766771609",
      address: "test",
      description: "test test test test test",
      about: "test test test test test",
      resumeAbout: "test test test test test",
    };
    await My_Info.create(payload);
  });
  afterEach(async () => {
    await My_Info.collection.deleteMany({});
    await server.close();
  });

  describe("Get /", () => {
    it("should return all my infos", async () => {
      const res = await request(server).get("/api/my_infos");
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("name");
    });
  });

  describe("Post /", () => {
    const exec = async (payload) =>
      await request(server)
        .post("/api/my_infos")
        .set("x-auth-header", token)
        .send(payload);
    it("should return 401: authentication error ", async () => {
      token = "";
      const res = await exec({ name: "test" });
      expect(res.status).toBe(401);
    });

    it("should return 403: not admin", async () => {
      token = new User().getJwtToken();
      const res = await exec({ name: "test" });
      expect(res.status).toBe(403);
    });

    it("should return 400: already existed,here user is admin", async () => {
      const res = await exec({ name: "test" });
      expect(res.status).toBe(400);
    });

    it("should return 400: validation error", async () => {
      await My_Info.deleteMany({});
      payload.email = "";
      const res = await exec(payload);
      expect(res.status).toBe(400);
    });

    it("should return 200: successfully create the infos", async () => {
      await My_Info.collection.deleteMany({});
      const res = await exec(payload);
      expect(res.status).toBe(200);
      expect(res.body.name).toBeDefined();
    });
  });

  describe("put /", () => {
    const exec = async (payload) =>
      await request(server)
        .put("/api/my_infos")
        .set("x-auth-header", token)
        .send(payload);

    it("should return 401: authentication error ", async () => {
      token = "";
      const res = await exec({ name: "test" });
      expect(res.status).toBe(401);
    });

    it("should return 403: not admin", async () => {
      token = new User().getJwtToken();
      const res = await exec({ name: "test" });
      expect(res.status).toBe(403);
    });

    it("should return 400: validation error: name should not empty,here user is admin", async () => {
      const res = await exec({ name: "" });
      expect(res.status).toBe(400);
    });

    it("should return 200: here user is admin", async () => {
      const res = await exec({ name: "test Asif" });
      expect(res.status).toBe(200);
      expect(res.body.name).toBe("test Asif");
    });
  });

  describe("put /photo", () => {
    const exec = async () =>
      await request(server)
        .put("/api/my_infos/photo")
        .set("x-auth-header", token)
        .attach("file", filePath);

    it("should return 400 because no file is included", async () => {
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 because file not an image", async () => {
      filePath = `${__dirname}/test.pdf`;
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 200 upload image successfully", async () => {
      filePath = `${__dirname}/test.jpg`;
      const res = await exec();
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("photo");
    });
  });

  describe("put /cv", () => {
    const exec = async () =>
      await request(server)
        .put("/api/my_infos/cv")
        .set("x-auth-header", token)
        .attach("file", filePath);

    it("should return 400 because no file is included", async () => {
      filePath = "";
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 because not a pdf or word file", async () => {
      filePath = `${__dirname}/test.jpg`;
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 200 upload resume successfully", async () => {
      filePath = `${__dirname}/test.pdf`;
      const res = await exec();
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("cv");
    });
  });
});
