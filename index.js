require("express-async-errors");
require("dotenv").config({ path: "./config/config.env" });
const express = require("express");
require("colors");
const mongoose = require("mongoose");
const fileUpload = require("express-fileupload");

const Joi = require("@hapi/joi");
Joi.objectId = require("joi-objectid")(Joi);

const error = require("./middleware/error.js");
const app = express();

const users = require("./router/users");
const auth = require("./router/auth");
const my_infos = require("./router/my_infos.js");
const educations = require("./router/educations");
const employments = require("./router/employments");
const skillLabels = require("./router/skillLabels");
const skillLevels = require("./router/skillLevels");
const skills = require("./router/skills");
const projectCategories = require("./router/projectCategories");
const stacks = require("./router/stacks");
const projects = require("./router/projects");

app.use(express.json());
app.use(express.static("public"));
app.use(fileUpload());
app.use("/api/user", users);
app.use("/api/auth", auth);
app.use("/api/my_info", my_infos);
app.use("/api/educations", educations);
app.use("/api/employments", employments);
app.use("/api/skill_labels", skillLabels);
app.use("/api/skill_levels", skillLevels);
app.use("/api/skills", skills);
app.use("/api/categories", projectCategories);
app.use("/api/stacks", stacks);
app.use("/api/projects", projects);
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
