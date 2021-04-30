const express = require("express");
const router = express.Router();
const { Admin } = require("../model/Admin");
const bcrypt = require("bcrypt");
const Joi = require("@hapi/joi");

router.post("/login", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const admin = await Admin.findOne({ email: req.body.email });
  if (!admin) return res.status(400).send("User not found!!");

  const verify = await bcrypt.compare(req.body.password, admin.password);
  if (!verify) return res.status(400).send("Email or Password is not match");

  const token = admin.getJwtToken();
  return res.status(200).send(token);
});

const validate = (admin) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });

  return schema.validate(admin);
};

module.exports = router;
