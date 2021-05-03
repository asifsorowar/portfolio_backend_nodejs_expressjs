const express = require("express");
const router = express.Router();
const { Stack, validate } = require("../model/Stack");
const auth = require("../middleware/auth");
const isValidId = require("../middleware/isMongooseId");
const admin = require("../middleware/admin");

router.get("/", [auth, admin], async (req, res) => {
  const stacks = await Stack.find();
  return res.send(stacks);
});

router.post("/", [auth, admin], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let stack = await Stack.findOne({ name: req.body.name });
  if (stack) return res.status(400).send(`${req.body.name} already available!`);

  stack = new Stack(req.body);
  await stack.save();

  return res.status(200).send(stack);
});

router.put("/:_id", [auth, admin, isValidId], async (req, res) => {
  const stack = await Stack.findByIdAndUpdate(req.params._id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!stack) return res.status(400).send("Not found!");

  return res.status(200).send(stack);
});

router.delete("/:_id", [auth, admin, isValidId], async (req, res) => {
  const stack = await Stack.findById(req.params._id);
  if (!stack) return res.status(400).send("already deleted!");
  await stack.remove();

  return res.status(400).send(stack);
});

module.exports = router;
