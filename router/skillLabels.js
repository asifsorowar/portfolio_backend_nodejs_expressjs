const express = require("express");
const router = express.Router();
const { SkillLabel, validate } = require("../model/SkillLabel");
const auth = require("../middleware/auth");
const isValidId = require("../middleware/isMongooseId");

router.get("/", async (req, res) => {
  const labels = await SkillLabel.find({}).sort({ id: 1 });
  return res.status(200).send(labels);
});

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let label = await SkillLabel.findOne({ label: req.body.label });
  if (label) return res.status(400).send(`${req.body.label} already existed!`);

  label = new SkillLabel(req.body);
  await label.save();

  return res.status(200).send(label);
});

router.put("/:_id", [auth, isValidId], async (req, res) => {
  const label = await SkillLabel.findByIdAndUpdate(req.params._id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!label) return res.status(400).send("Not found!");

  return res.status(200).send(label);
});

router.delete("/:_id", [auth, isValidId], async (req, res) => {
  const label = await SkillLabel.findOne({ _id: req.params._id });
  if (!label) return res.status(400).send("already deleted!");

  await label.remove();
  return res.status(200).send(label);
});

module.exports = router;
