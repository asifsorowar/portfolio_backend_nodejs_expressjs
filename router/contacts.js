const express = require("express");
const router = express.Router();
const { Contact, validate } = require("../model/Contact");
const auth = require("../middleware/auth");
const isMongooseId = require("../middleware/isMongooseId");
const admin = require("../middleware/admin");

router.get("/", [auth, admin], async (req, res) => {
  const contacts = await Contact.find().sort("-create_at");

  return res.status(200).send(contacts);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const contact = new Contact(req.body);
  await contact.save();

  return res.send(contact);
});

router.delete("/:_id", [auth, admin, isMongooseId], async (req, res) => {
  const contact = await Contact.findByIdAndDelete(req.params._id);
  if (!contact) return res.status(400).send("already deleted!");

  return res.send(contact);
});

module.exports = router;
