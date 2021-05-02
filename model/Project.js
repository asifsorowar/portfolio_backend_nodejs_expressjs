const mongoose = require("mongoose");
const Joi = require("@hapi/joi");

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
    },
    desc: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProjectCategory",
      required: true,
    },
    stacks: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Stack", required: true },
    ],
    photo: String,
  },
  { timestamps: true, strict: true }
);

const Project = mongoose.model("Project", projectSchema);

const validate = (project) => {
  const schema = Joi.object({
    title: Joi.string().required().min(3),
    desc: Joi.string().required().min(3),
    category: Joi.objectId().required(),
    stacks: Joi.array().required(),
    photo: Joi.string(),
  });

  return schema.validate(project);
};

module.exports.Project = Project;
module.exports.validate = validate;
