const mongoose = require("mongoose");
const Joi = require("@hapi/joi");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  phone: {
    type: String,
    minlength: 11,
  },
  created: { type: Date, default: Date.now },
});

adminSchema.methods.getJwtToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      name: this.name,
      email: this.email,
      phone: this.phone,
    },
    process.env.JWT_KEY,
    {
      expiresIn: process.env.JWT_EXPIRE,
    }
  );

  return token;
};

adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  return next();
});

const Admin = mongoose.model("Admin", adminSchema);

const validate = (admin) => {
  const schema = Joi.object({
    name: Joi.string()
      .required()
      .regex(/^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,}$/)
      .message("Only A-Z characters allowed in name field!"),
    email: Joi.string().email().required(),
    phone: Joi.string()
      .required()
      .min(11)
      .max(11)
      .regex(/^[0-9]+$/)
      .message("Invalid phone number format"),
    password: Joi.string().required().min(8),
  });

  return schema.validate(admin);
};

module.exports.Admin = Admin;
module.exports.validate = validate;
