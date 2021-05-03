const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const Joi = require("@hapi/joi");

const my_infoSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      minlength: 11,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      minlength: 5,
      trim: true,
    },
    about: {
      type: String,
      minlength: 10,
      trim: true,
    },
    resumeAbout: {
      type: String,
      minlength: 10,
      trim: true,
    },
    photo: {
      type: Object,
    },
    cv: {
      type: Object,
    },
  },
  { timestamps: true }
);

const My_Info = mongoose.model("My_Info", my_infoSchema);

const validate = (info) => {
  const schema = Joi.object({
    name: Joi.string()
      .required()
      .regex(/^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,}$/)
      .message("Only A-Z characters allowed!"),
    email: Joi.string().email().required(),
    phone: Joi.string()
      .min(11)
      .regex(/^(01)[0-9]{9}$/) //(?=expression)(?=expression) and operation // same: /^(01)[0-9]+$/
      .required(),
    address: Joi.string().required(),
    description: Joi.string().required().min(5),
    about: Joi.string().min(10),
    resumeAbout: Joi.string().min(10).trim(),
  });

  return schema.validate(info);
};

module.exports.My_Info = My_Info;
module.exports.validate = validate;
