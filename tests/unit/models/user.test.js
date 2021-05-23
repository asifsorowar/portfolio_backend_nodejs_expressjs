const { User } = require("../../../model/User");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

describe("user.generateAuthToken", () => {
  it("should return a valid JWT", () => {
    const payload = {
      _id: mongoose.Types.ObjectId().toHexString(),
      name: "test",
      email: "test@gmail.com",
      phone: "01766771609",
      role: "admin",
    };

    const user = new User(payload);
    const token = user.getJwtToken();
    const decoded = jwt.verify(token, "1234");
    expect(decoded).toMatchObject(payload);
  });
});
