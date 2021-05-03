const express = require("express");
const router = express.Router();
const { Education, validate } = require("../model/Education");
const auth = require("../middleware/auth");
const mongooseId = require("../middleware/isMongooseId");
const admin = require("../middleware/admin");

router.get("/", async (req, res) => {
  const educations = await Education.find({}).sort({ id: -1 });

  return res.status(200).send(educations);
});

router.post("/", [auth, admin], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let education = await Education.findOne({ institute: req.body.institute });
  if (education)
    return res
      .status(400)
      .send(`${req.body.institute} is already existed in DB`);

  education = new Education(req.body);
  await education.save();

  return res.status(200).send(education);
});

router.put("/:_id", [auth, admin, mongooseId], async (req, res) => {
  const edu = await Education.findByIdAndUpdate(
    req.params._id,
    { ...req.body },
    {
      new: true,
      runValidators: true,
    }
  );
  if (!edu) return res.status(400).send("institute not found!!");

  return res.status(200).send(edu);
});

router.delete("/:_id", [auth, admin, mongooseId], async (req, res) => {
  const edu = await Education.findByIdAndDelete(req.params._id);
  if (!edu) return res.status(200).send("Already deleted!");

  return res.status(200).send(edu);
});

module.exports = router;
