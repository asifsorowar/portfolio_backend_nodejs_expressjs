const isMongooseId = require("../../../middleware/isMongooseId");
const mongoose = require("mongoose");

describe("mongoose id middleware", () => {
  it("should call next: mongoose id is valid", () => {
    const req = {
      params: { id: mongoose.Types.ObjectId().toHexString() },
    };
    res = {};
    next = jest.fn();
    isMongooseId(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it("should call res object's function: mongoose id is not valid", () => {
    const req = {
      params: { id: "1234" },
    };
    res = {
      status: jest.fn(() => res),
      send: jest.fn(),
    };
    next = jest.fn();
    isMongooseId(req, res, next);
    expect(res.send).toHaveBeenCalled();
  });
});
