const mongoose = require("mongoose");
const Joi = require("@hapi/joi");

const skillLevelSchema = new mongoose.Schema(
  {
    level: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const SkillLevel = mongoose.model("SkillLevel", skillLevelSchema);

const validate = (skillLevel) => {
  const schema = Joi.object({
    level: Joi.string().required().trim().min(4),
  });

  return schema.validate(skillLevel);
};

module.exports.SkillLevel = SkillLevel;
module.exports.validate = validate;
