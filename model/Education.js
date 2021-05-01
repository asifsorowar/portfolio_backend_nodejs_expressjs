const mongoose = require("mongoose");
const Joi = require("@hapi/joi");

const eduSchema = new mongoose.Schema(
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

const Education = mongoose.model("Education", eduSchema);

const validate = (edu) => {
  const schema = Joi.object({
    id: Joi.number().required(),
    institute: Joi.string().required(),
    years: Joi.string().required(),
    description: Joi.string().required(),
  });

  return schema.validate(edu);
};

module.exports.Education = Education;
module.exports.validate = validate;
