require("colors");
const express = require("express");
const app = express();

require("./startup/config")();
require("./startup/validation")();
require("./startup/db")();
require("./startup/router")(app);

const { NAME, NODE_ENV, PORT } = process.env;

const port = PORT || 5000;

const server = app.listen(port, () =>
  console.log(
    `${NAME} - ${NODE_ENV}`.yellow.bold +
      ` is running on port ${port}.....`.green
  )
);

module.exports = server;
