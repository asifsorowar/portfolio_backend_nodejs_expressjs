const express = require("express");
const fileUpload = require("express-fileupload");
const morgan = require("morgan");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("xss-clean");
const hpp = require("hpp");
const cors = require("cors");

const users = require("../router/users");
const auth = require("../router/auth");
const my_infos = require("../router/my_infos.js");
const educations = require("../router/educations");
const employments = require("../router/employments");
const skillLabels = require("../router/skillLabels");
const skillLevels = require("../router/skillLevels");
const skills = require("../router/skills");
const projectCategories = require("../router/projectCategories");
const stacks = require("../router/stacks");
const projects = require("../router/projects");
const contacts = require("../router/contacts");
const error = require("../middleware/error.js");
const logger = require("./logging");

module.exports = (app) => {
  app.use(express.json());
  app.use(express.static("public"));
  app.use(fileUpload());
  app.use(helmet());
  app.use(mongoSanitize());
  app.use(xss());
  app.use(hpp());
  app.use(cors());
  if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
  }

  app.use("/api/users", users);
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
  app.use("/api/contacts", contacts);
  app.use(error(logger));
};
