require("express-async-errors");
require("dotenv").config({ path: "./config/config.env" });
const express = require("express");
require("colors");
const mongoose = require("mongoose");
const fileUpload = require("express-fileupload");

const error = require("./middleware/error.js");
const app = express();

const my_info = require("./router/my_infos.js");
const admins = require("./router/admins");
const auth = require("./router/auth");

app.use(express.json());
app.use(express.static("public"));
app.use(fileUpload());
app.use("/api/my_info", my_info);
app.use("/api/admin", admins);
app.use("/api/auth", auth);
app.use(error);

mongoose
  .connect(process.env.DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => console.log("mongodb is connected.....".green))
  .catch(() => console.log("could not connected to mongodb.....".red));

const { NAME, NODE_ENV, PORT } = process.env;

const port = PORT || 5000;

app.listen(port, () =>
  console.log(
    `${NAME} - ${NODE_ENV}`.yellow.bold +
      ` is running on port ${port}.....`.green
  )
);

if (!process.env.JWT_KEY) {
  console.log("Fatal Error: JWT KEY is not provided ");
  process.exit(1);
}
