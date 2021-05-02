const express = require("express");
const router = express.Router();
const { ProjectCategory, validate } = require("../model/ProjectCategory");
const auth = require("../middleware/auth");
const isValidId = require("../middleware/isMongooseId");

router.get("/", async (req, res) => {
  const categories = await ProjectCategory.find().sort({ id: 1 });
  return res.send(categories);
});

router.post("/", [auth], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const category = new ProjectCategory(req.body);
  await category.save();

  return res.status(200).send(category);
});

router.put("/:_id", [auth, isValidId], async (req, res) => {
  const category = await ProjectCategory.findByIdAndUpdate(
    req.params._id,
    req.body,
    { new: true, runValidators: true }
  );
  if (!category) return res.status(400).send("Not found!");

  return res.status(200).send(category);
});

router.delete("/:_id", [auth, isValidId], async (req, res) => {
  const category = await ProjectCategory.findById(req.params._id);
  if (!category) return res.status(400).send("already deleted!");
  await category.remove();

  return res.status(400).send(category);
});

module.exports = router;
