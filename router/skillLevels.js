const express = require("express");
const router = express.Router();
const { SkillLevel, validate } = require("../model/SkillLevel");
const auth = require("../middleware/auth");
const isValidId = require("../middleware/isMongooseId");
const admin = require("../middleware/admin");

router.get("/", [auth, admin], async (req, res) => {
  const levels = await SkillLevel.find({}).sort({ id: 1 });
  return res.status(200).send(levels);
});

router.post("/", [auth, admin], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let level = await SkillLevel.findOne({ level: req.body.level });
  if (level) return res.status(400).send(`${req.body.level} already existed!`);

  level = new SkillLevel(req.body);
  await level.save();

  return res.status(200).send(level);
});

router.put("/:_id", [auth, admin, isValidId], async (req, res) => {
  const level = await SkillLevel.findByIdAndUpdate(req.params._id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!level) return res.status(400).send("Not found!");

  return res.status(200).send(level);
});

router.delete("/:_id", [auth, admin, isValidId], async (req, res) => {
  const level = await SkillLevel.findByIdAndDelete(req.params._id);
  if (!level) res.status(400).send("already deleted!");

  return res.status(200).send(level);
});

module.exports = router;
