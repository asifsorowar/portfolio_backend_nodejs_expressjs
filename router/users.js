const express = require("express");
const auth = require("../middleware/auth.js");
const router = express.Router();
const { User, validate } = require("../model/User.js");

router.get("/me", [auth], async (req, res) => {
  const user = await User.findOne({ _id: req.user._id }).select("-password");
  return res.status(200).send(user);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already existed!");

  user = new User(req.body);
  await user.save();

  const token = user.getJwtToken();
  return res
    .status(200)
    .header("x-auth-header", token)
    .header("access-control-expose-headers", "x-auth-token")
    .send({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
    });
});

module.exports = router;
