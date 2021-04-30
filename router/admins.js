const express = require("express");
const auth = require("../middleware/auth.js");
const router = express.Router();
const { Admin, validate } = require("../model/Admin.js");

router.get("/me", [auth], async (req, res) => {
  const admin = await Admin.findOne({ _id: req.admin._id }).select("-password");
  return res.status(200).send(admin);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let admin = await Admin.findOne({ email: req.body.email });
  if (admin) return res.status(400).send("User already existed!");

  admin = new Admin(req.body);
  await admin.save();

  const token = admin.getJwtToken();
  return res
    .status(200)
    .header("x-auth-header", token)
    .header("access-control-expose-headers", "x-auth-token")
    .send({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      phone: admin.phone,
    });
});

module.exports = router;
