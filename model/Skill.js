const mongoose = require("mongoose");
const Joi = require("@hapi/joi");

const skillSchema = new mongoose.Schema({
  label: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SkillLabel",
    required: [true, "label is required"],
  },
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
  },
  level: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SkillLevel",
    required: [true, "level is required"],
  },
  value: {
    type: Number,
    required: true,
  },
});

const Skill = mongoose.model("Skill", skillSchema);

const validate = (skill) => {
  const schema = Joi.object({
    name: Joi.string().required().trim().min(3),
    level: Joi.objectId().required(),
    label: Joi.objectId().required(),
    value: Joi.number().required(),
  });

  return schema.validate(skill);
};

module.exports.Skill = Skill;
module.exports.validate = validate;
