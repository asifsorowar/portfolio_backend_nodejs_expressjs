const express = require("express");
const router = express.Router();
const { Project, validate } = require("../model/Project");
const { ProjectCategory } = require("../model/ProjectCategory");
const { Stack } = require("../model/Stack");
const mongoose = require("mongoose");
const auth = require("../middleware/auth");
const isMongooseId = require("../middleware/isMongooseId");
const admin = require("../middleware/admin");
const fs = require("fs");
const path = require("path");

router.get("/", async (req, res) => {
  const projects = await Project.find();
  return res.send(projects);
});

router.post("/", [auth, admin], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let project = await Project.findOne({ title: req.body.title });
  if (project)
    return res.status(400).send(`${req.body.title} already existed!`);

  if (!isValidId(req.body.category))
    return res.status(400).send("invalid category id!");
  req.body.stacks.forEach((stack) => {
    if (!isValidId(stack)) return res.status(400).send("invalid stack id!");
  });

  const category = await ProjectCategory.findById(req.body.category);
  if (!category) return res.status(400).send("category not found!");
  req.body.stacks.forEach(async (stack) => {
    stack = await Stack.findById(stack);
    if (!stack) return res.status(400).send("stack not found!");
  });

  project = new Project(req.body);

  await project.save();

  return res.status(200).send(project);
});

router.put("/:_id/photo", [auth, admin, isMongooseId], async (req, res) => {
  let project = await Project.findById(req.params._id);
  if (!project) return res.status(400).send("Project not found!");

  const file = req.files.file;
  if (!file) return res.status(400).send("Please upload an image in file key!");

  if (!file.mimetype.startsWith("image"))
    return res.status(200).send("Please upload an image!!");

  if (file.size > process.env.PHOTO_SIZE)
    return res
      .status(400)
      .send(`Image must be less then ${process.env.PHOTO_SIZE / 1000000} MB`);

  file.name = `${project._id}_${path.parse(file.name).ext}`;
  filePath = `${path.parse(__dirname).dir}${process.env.PHOTO_UPLOAD_PATH}/${
    file.name
  }`;

  const exist = fs.existsSync(filePath);
  if (exist) {
    fs.unlinkSync(filePath);
  }
  await file.mv(filePath);

  project = await Project.findByIdAndUpdate(
    project._id,
    { photo: file.name },
    { new: true, runValidators: true }
  );

  return res.status(200).send(project);
});

router.put("/:_id", [auth, admin, isMongooseId], async (req, res) => {
  const category = req.body.category;
  const stacks = req.body.stacks;

  if (category) {
    if (!isValidId(category))
      return res.status(400).send("invalid category id!");
    const category = await ProjectCategory.findById(category);
    if (!category) return res.status(400).send("category not found!");
  }
  if (stacks) {
    stacks.forEach((stack) => {
      if (!isValidId(stack)) return res.status(400).send("invalid stack id!");
    });

    stacks.forEach(async (stack) => {
      stack = await Stack.findById(stack);
      if (!stack) return res.status(400).send("stack not found!");
    });
  }

  const project = await Project.findByIdAndUpdate(req.params._id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!project) return res.status(400).send("project not found!");

  return res.status(200).send(project);
});

router.delete("/:_id", [auth, admin, isMongooseId], async (req, res) => {
  const project = await Project.findById(req.params._id);
  if (!project) return res.status(400).send("project not found!");
  await project.remove();

  photoName = project.photo;
  filePath = `${path.parse(__dirname).dir}${
    process.env.PHOTO_UPLOAD_PATH
  }/${photoName}`;

  const exist = fs.existsSync(filePath);
  if (exist) {
    fs.unlinkSync(filePath);
  }

  return res.status(200).send(project);
});

function isValidId(id) {
  return mongoose.isValidObjectId(id);
}

module.exports = router;
