const admin = require("../../../middleware/admin");

describe("admin middleware", () => {
  it("should call next function: user is admin", () => {
    const req = { user: { role: "admin" } };
    const next = jest.fn();
    const res = {};
    admin(req, res, next);
    expect(next).toHaveBeenCalled();
  });
});
