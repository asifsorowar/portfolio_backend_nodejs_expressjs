module.exports = (err, req, res, next) => {
  if (err.name === "ValidationError") {
    for (let attribute in err.errors)
      return res.status(400).send(`${attribute} is required`);
  }

  next(err);
};
