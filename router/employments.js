const express = require("express");
const router = express.Router();
const { Employment, validate } = require("../model/Employment");
const auth = require("../middleware/auth");
const mongooseId = require("../middleware/isMongooseId");
const admin = require("../middleware/admin");

router.get("/", async (req, res) => {
  const employments = await Employment.find({}).sort({ id: -1 });

  return res.status(200).send(employments);
});

router.post("/", [auth, admin], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let employment = await Employment.findOne({
    institute: req.body.institute,
  });
  if (employment)
    return res
      .status(400)
      .send(`${req.body.institute} is already existed in DB`);

  employment = new Employment(req.body);
  await employment.save();

  return res.status(200).send(employment);
});

router.put("/:_id", [auth, admin, mongooseId], async (req, res) => {
  const employment = await Employment.findByIdAndUpdate(
    req.params._id,
    { ...req.body },
    {
      new: true,
      runValidators: true,
    }
  );
  if (!employment) return res.status(404).send("institute not found!!");

  return res.status(200).send(employment);
});

router.delete("/:_id", [auth, admin, mongooseId], async (req, res) => {
  const employment = await Employment.findByIdAndDelete(req.params._id);
  if (!employment) return res.status(404).send("Already deleted!");

  return res.status(200).send(employment);
});

module.exports = router;
