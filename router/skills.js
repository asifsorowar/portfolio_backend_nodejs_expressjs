const express = require("express");
const router = express.Router();
const { Skill, validate } = require("../model/Skill");
const { SkillLabel } = require("../model/SkillLabel");
const { SkillLevel } = require("../model/SkillLevel");
const auth = require("../middleware/auth");
const isValidId = require("../middleware/isMongooseId");
const mongoose = require("mongoose");
const admin = require("../middleware/admin");

router.get("/", async (req, res) => {
  const skills = await Skill.find({}).populate(["label", "level"]);
  return res.status(200).send(skills);
});

router.post("/", [auth, admin], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const level = await SkillLevel.findById(req.body.level);
  const label = await SkillLabel.findById(req.body.label);
  if (!(level && label))
    return res.status(400).send("level or label not valid!");

  let skill = await Skill.findOne({ name: req.body.name });
  if (skill) return res.status(400).send(`${req.body.name} already existed!`);

  skill = new Skill(req.body);
  await skill.save();

  return res.status(200).send(skill);
});

router.put("/:_id", [auth, admin, isValidId], async (req, res, next) => {
  if (req.body.level) {
    if (!validMongooseId(req.body.level))
      return res.status(400).send("not valid level id!");
    const level = await SkillLevel.findById(req.body.level);
    if (!level) return res.status(400).send("level not found!");
  }
  if (req.body.label) {
    if (!validMongooseId(req.body.label))
      return res.status(400).send("not valid label id!");
    const label = await SkillLabel.findById(req.body.label);
    if (!label) return res.status(400).send("label not found!");
  }

  const skill = await Skill.findByIdAndUpdate(req.params._id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!skill) return res.status(404).send("Not found!");

  return res.status(200).send(skill);
});

router.delete("/:_id", [auth, admin, isValidId], async (req, res) => {
  const skill = await Skill.findByIdAndDelete(req.params._id);
  if (!skill) return res.status(404).send("already deleted!");

  return res.status(200).send(skill);
});

function validMongooseId(id) {
  return mongoose.isValidObjectId(id);
}

module.exports = router;
