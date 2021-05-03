const mongoose = require("mongoose");
const Joi = require("@hapi/joi");

const skillLabelSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      index: true,
      indexes: { unique: true },
    },
    label: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

skillLabelSchema.pre("remove", async function (next) {
  await this.model("Skill").deleteMany({ label: this._id });
  return next();
});

const SkillLabel = mongoose.model("SkillLabel", skillLabelSchema);

index = async () => await SkillLabel.createIndexes();
index();

const validate = (skillLabel) => {
  const schema = Joi.object({
    id: Joi.number().required(),
    label: Joi.string().required().trim().min(4),
  });

  return schema.validate(skillLabel);
};

module.exports.SkillLabel = SkillLabel;
module.exports.validate = validate;
