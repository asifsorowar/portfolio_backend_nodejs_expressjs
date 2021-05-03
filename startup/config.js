require("colors");
require("express-async-errors");
require("dotenv").config({ path: "./config/config.env" });

module.exports = () => {
  if (!process.env.JWT_KEY) {
    console.log("Fatal Error: JWT KEY is not provided ");
    process.exit(1);
  }
};
