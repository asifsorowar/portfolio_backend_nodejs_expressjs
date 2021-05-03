module.exports = (logger) => (err, req, res, next) => {
  if (err.name === "ValidationError") {
    for (let attribute in err.errors) {
      logger.error(err.errors[attribute].message, err);
      return res.status(400).send(`${attribute} is required`);
    }
  }

  if (err.name === "MongoError" && err.code === 11000) {
    return res
      .status(400)
      .send(
        `${Object.keys(err.keyValue)[0]} ${
          err.keyValue[Object.keys(err.keyValue)[0]]
        } already existed!!`
      );
  }

  if (err.name === "CastError" && err.kind === "ObjectId") {
    return res.status(400).send("Invalid mongoDB id");
  }

  logger.error(err.message, err);

  next(err);
};
