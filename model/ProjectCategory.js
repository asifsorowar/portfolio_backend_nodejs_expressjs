const mongoose = require("mongoose");
const Joi = require("@hapi/joi");

const categorySchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      indexes: { unique: true },
    },
    name: {
      type: String,
      required: true,
      minlength: 3,
    },
  },
  { timestamps: true }
);

// categorySchema.pre("remove", async function (next) {
//   await this.model("Project").deleteMany({ category: this._id });
//   return next();
// });

const ProjectCategory = mongoose.model("ProjectCategory", categorySchema);

const validate = (category) => {
  const schema = Joi.object({
    id: Joi.number().required(),
    name: Joi.string().required().min(3),
  });

  return schema.validate(category);
};

module.exports.ProjectCategory = ProjectCategory;
module.exports.validate = validate;
