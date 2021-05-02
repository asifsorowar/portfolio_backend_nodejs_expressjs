const mongoose = require("mongoose");
const Joi = require("@hapi/joi");

const stackSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 3,
    },
  },
  { timestamps: true }
);

const Stack = mongoose.model("Stack", stackSchema);

const validate = (stack) => {
  const schema = Joi.object({
    name: Joi.string().required().min(3),
  });

  return schema.validate(stack);
};

module.exports.Stack = Stack;
module.exports.validate = validate;
