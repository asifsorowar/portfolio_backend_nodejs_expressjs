const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const Joi = require("@hapi/joi");

const my_infoSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
    minlength: 11,
  },
  address: {
    type: String,
    required: true,
  },
  photo: {
    type: Object,
  },
  cv: {
    type: Object,
  },
  created: { type: Date, default: Date.now },
  edited: { type: Date },
});

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
      .regex(/^[0-9]+$/)
      .required(),
    address: Joi.string().required(),
  });

  return schema.validate(info);
};

module.exports.My_Info = My_Info;
module.exports.validate = validate;
