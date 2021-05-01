const mongoose = require("mongoose");
const Joi = require("@hapi/joi");

const employmentSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      indexes: { unique: true },
    },
    institute: {
      type: String,
      required: true,
      trim: true,
    },
    years: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const Employment = mongoose.model("Employment", employmentSchema);

const validate = (employment) => {
  const schema = Joi.object({
    id: Joi.number().required(),
    institute: Joi.string().required(),
    years: Joi.string().required(),
    description: Joi.string().required(),
  });

  return schema.validate(employment);
};

module.exports.Employment = Employment;
module.exports.validate = validate;
