const mongoose = require("mongoose");
const Joi = require("@hapi/joi");

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      min: 4,
      trim: true,
    },
    email: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      min: 5,
    },
  },
  { timestamps: true }
);

const Contact = mongoose.model("Contact", contactSchema);

const validate = (contact) => {
  const schema = Joi.object({
    name: Joi.string()
      .required()
      .trim()
      .regex(/^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,}$/)
      .message("Only A-Z characters allowed!"),
    email: Joi.string().email().required(),
    message: Joi.string().min(5).required().trim(),
  });

  return schema.validate(contact);
};

module.exports.Contact = Contact;
module.exports.validate = validate;
