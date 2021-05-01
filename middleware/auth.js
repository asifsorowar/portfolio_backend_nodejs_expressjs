const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const token = req.header("x-auth-header");
  if (!token) return res.status(401).send("Access denied! no token provided");

  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    req.user = decoded;
    return next();
  } catch (error) {
    return res.status(400).send("Invalid token");
  }
};
