const express = require("express");
const path = require("path");
const fs = require("fs");

const auth = require("../middleware/auth");
const router = express.Router();
const { My_Info, validate } = require("../model/My_Info");

router.get("/", async (req, res) => {
  const my_info = await My_Info.findOne();
  return res.send(my_info);
});

router.post("/", [auth], async (req, res) => {
  let my_info = await My_Info.findOne();
  if (my_info) return res.status(400).send("Info already existed");

  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  my_info = new My_Info(req.body);
  await my_info.save();

  return res.status(200).send(my_info);
});

router.put("/", [auth], async (req, res, next) => {
  const my_info = await My_Info.findOneAndUpdate({}, req.body, {
    new: true,
    runValidators: true,
  });
  return res.status(200).send(my_info);
});

router.put("/photo", auth, async (req, res) => {
  if (!req.files) return res.status(400).send("Please upload an image!");
  const file = req.files.file;
  if (!file.mimetype.startsWith("image"))
    return res.status(200).send("Please upload an image!!");

  if (file.size > process.env.PHOTO_SIZE)
    return res
      .status(400)
      .send(`Image must be less then ${process.env.PHOTO_SIZE / 1000000} MB`);

  file.name = `profile_picture${path.parse(file.name).ext}`;
  filePath = `${path.parse(__dirname).dir}${process.env.PHOTO_UPLOAD_PATH}/${
    file.name
  }`;

  const exist = fs.existsSync(filePath);
  if (exist) {
    fs.unlinkSync(filePath);
  }

  await file.mv(filePath);
  const my_info = await My_Info.findOneAndUpdate(
    {},
    { photo: file.name },
    { new: true }
  );
  return res.status(200).send(my_info);
});

router.put("/cv", auth, async (req, res) => {
  if (!req.files)
    return res.status(400).send("Please upload the resume as pdf format!");
  const file = req.files.file;
  if (
    !file.mimetype.startsWith("application/pdf") &&
    !file.mimetype.startsWith("application/msword")
  )
    return res.status(200).send("Please upload the resume as pdf format!");

  file.name = `resume${path.parse(file.name).ext}`;
  filePath = `${path.parse(__dirname).dir}${process.env.FILE_UPLOAD_PATH}/${
    file.name
  }`;

  const exist = fs.existsSync(filePath);
  if (exist) {
    fs.unlinkSync(filePath);
  }

  await file.mv(filePath);
  const my_info = await My_Info.findOneAndUpdate(
    {},
    { cv: file.name },
    { new: true }
  );
  return res.status(200).send(my_info);
});

module.exports = router;
