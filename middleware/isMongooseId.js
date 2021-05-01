const mongoose = require("mongoose");

module.exports = (req, res, next) => {
  if (req.params) {
    for (let key in req.params) {
      if (mongoose.isValidObjectId(req.params[key])) return next();
      return res.status(400).send(`${key} is not valid`);
    }
  }
};
